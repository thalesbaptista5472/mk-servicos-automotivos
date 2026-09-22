import React, { useState, useEffect } from 'react';
import { Clock, Lock, Trash2, Plus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api.js';
import { BusinessDaySchedule, BlockedSlot } from '../types/index.js';

export const AdminSchedule: React.FC = () => {
  const [schedule, setSchedule] = useState<BusinessDaySchedule[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New Block Form State
  const [blockDate, setBlockDate] = useState<string>('');
  const [blockTime, setBlockTime] = useState<string>('');
  const [blockReason, setBlockReason] = useState<string>('');
  const [isBlocking, setIsBlocking] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sched, blocks] = await Promise.all([
        api.getSchedule(),
        api.getBlockedSlots(),
      ]);
      setSchedule(sched);
      setBlockedSlots(blocks);
    } catch (err) {
      console.error('Error loading schedule data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDay = async (id: number, updatedFields: Partial<BusinessDaySchedule>) => {
    try {
      await api.updateScheduleDay(id, updatedFields);
      setFeedbackMsg({ text: 'Horário de funcionamento atualizado com sucesso.', isError: false });
      loadData();
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || 'Erro ao atualizar horário.', isError: true });
    }
  };

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate || !blockReason.trim()) {
      setFeedbackMsg({ text: 'Informe a data e o motivo do bloqueio.', isError: true });
      return;
    }

    setIsBlocking(true);
    try {
      await api.addBlockedSlot({
        date: blockDate,
        time: blockTime || undefined,
        reason: blockReason.trim(),
      });
      setBlockDate('');
      setBlockTime('');
      setBlockReason('');
      setFeedbackMsg({ text: 'Bloqueio adicionado com sucesso! O horário não aparecerá para clientes.', isError: false });
      loadData();
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || 'Erro ao bloquear horário.', isError: true });
    } finally {
      setIsBlocking(false);
    }
  };

  const handleDeleteBlock = async (id: number) => {
    try {
      await api.deleteBlockedSlot(id);
      setFeedbackMsg({ text: 'Bloqueio removido com sucesso.', isError: false });
      loadData();
    } catch (err: any) {
      setFeedbackMsg({ text: err.message || 'Erro ao remover bloqueio.', isError: true });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '26px', color: '#ffffff', textTransform: 'uppercase', marginBottom: '4px' }}>
          Horários de Funcionamento & Bloqueios
        </h2>
        <p style={{ color: 'var(--mk-gray-400)', fontSize: '14px' }}>
          Configure a grade de atendimento da oficina e realize bloqueios de horários pontuais.
        </p>
      </div>

      {feedbackMsg && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: feedbackMsg.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${feedbackMsg.isError ? '#ef4444' : '#10B981'}`,
            color: feedbackMsg.isError ? '#fca5a5' : '#34d399',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {feedbackMsg.isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--mk-gray-400)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block' }} />
          Carregando configurações de horário...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* SECTION 14: EXPEDIENTE SEMANAL */}
          <div
            className="card-surface"
            style={{
              background: 'var(--mk-black-surface)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px',
              borderRadius: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Clock size={20} color="var(--mk-red-light)" />
              <h3 style={{ fontSize: '18px', color: '#ffffff', textTransform: 'uppercase' }}>
                Grade Semanal da Oficina
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {schedule.map((day) => (
                <div
                  key={day.id}
                  style={{
                    background: 'var(--mk-black-deep)',
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ minWidth: '110px' }}>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '14px' }}>{day.day_name}</div>
                    <div style={{ fontSize: '11px', color: day.is_active ? '#10B981' : '#ef4444', fontWeight: 600 }}>
                      {day.is_active ? 'Aberto' : 'Fechado'}
                    </div>
                  </div>

                  {day.is_active ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
                      <div>
                        <span style={{ color: 'var(--mk-gray-500)', fontSize: '11px', display: 'block' }}>Expediente</span>
                        <span style={{ color: '#ffffff', fontWeight: 600 }}>{day.open_time} às {day.close_time}</span>
                      </div>
                      {day.lunch_start && (
                        <div>
                          <span style={{ color: 'var(--mk-gray-500)', fontSize: '11px', display: 'block' }}>Almoço</span>
                          <span style={{ color: 'var(--mk-gray-400)' }}>{day.lunch_start} - {day.lunch_end}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--mk-gray-500)', fontSize: '13px' }}>Sem agendamentos públicos</div>
                  )}

                  <button
                    onClick={() => handleUpdateDay(day.id, { is_active: day.is_active ? 0 : 1 })}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '11px', padding: '6px 12px' }}
                  >
                    {day.is_active ? 'Desativar Dia' : 'Ativar Dia'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 15: BLOQUEIO DE HORÁRIOS PONTUAIS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Create Block Form */}
            <div
              className="card-surface"
              style={{
                background: 'var(--mk-black-surface)',
                border: '1px solid rgba(143, 20, 27, 0.4)',
                padding: '24px',
                borderRadius: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Lock size={20} color="var(--mk-red-light)" />
                <h3 style={{ fontSize: '18px', color: '#ffffff', textTransform: 'uppercase' }}>
                  Bloquear Horário ou Data
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--mk-gray-400)', marginBottom: '20px' }}>
                Impeça que clientes reservem um horário específico (ex: Reunião interna, feriado local ou manutenção preventiva de elevador).
              </p>

              <form onSubmit={handleAddBlock} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--mk-gray-300)', display: 'block', marginBottom: '4px' }}>
                      Data *
                    </label>
                    <input
                      type="date"
                      required
                      value={blockDate}
                      onChange={(e) => setBlockDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: 'var(--mk-black-deep)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '13px',
                        colorScheme: 'dark',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--mk-gray-300)', display: 'block', marginBottom: '4px' }}>
                      Horário (opcional)
                    </label>
                    <input
                      type="time"
                      placeholder="Deixe vazio para dia todo"
                      value={blockTime}
                      onChange={(e) => setBlockTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: 'var(--mk-black-deep)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '13px',
                        colorScheme: 'dark',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--mk-gray-300)', display: 'block', marginBottom: '4px' }}>
                    Motivo do Bloqueio *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Reunião interna da equipe / Manutenção técnica"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'var(--mk-black-deep)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isBlocking}
                  className="btn btn-primary btn-sm"
                  style={{ alignSelf: 'flex-start', padding: '10px 20px', marginTop: '6px' }}
                >
                  <Plus size={16} /> Bloquear Horário
                </button>
              </form>
            </div>

            {/* List of Active Blocks */}
            <div
              className="card-surface"
              style={{
                background: 'var(--mk-black-surface)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '24px',
                borderRadius: '14px',
              }}
            >
              <h3 style={{ fontSize: '16px', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px' }}>
                Bloqueios Ativos ({blockedSlots.length})
              </h3>

              {blockedSlots.length === 0 ? (
                <div style={{ color: 'var(--mk-gray-500)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                  Nenhum bloqueio cadastrado. Todos os horários regulares estão livres para agendamento.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                  {blockedSlots.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        background: 'var(--mk-black-deep)',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        borderLeft: '3px solid #ef4444',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '13px' }}>
                          {b.date.split('-').reverse().join('/')} {b.time ? `às ${b.time}` : '(Dia inteiro)'}
                        </div>
                        <div style={{ color: '#fca5a5', fontSize: '12px' }}>{b.reason}</div>
                        <div style={{ color: 'var(--mk-gray-500)', fontSize: '11px', marginTop: '2px' }}>Por: {b.created_by}</div>
                      </div>

                      <button
                        onClick={() => handleDeleteBlock(b.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '6px',
                        }}
                        title="Remover bloqueio"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
