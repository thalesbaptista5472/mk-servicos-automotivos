import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Car,
  User,
  AlertTriangle,
  Loader2,
  Lock,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Appointment, BlockedSlot } from '../types/index.js';

interface AdminCalendarProps {
  onSelectAppointment: (id: number) => void;
}

export const AdminCalendar: React.FC<AdminCalendarProps> = ({ onSelectAppointment }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [loading, setLoading] = useState<boolean>(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);

  useEffect(() => {
    loadCalendarData();
  }, [currentDate, viewMode]);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      // Calculate date range based on view
      const y = currentDate.getFullYear();
      const m = currentDate.getMonth();

      // Start of month / end of month range with padding
      const start = new Date(y, m - 1, 1).toISOString().split('T')[0];
      const end = new Date(y, m + 2, 0).toISOString().split('T')[0];

      const res = await api.getCalendar(start, end);
      setAppointments(res.appointments || []);
      setBlockedSlots(res.blockedSlots || []);
    } catch (err) {
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextPeriod = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() + 1);
    if (viewMode === 'week') next.setDate(next.getDate() + 7);
    if (viewMode === 'day') next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const prevPeriod = () => {
    const prev = new Date(currentDate);
    if (viewMode === 'month') prev.setMonth(prev.getMonth() - 1);
    if (viewMode === 'week') prev.setDate(prev.getDate() - 7);
    if (viewMode === 'day') prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Month Grid Calculation
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Padding before 1st of month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Days of month
    for (let d = 1; d <= totalDays; d++) {
      days.push(d);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          background: 'var(--mk-black-surface)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Day Name Headers */}
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((name, i) => (
          <div
            key={name}
            style={{
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '12px',
              textTransform: 'uppercase',
              color: i === 0 ? '#ef4444' : 'var(--mk-gray-400)',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {name}
          </div>
        ))}

        {/* Days */}
        {days.map((day, idx) => {
          if (!day) {
            return (
              <div
                key={`empty-${idx}`}
                style={{
                  minHeight: '110px',
                  background: 'rgba(255, 255, 255, 0.01)',
                  borderRadius: '6px',
                  opacity: 0.3,
                }}
              />
            );
          }

          const mm = String(month + 1).padStart(2, '0');
          const dd = String(day).padStart(2, '0');
          const dayDateStr = `${year}-${mm}-${dd}`;
          const isToday = dayDateStr === todayStr;

          // Day appointments
          const dayAppts = appointments.filter((a) => a.date === dayDateStr);
          // Day blocked slots
          const dayBlocks = blockedSlots.filter((b) => b.date === dayDateStr);

          return (
            <div
              key={dayDateStr}
              style={{
                minHeight: '110px',
                background: isToday ? 'rgba(143, 20, 27, 0.15)' : 'var(--mk-black-deep)',
                border: isToday ? '1px solid var(--mk-red)' : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: isToday ? 800 : 600,
                    color: isToday ? 'var(--mk-red-light)' : '#ffffff',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isToday ? 'rgba(143, 20, 27, 0.3)' : 'transparent',
                  }}
                >
                  {day}
                </span>
                {dayAppts.length > 0 && (
                  <span style={{ fontSize: '10px', background: '#10B981', color: '#ffffff', padding: '1px 6px', borderRadius: '9999px', fontWeight: 800 }}>
                    {dayAppts.length}
                  </span>
                )}
              </div>

              {/* Blocked Slots chips */}
              {dayBlocks.map((b) => (
                <div
                  key={`block-${b.id}`}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    borderLeft: '2px solid #ef4444',
                    color: '#fca5a5',
                    fontSize: '11px',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title={`Bloqueado: ${b.reason}`}
                >
                  <Lock size={10} />
                  <span>{b.time ? `${b.time} - ` : ''}{b.reason}</span>
                </div>
              ))}

              {/* Appointments chips */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto', maxHeight: '80px' }}>
                {dayAppts.map((a) => {
                  let statusColor = '#3b82f6';
                  if (a.status === 'Confirmado') statusColor = '#10B981';
                  if (a.status === 'Cancelado') statusColor = '#ef4444';
                  if (a.status === 'Aguardando confirmação') statusColor = '#f59e0b';

                  return (
                    <div
                      key={a.id}
                      onClick={() => onSelectAppointment(a.id)}
                      style={{
                        background: 'var(--mk-black-surface)',
                        borderLeft: `3px solid ${statusColor}`,
                        padding: '3px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = 'var(--mk-black-elevated)')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'var(--mk-black-surface)')}
                      title={`${a.time} — ${a.client_name} (${a.vehicle_brand} ${a.vehicle_model}) - ${a.service}`}
                    >
                      <strong style={{ color: '#ffffff' }}>{a.time}</strong>{' '}
                      <span style={{ color: 'var(--mk-gray-300)' }}>{a.client_name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Day View
  const renderDayView = () => {
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dd = String(currentDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const dayAppts = appointments.filter((a) => a.date === dateStr);
    const dayBlocks = blockedSlots.filter((b) => b.date === dateStr);

    return (
      <div style={{ background: 'var(--mk-black-surface)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <h3 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '20px' }}>
          Agendamentos para {currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </h3>

        {dayBlocks.length > 0 && (
          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {dayBlocks.map((b) => (
              <div key={b.id} style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '8px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} />
                <span><strong>Horário Bloqueado:</strong> {b.time ? `${b.time} - ` : 'Dia inteiro - '}{b.reason}</span>
              </div>
            ))}
          </div>
        )}

        {dayAppts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--mk-gray-500)' }}>
            Nenhum compromisso agendado para este dia.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dayAppts.map((a) => (
              <div
                key={a.id}
                onClick={() => onSelectAppointment(a.id)}
                style={{
                  background: 'var(--mk-black-deep)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--mk-red)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#10B981', minWidth: '70px' }}>
                    {a.time}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                      {a.client_name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--mk-gray-400)', display: 'flex', gap: '16px' }}>
                      <span><Car size={14} style={{ display: 'inline', marginRight: '4px' }} />{a.vehicle_brand} {a.vehicle_model} ({a.vehicle_plate})</span>
                      <span style={{ color: 'var(--mk-red-light)', fontWeight: 600 }}>{a.service}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span
                    className={`badge-status ${
                      a.status === 'Confirmado'
                        ? 'confirmado'
                        : a.status === 'Cancelado'
                        ? 'cancelado'
                        : 'aguardando'
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Calendar Header Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '26px', color: '#ffffff', textTransform: 'uppercase', marginBottom: '4px' }}>
            Calendário da Oficina
          </h2>
          <p style={{ color: 'var(--mk-gray-400)', fontSize: '14px' }}>
            Visualização de agendamentos por dia, semana e mês.
          </p>
        </div>

        {/* Controls: View Switcher & Month Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* View Mode Buttons */}
          <div style={{ display: 'flex', background: 'var(--mk-black-deep)', borderRadius: '8px', padding: '3px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => setViewMode('month')}
              style={{
                background: viewMode === 'month' ? 'var(--mk-red)' : 'transparent',
                border: 'none',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Mês
            </button>
            <button
              onClick={() => setViewMode('day')}
              style={{
                background: viewMode === 'day' ? 'var(--mk-red)' : 'transparent',
                border: 'none',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Dia
            </button>
          </div>

          {/* Today Button */}
          <button
            onClick={goToToday}
            className="btn btn-secondary btn-sm"
          >
            Hoje
          </button>

          {/* Navigation Arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={prevPeriod}
              style={{
                background: 'var(--mk-black-surface)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextPeriod}
              style={{
                background: 'var(--mk-black-surface)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Current Month / Period Display */}
      <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', textTransform: 'capitalize' }}>
        {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--mk-gray-400)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block' }} />
          Carregando dados do calendário...
        </div>
      ) : (
        viewMode === 'month' ? renderMonthView() : renderDayView()
      )}
    </div>
  );
};
