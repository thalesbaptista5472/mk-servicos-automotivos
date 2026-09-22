import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { initDatabase, getDb } from './db/index.js';
import { authRouter } from './routes/auth.js';
import { appointmentsRouter } from './routes/appointments.js';
import { adminRouter } from './routes/admin.js';

const app = express();

// Initialize Database
try {
  initDatabase();
} catch (error) {
  console.error('[Startup] Failed to initialize database:', error);
  process.exit(1);
}

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['*'];

app.use(cors({
  origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    workshop: 'MK SERVIÇOS AUTOMOTIVOS',
    timestamp: new Date().toISOString(),
  });
});

// Public Workshop Settings (Contact info, WhatsApp, address, etc.)
app.get('/api/settings/public', (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM workshop_settings').all() as Array<{ key: string; value: string }>;
    const settings: Record<string, string> = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    res.json({ settings });
  } catch (err) {
    res.json({
      settings: {
        workshop_name: 'MK SERVIÇOS AUTOMOTIVOS',
        workshop_phone: config.workshopPhone,
        workshop_whatsapp: config.workshopWhatsApp,
        workshop_email: config.workshopEmail,
        workshop_address: config.workshopAddress,
        workshop_instagram: config.workshopInstagram,
      }
    });
  }
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/admin', adminRouter);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

export { app };
export default app;

// Start Server if not running in serverless environment
if (!process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log('====================================================');
    console.log(`  MK SERVIÇOS AUTOMOTIVOS - BACKEND API`);
    console.log(`  Servidor rodando em: http://localhost:${config.port}`);
    console.log(`  Admin inicial: ${config.defaultAdmin.email}`);
    console.log('====================================================');
  });
}
