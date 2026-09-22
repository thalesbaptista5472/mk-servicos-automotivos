import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';

let db: DatabaseSync;

export function getDb(): DatabaseSync {
  if (!db) {
    db = new DatabaseSync(config.dbPath);
    // Enable foreign keys and WAL mode
    db.exec('PRAGMA foreign_keys = ON;');
  }
  return db;
}

export function initDatabase(): void {
  const database = getDb();

  // Create Users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Clients table
  database.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Vehicles table
  database.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      year TEXT NOT NULL,
      plate TEXT NOT NULL,
      mileage TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Appointments table
  database.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      service TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Solicitação recebida',
      cancellation_reason TEXT,
      cancelled_by TEXT,
      cancelled_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Appointment History table
  database.exec(`
    CREATE TABLE IF NOT EXISTS appointment_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
      previous_status TEXT,
      new_status TEXT,
      note TEXT NOT NULL,
      user_name TEXT NOT NULL DEFAULT 'Sistema',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Business Schedule table
  database.exec(`
    CREATE TABLE IF NOT EXISTS business_schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_of_week INTEGER NOT NULL UNIQUE,
      day_name TEXT NOT NULL,
      open_time TEXT NOT NULL,
      close_time TEXT NOT NULL,
      lunch_start TEXT,
      lunch_end TEXT,
      slot_interval_minutes INTEGER DEFAULT 60,
      is_active INTEGER DEFAULT 1
    );
  `);

  // Create Blocked Slots table
  database.exec(`
    CREATE TABLE IF NOT EXISTS blocked_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      time TEXT,
      reason TEXT NOT NULL,
      created_by TEXT NOT NULL DEFAULT 'Administrador',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Workshop Settings table
  database.exec(`
    CREATE TABLE IF NOT EXISTS workshop_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed Default Admin User if none exists
  const checkAdmin = database.prepare('SELECT id FROM users WHERE email = ?').get(config.defaultAdmin.email);
  if (!checkAdmin) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(config.defaultAdmin.password, salt);
    database.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, 'admin')
    `).run(config.defaultAdmin.name, config.defaultAdmin.email, hash);
    console.log(`[Database] Default admin created: ${config.defaultAdmin.email}`);
  }

  // Seed Default Schedule if empty
  const scheduleCount = database.prepare('SELECT COUNT(*) as count FROM business_schedule').get() as { count: number };
  if (scheduleCount.count === 0) {
    const defaultDays = [
      { day: 0, name: 'Domingo', open: '08:00', close: '12:00', lunch_s: null, lunch_e: null, active: 0 },
      { day: 1, name: 'Segunda-feira', open: '08:00', close: '18:00', lunch_s: '12:00', lunch_e: '13:30', active: 1 },
      { day: 2, name: 'Terça-feira', open: '08:00', close: '18:00', lunch_s: '12:00', lunch_e: '13:30', active: 1 },
      { day: 3, name: 'Quarta-feira', open: '08:00', close: '18:00', lunch_s: '12:00', lunch_e: '13:30', active: 1 },
      { day: 4, name: 'Quinta-feira', open: '08:00', close: '18:00', lunch_s: '12:00', lunch_e: '13:30', active: 1 },
      { day: 5, name: 'Sexta-feira', open: '08:00', close: '18:00', lunch_s: '12:00', lunch_e: '13:30', active: 1 },
      { day: 6, name: 'Sábado', open: '08:00', close: '12:00', lunch_s: null, lunch_e: null, active: 1 },
    ];

    const insertSchedule = database.prepare(`
      INSERT INTO business_schedule (day_of_week, day_name, open_time, close_time, lunch_start, lunch_end, slot_interval_minutes, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 60, ?)
    `);

    for (const d of defaultDays) {
      insertSchedule.run(d.day, d.name, d.open, d.close, d.lunch_s, d.lunch_e, d.active);
    }
    console.log('[Database] Default business schedule initialized.');
  }

  // Seed Default Settings if empty
  const defaultSettings = [
    { key: 'workshop_name', value: 'MK SERVIÇOS AUTOMOTIVOS', desc: 'Nome oficial da oficina' },
    { key: 'workshop_phone', value: config.workshopPhone, desc: 'Telefone comercial' },
    { key: 'workshop_whatsapp', value: config.workshopWhatsApp, desc: 'WhatsApp para atendimento' },
    { key: 'workshop_email', value: config.workshopEmail, desc: 'E-mail de contato e notificações' },
    { key: 'workshop_address', value: config.workshopAddress, desc: 'Endereço físico' },
    { key: 'workshop_instagram', value: config.workshopInstagram, desc: 'Perfil do Instagram' },
    { key: 'workshop_maps_embed', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.0471206132333!2d-46.73236372467069!3d-23.530799778819515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef892bf4bfbfb%3A0x2a0fefc2a9ec682b!2sRua%20O%2C%2083%20-%20Vitoria%20Regia%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr', desc: 'URL iframe do Google Maps' }
  ];

  const insertSetting = database.prepare(`
    INSERT OR IGNORE INTO workshop_settings (key, value, description)
    VALUES (?, ?, ?)
  `);

  for (const s of defaultSettings) {
    insertSetting.run(s.key, s.value, s.desc);
  }

  console.log('[Database] Schema initialized successfully.');
}
