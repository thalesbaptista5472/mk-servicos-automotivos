import {
  BookingFormData,
  SlotsResponse,
  DashboardData,
  Appointment,
  AppointmentHistoryItem,
  BusinessDaySchedule,
  BlockedSlot,
  WorkshopSettings,
  AuthUser,
} from '../types/index.js';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('mk_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Public Endpoints
  async getPublicSettings(): Promise<Partial<WorkshopSettings>> {
    const res = await fetch(`${API_BASE}/settings/public`);
    const data = await res.json();
    return data.settings;
  },

  async getAvailableSlots(date: string): Promise<SlotsResponse> {
    const res = await fetch(`${API_BASE}/appointments/available-slots?date=${date}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao carregar horários disponíveis.');
    }
    return res.json();
  },

  async createAppointment(data: BookingFormData): Promise<any> {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Erro ao processar agendamento.');
    }
    return result;
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Credenciais inválidas.');
    }
    localStorage.setItem('mk_admin_token', result.token);
    localStorage.setItem('mk_admin_user', JSON.stringify(result.user));
    return result;
  },

  getCurrentUser(): AuthUser | null {
    const user = localStorage.getItem('mk_admin_user');
    return user ? JSON.parse(user) : null;
  },

  logout(): void {
    localStorage.removeItem('mk_admin_token');
    localStorage.removeItem('mk_admin_user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('mk_admin_token');
  },

  // Admin Endpoints
  async getDashboard(): Promise<DashboardData> {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Não foi possível carregar o dashboard.');
    return res.json();
  },

  async getAppointments(filters?: { status?: string; date?: string; q?: string }): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date) params.append('date', filters.date);
    if (filters?.q) params.append('q', filters.q);

    const res = await fetch(`${API_BASE}/admin/appointments?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao listar agendamentos.');
    const data = await res.json();
    return data.appointments;
  },

  async getAppointment(id: number): Promise<{ appointment: Appointment; history: AppointmentHistoryItem[] }> {
    const res = await fetch(`${API_BASE}/admin/appointments/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao obter detalhes do agendamento.');
    return res.json();
  },

  async updateAppointmentStatus(id: number, status: string, note?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/appointments/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao atualizar status.');
    }
    return res.json();
  },

  async rescheduleAppointment(id: number, date: string, time: string, note?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/appointments/${id}/reschedule`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ date, time, note }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao reagendar compromisso.');
    }
    return res.json();
  },

  async cancelAppointment(id: number, reason: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/appointments/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao cancelar agendamento.');
    }
    return res.json();
  },

  async getCalendar(start?: string, end?: string): Promise<{ appointments: Appointment[]; blockedSlots: BlockedSlot[] }> {
    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);

    const res = await fetch(`${API_BASE}/admin/calendar?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao carregar calendário.');
    return res.json();
  },

  async getSchedule(): Promise<BusinessDaySchedule[]> {
    const res = await fetch(`${API_BASE}/admin/schedule`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao buscar expediente da oficina.');
    const data = await res.json();
    return data.schedule;
  },

  async updateScheduleDay(id: number, data: Partial<BusinessDaySchedule>): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/schedule/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao atualizar horário de funcionamento.');
    return res.json();
  },

  async getBlockedSlots(): Promise<BlockedSlot[]> {
    const res = await fetch(`${API_BASE}/admin/blocked-slots`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao listar bloqueios.');
    const data = await res.json();
    return data.blockedSlots;
  },

  async addBlockedSlot(data: { date: string; time?: string; reason: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/blocked-slots`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao adicionar bloqueio.');
    }
    return res.json();
  },

  async deleteBlockedSlot(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/blocked-slots/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao remover bloqueio.');
    return res.json();
  },

  async getSettings(): Promise<Record<string, string>> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao carregar configurações.');
    const data = await res.json();
    return data.settings;
  },

  async updateSettings(settings: Record<string, string>): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Erro ao salvar configurações.');
    return res.json();
  },
};
