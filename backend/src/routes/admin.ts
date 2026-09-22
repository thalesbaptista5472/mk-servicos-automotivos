import { Router, Response } from 'express';
import { getDb } from '../db/index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

export const adminRouter = Router();

// Protect all admin routes
adminRouter.use(authMiddleware);

// 1. Dashboard Statistics
adminRouter.get('/dashboard', (req: AuthRequest, res: Response): void => {
  const db = getDb();
  const todayStr = new Date().toISOString().split('T')[0];

  // KPIs
  const todayRow = db.prepare(`
    SELECT COUNT(*) as count FROM appointments WHERE date = ? AND status != 'Cancelado'
  `).get(todayStr) as { count: number };

  const weekRow = db.prepare(`
    SELECT COUNT(*) as count FROM appointments
    WHERE date >= date('now', 'localtime', '-3 days')
      AND date <= date('now', 'localtime', '+7 days')
      AND status != 'Cancelado'
  `).get() as { count: number };

  const waitingRow = db.prepare(`
    SELECT COUNT(*) as count FROM appointments
    WHERE status IN ('Solicitação recebida', 'Aguardando confirmação')
  `).get() as { count: number };

  const confirmedRow = db.prepare(`
    SELECT COUNT(*) as count FROM appointments WHERE status = 'Confirmado'
  `).get() as { count: number };

  const cancelledRow = db.prepare(`
    SELECT COUNT(*) as count FROM appointments WHERE status = 'Cancelado'
  `).get() as { count: number };

  // Upcoming appointments
  const upcoming = db.prepare(`
    SELECT 
      a.id, a.date, a.time, a.service, a.status, a.description,
      c.name as client_name, c.phone as client_phone, c.email as client_email,
      v.brand as vehicle_brand, v.model as vehicle_model, v.year as vehicle_year, v.plate as vehicle_plate
    FROM appointments a
    JOIN clients c ON a.client_id = c.id
    JOIN vehicles v ON a.vehicle_id = v.id
    WHERE a.date >= ? AND a.status != 'Cancelado'
    ORDER BY a.date ASC, a.time ASC
    LIMIT 8
  `).all(todayStr);

  // Status Distribution for charts
  const statusStats = db.prepare(`
    SELECT status, COUNT(*) as count
    FROM appointments
    GROUP BY status
  `).all() as Array<{ status: string; count: number }>;

  // Recent 7 days volume
  const dailyStats = db.prepare(`
    SELECT date, COUNT(*) as count
    FROM appointments
    WHERE date >= date('now', 'localtime', '-7 days')
    GROUP BY date
    ORDER BY date ASC
  `).all() as Array<{ date: string; count: number }>;

  res.json({
    kpis: {
      today: todayRow.count,
      week: weekRow.count,
      waiting: waitingRow.count,
      confirmed: confirmedRow.count,
      cancelled: cancelledRow.count,
    },
    upcoming,
    statusStats,
    dailyStats,
  });
});

// 2. Appointments List with Filters
adminRouter.get('/appointments', (req: AuthRequest, res: Response): void => {
  const db = getDb();
  const { status, date, q } = req.query;

  let query = `
    SELECT 
      a.id, a.date, a.time, a.service, a.status, a.description,
      a.cancellation_reason, a.cancelled_by, a.cancelled_at, a.created_at, a.updated_at,
      c.name as client_name, c.phone as client_phone, c.email as client_email,
      v.brand as vehicle_brand, v.model as vehicle_model, v.year as vehicle_year, v.plate as vehicle_plate, v.mileage as vehicle_mileage
    FROM appointments a
    JOIN clients c ON a.client_id = c.id
    JOIN vehicles v ON a.vehicle_id = v.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (status && status !== 'all') {
    query += ' AND a.status = ?';
    params.push(status);
  }

  if (date) {
    query += ' AND a.date = ?';
    params.push(date);
  }

  if (q) {
    query += ` AND (
      c.name LIKE ? OR 
      c.email LIKE ? OR 
      c.phone LIKE ? OR 
      v.plate LIKE ? OR 
      v.model LIKE ?
    )`;
    const searchPattern = `%${q}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
  }

  query += ' ORDER BY a.date DESC, a.time DESC';

  const appointments = db.prepare(query).all(...params);
  res.json({ appointments });
});

// 3. Appointment Details with History
adminRouter.get('/appointments/:id', (req: AuthRequest, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  const db = getDb();

  const appointment = db.prepare(`
    SELECT 
      a.id, a.date, a.time, a.service, a.status, a.description,
      a.cancellation_reason, a.cancelled_by, a.cancelled_at, a.created_at, a.updated_at,
      c.id as client_id, c.name as client_name, c.phone as client_phone, c.email as client_email,
      v.id as vehicle_id, v.brand as vehicle_brand, v.model as vehicle_model, v.year as vehicle_year, v.plate as vehicle_plate, v.mileage as vehicle_mileage
    FROM appointments a
    JOIN clients c ON a.client_id = c.id
    JOIN vehicles v ON a.vehicle_id = v.id
    WHERE a.id = ?
  `).get(id);

  if (!appointment) {
    res.status(404).json({ error: 'Agendamento não encontrado.' });
    return;
  }

  const history = db.prepare(`
    SELECT id, previous_status, new_status, note, user_name, created_at
    FROM appointment_history
    WHERE appointment_id = ?
    ORDER BY created_at ASC
  `).all(id);

  res.json({ appointment, history });
});

// 4. Update Appointment Status
adminRouter.patch('/appointments/:id/status', (req: AuthRequest, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  const { status, note } = req.body;
  const adminName = req.user?.name || 'Administrador';

  const validStatuses = [
    'Solicitação recebida',
    'Aguardando confirmação',
    'Confirmado',
    'Em atendimento',
    'Concluído',
    'Cancelado',
  ];

  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: 'Status inválido fornecido.' });
    return;
  }

  const db = getDb();
  const current = db.prepare('SELECT status FROM appointments WHERE id = ?').get(id) as { status: string } | undefined;

  if (!current) {
    res.status(404).json({ error: 'Agendamento não encontrado.' });
    return;
  }

  const prevStatus = current.status;

  db.prepare(`
    UPDATE appointments 
    SET status = ?, updated_at = datetime('now', 'localtime')
    WHERE id = ?
  `).run(status, id);

  const historyNote = note || `Status alterado de "${prevStatus}" para "${status}".`;

  db.prepare(`
    INSERT INTO appointment_history (appointment_id, previous_status, new_status, note, user_name)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, prevStatus, status, historyNote, adminName);

  res.json({ success: true, message: `Status alterado para "${status}" com sucesso.` });
});

// 5. Reschedule Appointment
adminRouter.patch('/appointments/:id/reschedule', (req: AuthRequest, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  const { date, time, note } = req.body;
  const adminName = req.user?.name || 'Administrador';

  if (!date || !time) {
    res.status(400).json({ error: 'Data e horário são obrigatórios para reagendamento.' });
    return;
  }

  const db = getDb();
  const current = db.prepare('SELECT date, time FROM appointments WHERE id = ?').get(id) as { date: string; time: string } | undefined;

  if (!current) {
    res.status(404).json({ error: 'Agendamento não encontrado.' });
    return;
  }

  // Check collision (other appointment at this date/time)
  const collision = db.prepare(`
    SELECT id FROM appointments
    WHERE date = ? AND time = ? AND id != ? AND status != 'Cancelado'
  `).get(date, time, id);

  if (collision) {
    res.status(409).json({ error: 'Já existe outro agendamento ativo nesta data e horário.' });
    return;
  }

  db.prepare(`
    UPDATE appointments 
    SET date = ?, time = ?, updated_at = datetime('now', 'localtime')
    WHERE id = ?
  `).run(date, time, id);

  const historyNote = note || `Horário alterado de ${current.date} às ${current.time} para ${date} às ${time}.`;

  db.prepare(`
    INSERT INTO appointment_history (appointment_id, previous_status, new_status, note, user_name)
    VALUES (?, NULL, NULL, ?, ?)
  `).run(id, historyNote, adminName);

  res.json({ success: true, message: 'Agendamento reagendado com sucesso.' });
});

// 6. Cancel Appointment
adminRouter.post('/appointments/:id/cancel', (req: AuthRequest, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  const { reason } = req.body;
  const adminName = req.user?.name || 'Administrador';

  if (!reason || reason.trim().length < 3) {
    res.status(400).json({ error: 'O motivo do cancelamento é obrigatório.' });
    return;
  }

  const db = getDb();
  const current = db.prepare('SELECT status FROM appointments WHERE id = ?').get(id) as { status: string } | undefined;

  if (!current) {
    res.status(404).json({ error: 'Agendamento não encontrado.' });
    return;
  }

  db.prepare(`
    UPDATE appointments 
    SET status = 'Cancelado',
        cancellation_reason = ?,
        cancelled_by = ?,
        cancelled_at = datetime('now', 'localtime'),
        updated_at = datetime('now', 'localtime')
    WHERE id = ?
  `).run(reason.trim(), adminName, id);

  db.prepare(`
    INSERT INTO appointment_history (appointment_id, previous_status, new_status, note, user_name)
    VALUES (?, ?, 'Cancelado', ?, ?)
  `).run(id, current.status, `Agendamento cancelado. Motivo: ${reason.trim()}`, adminName);

  res.json({ success: true, message: 'Agendamento cancelado com sucesso.' });
});

// 7. Calendar View Feed
adminRouter.get('/calendar', (req: AuthRequest, res: Response): void => {
  const { start, end } = req.query;
  const db = getDb();

  let query = `
    SELECT 
      a.id, a.date, a.time, a.service, a.status,
      c.name as client_name, c.phone as client_phone,
      v.brand as vehicle_brand, v.model as vehicle_model, v.plate as vehicle_plate
    FROM appointments a
    JOIN clients c ON a.client_id = c.id
    JOIN vehicles v ON a.vehicle_id = v.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (start) {
    query += ' AND a.date >= ?';
    params.push(start);
  }
  if (end) {
    query += ' AND a.date <= ?';
    params.push(end);
  }

  query += ' ORDER BY a.date ASC, a.time ASC';

  const events = db.prepare(query).all(...params);

  // Also include blocked slots in calendar
  let blockQuery = 'SELECT id, date, time, reason FROM blocked_slots WHERE 1=1';
  const blockParams: any[] = [];
  if (start) {
    blockQuery += ' AND date >= ?';
    blockParams.push(start);
  }
  if (end) {
    blockQuery += ' AND date <= ?';
    blockParams.push(end);
  }
  const blocks = db.prepare(blockQuery).all(...blockParams);

  res.json({ appointments: events, blockedSlots: blocks });
});

// 8. Business Schedule Config
adminRouter.get('/schedule', (req: AuthRequest, res: Response): void => {
  const db = getDb();
  const schedule = db.prepare(`
    SELECT id, day_of_week, day_name, open_time, close_time, lunch_start, lunch_end, slot_interval_minutes, is_active
    FROM business_schedule
    ORDER BY day_of_week ASC
  `).all();
  res.json({ schedule });
});

adminRouter.put('/schedule/:id', (req: AuthRequest, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  const { open_time, close_time, lunch_start, lunch_end, is_active } = req.body;
  const db = getDb();

  db.prepare(`
    UPDATE business_schedule
    SET open_time = ?, close_time = ?, lunch_start = ?, lunch_end = ?, is_active = ?
    WHERE id = ?
  `).run(open_time, close_time, lunch_start || null, lunch_end || null, is_active ? 1 : 0, id);

  res.json({ success: true, message: 'Horário de funcionamento atualizado.' });
});

// 9. Blocked Slots Management
adminRouter.get('/blocked-slots', (req: AuthRequest, res: Response): void => {
  const db = getDb();
  const slots = db.prepare(`
    SELECT id, date, time, reason, created_by, created_at
    FROM blocked_slots
    ORDER BY date DESC, time ASC
  `).all();
  res.json({ blockedSlots: slots });
});

adminRouter.post('/blocked-slots', (req: AuthRequest, res: Response): void => {
  const { date, time, reason } = req.body;
  const adminName = req.user?.name || 'Administrador';

  if (!date || !reason) {
    res.status(400).json({ error: 'Data e motivo do bloqueio são obrigatórios.' });
    return;
  }

  const db = getDb();
  db.prepare(`
    INSERT INTO blocked_slots (date, time, reason, created_by)
    VALUES (?, ?, ?, ?)
  `).run(date, time || null, reason.trim(), adminName);

  res.status(201).json({ success: true, message: 'Horário bloqueado com sucesso.' });
});

adminRouter.delete('/blocked-slots/:id', (req: AuthRequest, res: Response): void => {
  const id = parseInt(req.params.id, 10);
  const db = getDb();
  db.prepare('DELETE FROM blocked_slots WHERE id = ?').run(id);
  res.json({ success: true, message: 'Bloqueio removido com sucesso.' });
});

// 10. Workshop Settings
adminRouter.get('/settings', (req: AuthRequest, res: Response): void => {
  const db = getDb();
  const rows = db.prepare('SELECT key, value, description FROM workshop_settings').all() as Array<{ key: string; value: string; description: string }>;
  const settings: Record<string, string> = {};
  for (const r of rows) {
    settings[r.key] = r.value;
  }
  res.json({ settings });
});

adminRouter.put('/settings', (req: AuthRequest, res: Response): void => {
  const db = getDb();
  const settings = req.body;

  const updateStmt = db.prepare(`
    INSERT INTO workshop_settings (key, value, updated_at)
    VALUES (?, ?, datetime('now', 'localtime'))
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = datetime('now', 'localtime')
  `);

  for (const [key, value] of Object.entries(settings)) {
    if (typeof value === 'string') {
      updateStmt.run(key, value);
    }
  }

  res.json({ success: true, message: 'Configurações da oficina atualizadas com sucesso.' });
});
