export interface Client {
  id?: number;
  name: string;
  email: string;
  phone: string;
}

export interface Vehicle {
  id?: number;
  client_id?: number;
  brand: string;
  model: string;
  year: string;
  plate: string;
  mileage?: string;
}

export type AppointmentStatus =
  | 'Solicitação recebida'
  | 'Aguardando confirmação'
  | 'Confirmado'
  | 'Em atendimento'
  | 'Concluído'
  | 'Cancelado';

export interface Appointment {
  id: number;
  client_id: number;
  vehicle_id: number;
  service: string;
  description?: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  cancellation_reason?: string;
  cancelled_by?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_year?: string;
  vehicle_plate?: string;
  vehicle_mileage?: string;
}

export interface AppointmentHistoryItem {
  id: number;
  appointment_id: number;
  previous_status: string | null;
  new_status: string | null;
  note: string;
  user_name: string;
  created_at: string;
}

export interface AvailableSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface SlotsResponse {
  date: string;
  dayName: string;
  isOpen: boolean;
  message?: string;
  slots: AvailableSlot[];
}

export interface BusinessDaySchedule {
  id: number;
  day_of_week: number;
  day_name: string;
  open_time: string;
  close_time: string;
  lunch_start: string | null;
  lunch_end: string | null;
  slot_interval_minutes: number;
  is_active: number;
}

export interface BlockedSlot {
  id: number;
  date: string;
  time: string | null;
  reason: string;
  created_by: string;
  created_at: string;
}

export interface DashboardKPIs {
  today: number;
  week: number;
  waiting: number;
  confirmed: number;
  cancelled: number;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  upcoming: Appointment[];
  statusStats: Array<{ status: string; count: number }>;
  dailyStats: Array<{ date: string; count: number }>;
}

export interface WorkshopSettings {
  workshop_name: string;
  workshop_phone: string;
  workshop_whatsapp: string;
  workshop_email: string;
  workshop_address: string;
  workshop_instagram: string;
  workshop_maps_embed: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface BookingFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehiclePlate: string;
  vehicleMileage: string;
  service: string;
  description: string;
  date: string;
  time: string;
}
