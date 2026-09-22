import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'mk_servicos_automotivos_jwt_secret_key_2026_super_secure',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Database file path
  dbPath: process.env.DB_PATH || path.resolve(process.cwd(), 'mk_database.sqlite'),

  // Workshop Contact Defaults
  workshopEmail: process.env.WORKSHOP_EMAIL || 'mkservicosautomotivos5@gmail.com',
  workshopPhone: process.env.WORKSHOP_PHONE || '(11) 98878-7548',
  workshopWhatsApp: process.env.WORKSHOP_WHATSAPP || '5511988787548',
  workshopAddress: process.env.WORKSHOP_ADDRESS || 'R. O, 79 - Jardim Vitória Régia (Zona Norte), São Paulo - SP, 02675-031',
  workshopInstagram: process.env.WORKSHOP_INSTAGRAM || '@mk.automotivos',

  // Email SMTP config
  email: {
    host: process.env.EMAIL_HOST || '',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    destination: process.env.EMAIL_DESTINATION || 'mkservicosautomotivos5@gmail.com',
    fromName: process.env.EMAIL_FROM_NAME || 'MK Serviços Automotivos',
  },

  // Default Admin Credentials
  defaultAdmin: {
    name: process.env.DEFAULT_ADMIN_NAME || 'Administrador MK',
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@mkservicos.com.br',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
  }
};
