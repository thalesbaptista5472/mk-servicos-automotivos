import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Car,
  User,
  Phone,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { DashboardData, Appointment } from '../types/index.js';

interface AdminDashboardProps {
  data: DashboardData | null;
  onViewAppointment: (id: number) => void;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  data,
  onViewAppointment,
  onNavigateTab,
}) => {
  if (!data) return null;

  const { kpis, upcoming, statusStats } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Title */}
      <div>
        <h2 style={{ fontSize: '26px', color: '#ffffff', textTransform: 'uppercase', marginBottom: '6px' }}>
          Painel de Controle
        </h2>
        <p style={{ color: 'var(--mk-gray-400)', fontSize: '14px' }}>
          Visão geral da oficina, fluxo de agendamentos e solicitações pendentes.
        </p>
      </div>

      {/* 5 KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Hoje */}
        <div
          className="card-surface"
          style={{ padding: '20px', borderRadius: '12px', background: 'var(--mk-black-surface)', borderLeft: '4px solid #3b82f6' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--mk-gray-400)', textTransform: 'uppercase' }}>
              Hoje
            </span>
            <Clock size={18} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff' }}>{kpis.today}</div>
          <div style={{ fontSize: '11px', color: 'var(--mk-gray-500)', marginTop: '4px' }}>Agendados para hoje</div>
        </div>

        {/* Semana */}
        <div
          className="card-surface"
          style={{ padding: '20px', borderRadius: '12px', background: 'var(--mk-black-surface)', borderLeft: '4px solid #8b5cf6' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--mk-gray-400)', textTransform: 'uppercase' }}>
              Na Semana
            </span>
            <Calendar size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff' }}>{kpis.week}</div>
          <div style={{ fontSize: '11px', color: 'var(--mk-gray-500)', marginTop: '4px' }}>Próximos 7 dias</div>
        </div>

        {/* Aguardando Confirmação */}
        <div
          className="card-surface"
          style={{ padding: '20px', borderRadius: '12px', background: 'var(--mk-black-surface)', borderLeft: '4px solid #f59e0b' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--mk-gray-400)', textTransform: 'uppercase' }}>
              Aguardando
            </span>
            <AlertTriangle size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#fbbf24' }}>{kpis.waiting}</div>
          <div style={{ fontSize: '11px', color: 'var(--mk-gray-500)', marginTop: '4px' }}>Solicitações pendentes</div>
        </div>

        {/* Confirmados */}
        <div
          className="card-surface"
          style={{ padding: '20px', borderRadius: '12px', background: 'var(--mk-black-surface)', borderLeft: '4px solid #10B981' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--mk-gray-400)', textTransform: 'uppercase' }}>
              Confirmados
            </span>
            <CheckCircle size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#34d399' }}>{kpis.confirmed}</div>
          <div style={{ fontSize: '11px', color: 'var(--mk-gray-500)', marginTop: '4px' }}>Aprovados na agenda</div>
        </div>

        {/* Cancelados */}
        <div
          className="card-surface"
          style={{ padding: '20px', borderRadius: '12px', background: 'var(--mk-black-surface)', borderLeft: '4px solid #ef4444' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--mk-gray-400)', textTransform: 'uppercase' }}>
              Cancelados
            </span>
            <XCircle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#f87171' }}>{kpis.cancelled}</div>
          <div style={{ fontSize: '11px', color: 'var(--mk-gray-500)', marginTop: '4px' }}>Cancelamentos</div>
        </div>
      </div>

      {/* Grid: Upcoming appointments & Status distribution chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Next Upcoming Appointments */}
        <div
          className="card-surface"
          style={{
            padding: '24px',
            borderRadius: '14px',
            background: 'var(--mk-black-surface)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', color: '#ffffff', textTransform: 'uppercase' }}>
              Próximos Agendamentos
            </h3>
            <button
              onClick={() => onNavigateTab('appointments')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--mk-red-light)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Ver todos <ArrowUpRight size={14} />
            </button>
          </div>

          {upcoming.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--mk-gray-500)', fontSize: '14px' }}>
              Nenhum agendamento futuro programado.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcoming.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onViewAppointment(item.id)}
                  style={{
                    background: 'var(--mk-black-deep)',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--mk-red)')}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <strong style={{ color: '#ffffff', fontSize: '14px' }}>{item.client_name}</strong>
                      <span
                        className={`badge-status ${
                          item.status === 'Confirmado'
                            ? 'confirmado'
                            : item.status === 'Cancelado'
                            ? 'cancelado'
                            : 'aguardando'
                        }`}
                        style={{ fontSize: '11px', padding: '2px 8px' }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--mk-gray-400)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span><Car size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />{item.vehicle_brand} {item.vehicle_model}</span>
                      <span>•</span>
                      <span style={{ color: 'var(--mk-red-light)', fontWeight: 600 }}>{item.service}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#10B981' }}>{item.time}</div>
                    <div style={{ fontSize: '11px', color: 'var(--mk-gray-400)' }}>{item.date.split('-').reverse().join('/')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Distribution Breakdown */}
        <div
          className="card-surface"
          style={{
            padding: '24px',
            borderRadius: '14px',
            background: 'var(--mk-black-surface)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: '#ffffff', textTransform: 'uppercase' }}>
                Distribuição de Agendamentos
              </h3>
              <TrendingUp size={18} color="var(--mk-red-light)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {statusStats.map((st) => {
                const total = statusStats.reduce((acc, curr) => acc + curr.count, 0) || 1;
                const pct = Math.round((st.count / total) * 100);

                let color = '#3b82f6';
                if (st.status === 'Confirmado' || st.status === 'Concluído') color = '#10B981';
                if (st.status === 'Cancelado') color = '#ef4444';
                if (st.status === 'Aguardando confirmação') color = '#f59e0b';
                if (st.status === 'Em atendimento') color = '#8b5cf6';

                return (
                  <div key={st.status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>{st.status}</span>
                      <span style={{ color: 'var(--mk-gray-400)' }}>{st.count} ({pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--mk-black-deep)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: color,
                          borderRadius: '4px',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              marginTop: '28px',
              padding: '16px',
              background: 'rgba(143, 20, 27, 0.1)',
              border: '1px solid rgba(143, 20, 27, 0.3)',
              borderRadius: '10px',
              fontSize: '13px',
              color: 'var(--mk-gray-300)',
            }}
          >
            <strong style={{ color: '#ffffff' }}>Dica Operacional:</strong> Novos agendamentos solicitados pelo site entram com status <em>"Solicitação recebida"</em> e disparam e-mails automáticos. Acesse a aba <strong>Agendamentos</strong> para confirmar ou ajustar os horários.
          </div>
        </div>
      </div>
    </div>
  );
};
