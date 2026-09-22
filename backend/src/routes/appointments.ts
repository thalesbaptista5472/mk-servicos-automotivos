import { Router, Request, Response } from 'express';
import { getDb } from '../db/index.js';
import { emailService } from '../services/emailService.js';

export const appointmentsRouter = Router();

// Helper to check time string in HH:MM format
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

// 1. Get available time slots for a given date
appointmentsRouter.get('/available-slots', (req: Request, res: Response): void => {
  const dateStr = req.query.date as string;
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    res.status(400).json({ error: 'Data inválida. Use o formato AAAA-MM-DD.' });
    return;
  }

  const db = getDb();
  const targetDate = new Date(`${dateStr}T12:00:00Z`);
  const dayOfWeek = targetDate.getUTCDay(); // 0 = Sunday, 1 = Monday, ...

  // Check business schedule for day of week
  const schedule = db.prepare(`
    SELECT day_name, open_time, close_time, lunch_start, lunch_end, slot_interval_minutes, is_active
    FROM business_schedule
    WHERE day_of_week = ?
  `).get(dayOfWeek) as {
    day_name: string;
    open_time: string;
    close_time: string;
    lunch_start: string | null;
    lunch_end: string | null;
    slot_interval_minutes: number;
    is_active: number;
  } | undefined;

  if (!schedule || schedule.is_active === 0) {
    res.json({
      date: dateStr,
      dayName: schedule ? schedule.day_name : 'Dia não configurado',
      isOpen: false,
      message: 'A oficina não abre aos domingos ou neste dia da semana.',
      slots: [],
    });
    return;
  }

  // Check if entire day is blocked
  const dayBlock = db.prepare(`
    SELECT reason FROM blocked_slots
    WHERE date = ? AND (time IS NULL OR time = '')
  `).get(dateStr) as { reason: string } | undefined;

  if (dayBlock) {
    res.json({
      date: dateStr,
      dayName: schedule.day_name,
      isOpen: false,
      message: `Dia bloqueado pela oficina: ${dayBlock.reason}`,
      slots: [],
    });
    return;
  }

  // Fetch blocked times for this date
  const blockedRows = db.prepare(`
    SELECT time, reason FROM blocked_slots
    WHERE date = ? AND time IS NOT NULL AND time != ''
  `).all(dateStr) as Array<{ time: string; reason: string }>;
  const blockedMap = new Map<string, string>();
  for (const b of blockedRows) {
    blockedMap.set(b.time, b.reason);
  }

  // Fetch booked appointments for this date (excluding cancelled)
  const bookedRows = db.prepare(`
    SELECT time FROM appointments
    WHERE date = ? AND status != 'Cancelado'
  `).all(dateStr) as Array<{ time: string }>;
  const bookedSet = new Set(bookedRows.map((r) => r.time));

  // Generate slots
  const openMins = timeToMinutes(schedule.open_time);
  const closeMins = timeToMinutes(schedule.close_time);
  const interval = schedule.slot_interval_minutes || 60;
  const lunchStartMins = schedule.lunch_start ? timeToMinutes(schedule.lunch_start) : -1;
  const lunchEndMins = schedule.lunch_end ? timeToMinutes(schedule.lunch_end) : -1;

  const slots: Array<{ time: string; available: boolean; reason?: string }> = [];

  for (let m = openMins; m < closeMins; m += interval) {
    // Check if slot overlaps with lunch break
    if (lunchStartMins !== -1 && lunchEndMins !== -1) {
      if (m >= lunchStartMins && m < lunchEndMins) {
        continue; // Skip lunch slots completely
      }
    }

    const timeStr = minutesToTime(m);

    if (blockedMap.has(timeStr)) {
      slots.push({
        time: timeStr,
        available: false,
        reason: blockedMap.get(timeStr) || 'Bloqueado pela oficina',
      });
    } else if (bookedSet.has(timeStr)) {
      slots.push({
        time: timeStr,
        available: false,
        reason: 'Horário já reservado',
      });
    } else {
      slots.push({
        time: timeStr,
        available: true,
      });
    }
  }

  res.json({
    date: dateStr,
    dayName: schedule.day_name,
    isOpen: true,
    slots,
  });
});

// 2. Create new appointment from public booking form
appointmentsRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      vehiclePlate,
      vehicleMileage,
      service,
      description,
      date,
      time,
    } = req.body;

    // Field validations
    if (!clientName || clientName.trim().length < 3) {
      res.status(400).json({ error: 'Nome completo é obrigatório (mínimo 3 caracteres).' });
      return;
    }
    if (!clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())) {
      res.status(400).json({ error: 'E-mail válido é obrigatório.' });
      return;
    }
    if (!clientPhone || clientPhone.replace(/\D/g, '').length < 10) {
      res.status(400).json({ error: 'Telefone/WhatsApp válido é obrigatório (DDD + número).' });
      return;
    }
    if (!vehicleBrand || !vehicleModel || !vehicleYear || !vehiclePlate) {
      res.status(400).json({ error: 'Dados do veículo incompletos (marca, modelo, ano e placa são obrigatórios).' });
      return;
    }
    if (!service) {
      res.status(400).json({ error: 'Selecione o serviço desejado.' });
      return;
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: 'Data inválida.' });
      return;
    }
    if (!time || !/^\d{2}:\d{2}$/.test(time)) {
      res.status(400).json({ error: 'Horário inválido.' });
      return;
    }

    const db = getDb();

    // Check if slot is blocked
    const isBlocked = db.prepare(`
      SELECT reason FROM blocked_slots
      WHERE date = ? AND (time = ? OR time IS NULL OR time = '')
    `).get(date, time) as { reason: string } | undefined;

    if (isBlocked) {
      res.status(409).json({
        error: `O horário selecionado não está disponível (${isBlocked.reason}). Por favor, escolha outro horário.`,
      });
      return;
    }

    // Check if slot is already booked
    const existing = db.prepare(`
      SELECT id FROM appointments
      WHERE date = ? AND time = ? AND status != 'Cancelado'
    `).get(date, time);

    if (existing) {
      res.status(409).json({
        error: 'Este horário acabou de ser preenchido por outro cliente. Por favor, escolha outro horário disponível.',
      });
      return;
    }

    // 1. Insert Client
    const clientResult = db.prepare(`
      INSERT INTO clients (name, email, phone)
      VALUES (?, ?, ?)
    `).run(clientName.trim(), clientEmail.trim().toLowerCase(), clientPhone.trim());
    const clientId = clientResult.lastInsertRowid;

    // 2. Insert Vehicle
    const vehicleResult = db.prepare(`
      INSERT INTO vehicles (client_id, brand, model, year, plate, mileage)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      clientId,
      vehicleBrand.trim().toUpperCase(),
      vehicleModel.trim(),
      vehicleYear.trim(),
      vehiclePlate.trim().toUpperCase(),
      vehicleMileage ? vehicleMileage.trim() : null
    );
    const vehicleId = vehicleResult.lastInsertRowid;

    // 3. Insert Appointment
    const now = new Date();
    const formattedDateNow = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');

    const apptResult = db.prepare(`
      INSERT INTO appointments (client_id, vehicle_id, service, description, date, time, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'Solicitação recebida', datetime('now', 'localtime'), datetime('now', 'localtime'))
    `).run(
      clientId,
      vehicleId,
      service.trim(),
      description ? description.trim() : '',
      date,
      time
    );
    const appointmentId = apptResult.lastInsertRowid;

    // 4. Insert Audit Log
    db.prepare(`
      INSERT INTO appointment_history (appointment_id, previous_status, new_status, note, user_name)
      VALUES (?, NULL, 'Solicitação recebida', 'Agendamento criado via website pelo cliente.', 'Cliente')
    `).run(appointmentId);

    // 5. Send automated emails (asynchronously, non-blocking)
    const emailPayload = {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      clientPhone: clientPhone.trim(),
      vehicleBrand: vehicleBrand.trim().toUpperCase(),
      vehicleModel: vehicleModel.trim(),
      vehicleYear: vehicleYear.trim(),
      vehiclePlate: vehiclePlate.trim().toUpperCase(),
      vehicleMileage: vehicleMileage ? vehicleMileage.trim() : '',
      service: service.trim(),
      date: date.split('-').reverse().join('/'),
      time,
      description: description ? description.trim() : '',
      createdAt: formattedDateNow,
    };

    // Run emails without waiting to ensure super fast API response
    Promise.all([
      emailService.sendNewAppointmentNotification(emailPayload),
      emailService.sendClientConfirmation(emailPayload),
    ]).catch((err) => console.error('[Appointments] Error sending background emails:', err));

    res.status(201).json({
      success: true,
      message: 'Solicitação recebida com sucesso. Aguarde a confirmação da oficina.',
      appointmentId,
      summary: {
        clientName: emailPayload.clientName,
        clientPhone: emailPayload.clientPhone,
        vehicle: `${emailPayload.vehicleBrand} ${emailPayload.vehicleModel} (${emailPayload.vehicleYear})`,
        plate: emailPayload.vehiclePlate,
        service: emailPayload.service,
        date: emailPayload.date,
        time: emailPayload.time,
        status: 'Solicitação recebida',
      },
    });
  } catch (error) {
    console.error('[Appointments] Error creating appointment:', error);
    res.status(500).json({ error: 'Erro ao registrar agendamento. Tente novamente mais tarde.' });
  }
});
