import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  AlertCircle,
  Car,
  User,
  Phone,
  Mail,
  FileText,
  History,
  X,
  Loader2,
  Check,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Appointment, AppointmentHistoryItem } from '../types/index.js';

interface AdminAppointmentsProps {
  selectedAppointmentId?: number | null;
  onClearSelectedId?: () => void;
}

export const AdminAppointments: React.FC<AdminAppointmentsProps> = ({
  selectedAppointmentId,
  onClearSelectedId,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Details Modal State
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [historyItems, setHistoryItems] = useState<AppointmentHistoryItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  // Status Change State
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // Reschedule Modal State
  const [showRescheduleModal, setShowRescheduleModal] = useState<boolean>(false);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('');
  const [rescheduleNote, setRescheduleNote] = useState<string>('');
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // Cancel Modal State
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [statusFilter, dateFilter]);

  // If parent passes selectedAppointmentId, load it directly into modal
  useEffect(() => {
    if (selectedAppointmentId) {
      openDetailsModal(selectedAppointmentId);
      if (onClearSelectedId) onClearSelectedId();
    }
  }, [selectedAppointmentId]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await api.getAppointments({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        date: dateFilter || undefined,
        q: searchQuery || undefined,
      });
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAppointments();
  };

  const openDetailsModal = async (id: number) => {
    setLoadingDetails(true);
    try {
      const res = await api.getAppointment(id);
      setActiveAppointment(res.appointment);
      setHistoryItems(res.history);
      setNewStatus(res.appointment.status);
    } catch (err) {
      console.error('Error loading appointment details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetailsModal = () => {
    setActiveAppointment(null);
    setHistoryItems([]);
    setStatusNote('');
  };

  const handleStatusUpdate = async () => {
    if (!activeAppointment || !newStatus) return;
    setIsUpdatingStatus(true);
    try {
      await api.updateAppointmentStatus(activeAppointment.id, newStatus, statusNote);
      // Reload appointment details
      openDetailsModal(activeAppointment.id);
      loadAppointments();
      setStatusNote('');
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppointment || !rescheduleDate || !rescheduleTime) return;
    setIsRescheduling(true);
    setRescheduleError(null);
    try {
      await api.rescheduleAppointment(activeAppointment.id, rescheduleDate, rescheduleTime, rescheduleNote);
      setShowRescheduleModal(false);
      openDetailsModal(activeAppointment.id);
      loadAppointments();
    } catch (err: any) {
      setRescheduleError(err.message || 'Erro ao reagendar.');
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppointment || !cancelReason.trim()) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      await api.cancelAppointment(activeAppointment.id, cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
      openDetailsModal(activeAppointment.id);
      loadAppointments();
    } catch (err: any) {
      setCancelError(err.message || 'Erro ao cancelar.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '26px', color: '#ffffff', textTransform: 'uppercase', marginBottom: '4px' }}>
          Gerenciamento de Agendamentos
        </h2>
        <p style={{ color: 'var(--mk-gray-400)', fontSize: '14px' }}>
          Lista completa, alteração de status, histórico de auditoria e cancelamentos.
        </p>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: 'var(--mk-black-surface)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flexGrow: 1, maxWidth: '400px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', top: '14px', left: '12px', color: 'var(--mk-gray-500)' }} />
            <input
              type="text"
              placeholder="Buscar por cliente, telefone, placa ou modelo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 38px',
                background: 'var(--mk-black-deep)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '13px',
              }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Buscar
          </button>
        </form>

        {/* Status Select & Date Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={16} color="var(--mk-gray-400)" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                background: 'var(--mk-black-deep)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '13px',
              }}
            >
              <option value="all">Todos os Status</option>
              <option value="Solicitação recebida">Solicitação recebida</option>
              <option value="Aguardando confirmação">Aguardando confirmação</option>
              <option value="Confirmado">Confirmado</option>
              <option value="Em atendimento">Em atendimento</option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: '11px 14px',
              background: 'var(--mk-black-deep)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '13px',
              colorScheme: 'dark',
            }}
          />

          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--mk-gray-500)',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Limpar data
            </button>
          )}
        </div>
      </div>

      {/* Appointments Table */}
      <div
        style={{
          background: 'var(--mk-black-surface)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--mk-gray-400)' }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block' }} />
            Carregando agendamentos...
          </div>
        ) : appointments.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--mk-gray-500)' }}>
            Nenhum agendamento encontrado com os filtros selecionados.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--mk-black-elevated)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--mk-gray-400)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 18px' }}>Data / Hora</th>
                  <th style={{ padding: '14px 18px' }}>Cliente</th>
                  <th style={{ padding: '14px 18px' }}>Veículo & Placa</th>
                  <th style={{ padding: '14px 18px' }}>Serviço</th>
                  <th style={{ padding: '14px 18px' }}>Status</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '16px 18px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 800, color: '#10B981', fontSize: '14px' }}>{appt.time}</div>
                      <div style={{ color: 'var(--mk-gray-400)', fontSize: '12px' }}>
                        {appt.date.split('-').reverse().join('/')}
                      </div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{appt.client_name}</div>
                      <div style={{ color: 'var(--mk-gray-400)', fontSize: '12px' }}>{appt.client_phone}</div>
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ color: '#ffffff' }}>{appt.vehicle_brand} {appt.vehicle_model}</div>
                      <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: '12px' }}>{appt.vehicle_plate}</div>
                    </td>

                    <td style={{ padding: '16px 18px', fontWeight: 600, color: 'var(--mk-red-light)' }}>
                      {appt.service}
                    </td>

                    <td style={{ padding: '16px 18px' }}>
                      <span
                        className={`badge-status ${
                          appt.status === 'Confirmado'
                            ? 'confirmado'
                            : appt.status === 'Cancelado'
                            ? 'cancelado'
                            : appt.status === 'Em atendimento'
                            ? 'atendimento'
                            : appt.status === 'Concluído'
                            ? 'concluido'
                            : 'aguardando'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>

                    <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => openDetailsModal(appt.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Eye size={14} /> Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILS & AUDIT LOG MODAL */}
      {activeAppointment && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#181A20',
              border: '1px solid rgba(143, 20, 27, 0.5)',
              borderRadius: '16px',
              maxWidth: '750px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              position: 'relative',
              boxShadow: '0 25px 50px rgba(0,0,0,0.9)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeDetailsModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--mk-black-deep)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                padding: '8px',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Title */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '22px', color: '#ffffff', textTransform: 'uppercase' }}>
                  Agendamento #{activeAppointment.id}
                </h3>
                <span
                  className={`badge-status ${
                    activeAppointment.status === 'Confirmado'
                      ? 'confirmado'
                      : activeAppointment.status === 'Cancelado'
                      ? 'cancelado'
                      : 'aguardando'
                  }`}
                >
                  {activeAppointment.status}
                </span>
              </div>
              <div style={{ color: 'var(--mk-gray-400)', fontSize: '13px' }}>
                Solicitado em: {activeAppointment.created_at}
              </div>
            </div>

            {/* Info Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                background: 'var(--mk-black-deep)',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              {/* Cliente */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--mk-red-light)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <User size={13} style={{ display: 'inline', marginRight: '4px' }} /> Cliente
                </div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '15px' }}>{activeAppointment.client_name}</div>
                <div style={{ color: 'var(--mk-gray-400)', fontSize: '13px' }}>{activeAppointment.client_phone}</div>
                <div style={{ color: 'var(--mk-gray-400)', fontSize: '13px' }}>{activeAppointment.client_email}</div>
              </div>

              {/* Veículo */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--mk-red-light)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Car size={13} style={{ display: 'inline', marginRight: '4px' }} /> Veículo
                </div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '15px' }}>
                  {activeAppointment.vehicle_brand} {activeAppointment.vehicle_model} ({activeAppointment.vehicle_year})
                </div>
                <div>Placa: <strong style={{ color: '#60a5fa' }}>{activeAppointment.vehicle_plate}</strong></div>
                {activeAppointment.vehicle_mileage && <div style={{ color: 'var(--mk-gray-400)', fontSize: '13px' }}>KM: {activeAppointment.vehicle_mileage}</div>}
              </div>

              {/* Data & Serviço */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--mk-red-light)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> Data & Horário
                </div>
                <div style={{ fontWeight: 900, color: '#10B981', fontSize: '16px' }}>
                  {activeAppointment.date.split('-').reverse().join('/')} às {activeAppointment.time}
                </div>
                <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '13px', marginTop: '4px' }}>
                  Serviço: {activeAppointment.service}
                </div>
              </div>
            </div>

            {/* Description */}
            {activeAppointment.description && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--mk-gray-400)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Descrição do Problema pelo Cliente
                </div>
                <div style={{ background: 'var(--mk-black-deep)', padding: '14px', borderRadius: '8px', color: 'var(--mk-gray-200)', fontSize: '14px', lineHeight: 1.6 }}>
                  {activeAppointment.description}
                </div>
              </div>
            )}

            {/* Cancellation info if cancelled */}
            {activeAppointment.status === 'Cancelado' && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
                <div style={{ color: '#f87171', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>
                  Agendamento Cancelado
                </div>
                <div style={{ fontSize: '13px', color: '#ffffff' }}>
                  <strong>Motivo:</strong> {activeAppointment.cancellation_reason || 'Não especificado'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--mk-gray-400)', marginTop: '4px' }}>
                  Por: {activeAppointment.cancelled_by} em {activeAppointment.cancelled_at}
                </div>
              </div>
            )}

            {/* ACTIONS: Update Status / Reschedule / Cancel */}
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '20px',
                marginBottom: '28px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', marginBottom: '12px' }}>
                Gerenciar Este Agendamento
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
                <div style={{ flexGrow: 1, minWidth: '180px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--mk-gray-400)', marginBottom: '4px' }}>
                    Alterar Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'var(--mk-black-deep)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '13px',
                    }}
                  >
                    <option value="Solicitação recebida">Solicitação recebida</option>
                    <option value="Aguardando confirmação">Aguardando confirmação</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Em atendimento">Em atendimento</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>

                <div style={{ flexGrow: 2, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--mk-gray-400)', marginBottom: '4px' }}>
                    Nota da Alteração (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Confirmado via WhatsApp..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'var(--mk-black-deep)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdatingStatus}
                  className="btn btn-primary btn-sm"
                  style={{ height: '40px' }}
                >
                  {isUpdatingStatus ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Salvar Status
                </button>
              </div>

              {/* Extra action buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setRescheduleDate(activeAppointment.date);
                    setRescheduleTime(activeAppointment.time);
                    setShowRescheduleModal(true);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  <Clock size={14} /> Reagendar Horário
                </button>

                {activeAppointment.status !== 'Cancelado' && (
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: '#ef4444', color: '#f87171' }}
                  >
                    <XCircle size={14} /> Cancelar Agendamento
                  </button>
                )}
              </div>
            </div>

            {/* AUDIT LOG HISTORY (Requirement 24) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', marginBottom: '14px' }}>
                <History size={16} color="var(--mk-red-light)" /> Histórico de Alterações (Auditoria)
              </div>

              {historyItems.length === 0 ? (
                <div style={{ fontSize: '13px', color: 'var(--mk-gray-500)' }}>Nenhum histórico registrado.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {historyItems.map((h) => (
                    <div
                      key={h.id}
                      style={{
                        background: 'var(--mk-black-deep)',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        borderLeft: '3px solid var(--mk-red)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--mk-gray-400)', fontSize: '11px', marginBottom: '4px' }}>
                        <span><strong>{h.user_name}</strong></span>
                        <span>{h.created_at}</span>
                      </div>
                      <div style={{ color: '#ffffff' }}>{h.note}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {showRescheduleModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#1C1E24', padding: '28px', borderRadius: '12px', maxWidth: '420px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '16px' }}>Reagendar Horário</h4>
            {rescheduleError && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{rescheduleError}</div>}
            <form onSubmit={handleRescheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--mk-gray-400)', display: 'block', marginBottom: '4px' }}>Nova Data</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--mk-black-deep)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#ffffff', colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--mk-gray-400)', display: 'block', marginBottom: '4px' }}>Novo Horário</label>
                <input
                  type="time"
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--mk-black-deep)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#ffffff', colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--mk-gray-400)', display: 'block', marginBottom: '4px' }}>Motivo do Reagendamento (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Cliente solicitou alteração para outro turno"
                  value={rescheduleNote}
                  onChange={(e) => setRescheduleNote(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--mk-black-deep)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#ffffff' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowRescheduleModal(false)} className="btn btn-secondary btn-sm">Cancelar</button>
                <button type="submit" disabled={isRescheduling} className="btn btn-primary btn-sm">Salvar Reagendamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL MODAL (Requirement 16) */}
      {showCancelModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#1C1E24', padding: '28px', borderRadius: '12px', maxWidth: '440px', width: '100%', border: '1px solid #ef4444' }}>
            <h4 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '8px' }}>Cancelar Agendamento</h4>
            <p style={{ fontSize: '13px', color: 'var(--mk-gray-400)', marginBottom: '16px' }}>
              Informe o motivo do cancelamento. O registro ficará gravado no histórico de auditoria com seu usuário.
            </p>
            {cancelError && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{cancelError}</div>}
            <form onSubmit={handleCancelSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--mk-gray-400)', display: 'block', marginBottom: '4px' }}>Motivo do Cancelamento *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Peça indisponível no mercado, cliente desistiu..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'var(--mk-black-deep)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#ffffff' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowCancelModal(false)} className="btn btn-secondary btn-sm">Fechar</button>
                <button type="submit" disabled={isCancelling} className="btn btn-primary btn-sm" style={{ background: '#ef4444' }}>
                  {isCancelling ? 'Cancelando...' : 'Confirmar Cancelamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
