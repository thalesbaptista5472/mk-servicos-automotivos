import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Car,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Send,
  HelpCircle,
} from 'lucide-react';
import { api } from '../services/api.js';
import { BookingFormData, AvailableSlot } from '../types/index.js';

interface BookingWizardProps {
  preselectedService?: string;
  onClearPreselectedService?: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  preselectedService,
  onClearPreselectedService,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState<BookingFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear().toString(),
    vehiclePlate: '',
    vehicleMileage: '',
    service: preselectedService || 'Revisão preventiva',
    description: '',
    date: '',
    time: '',
  });

  // Slot Availability State
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [dayOpenMessage, setDayOpenMessage] = useState<string | null>(null);
  const [isDayOpen, setIsDayOpen] = useState<boolean>(true);

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedData, setConfirmedData] = useState<any>(null);

  // Set default initial date to tomorrow (or Monday if weekend)
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    // If tomorrow is Sunday, jump to Monday
    if (tomorrow.getDay() === 0) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const initialDate = `${yyyy}-${mm}-${dd}`;
    setFormData((prev) => ({ ...prev, date: initialDate }));
  }, []);

  // Update selected service if preselectedService prop changes
  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
      // Scroll to booking form
      const el = document.getElementById('agendamento');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [preselectedService]);

  // Load available slots whenever date changes
  useEffect(() => {
    if (!formData.date) return;

    let isMounted = true;
    setLoadingSlots(true);
    setSlotsError(null);
    setDayOpenMessage(null);

    api
      .getAvailableSlots(formData.date)
      .then((res) => {
        if (!isMounted) return;
        setIsDayOpen(res.isOpen);
        if (!res.isOpen) {
          setDayOpenMessage(res.message || 'Oficina fechada nesta data.');
          setAvailableSlots([]);
          setFormData((prev) => ({ ...prev, time: '' }));
        } else {
          setAvailableSlots(res.slots || []);
          // If current time is no longer available in new slots, clear it
          const currentSlot = res.slots.find((s) => s.time === formData.time && s.available);
          if (!currentSlot) {
            setFormData((prev) => ({ ...prev, time: '' }));
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setSlotsError(err.message || 'Erro ao carregar horários disponíveis.');
        setAvailableSlots([]);
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [formData.date]);

  // Phone Masking: (XX) XXXXX-XXXX
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    }
    setFormData((prev) => ({ ...prev, clientPhone: formatted }));
  };

  // Plate Masking: ABC-1234 or ABC1D23
  const handlePlateChange = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
    let formatted = clean;
    if (clean.length > 3) {
      formatted = `${clean.slice(0, 3)}-${clean.slice(3)}`;
    }
    setFormData((prev) => ({ ...prev, vehiclePlate: formatted }));
  };

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.clientName.trim() || formData.clientName.trim().length < 3) {
        errs.clientName = 'Informe seu nome completo (mínimo 3 letras).';
      }
      if (!formData.clientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail.trim())) {
        errs.clientEmail = 'Informe um endereço de e-mail válido.';
      }
      if (!formData.clientPhone || formData.clientPhone.replace(/\D/g, '').length < 10) {
        errs.clientPhone = 'Informe um telefone/WhatsApp válido com DDD.';
      }
    }

    if (currentStep === 2) {
      if (!formData.vehicleBrand.trim()) {
        errs.vehicleBrand = 'Informe a marca do veículo (ex: Honda, Toyota, VW).';
      }
      if (!formData.vehicleModel.trim()) {
        errs.vehicleModel = 'Informe o modelo do veículo (ex: Civic, Corolla, Gol).';
      }
      if (!formData.vehicleYear.trim() || formData.vehicleYear.trim().length < 4) {
        errs.vehicleYear = 'Informe o ano de fabricação.';
      }
      if (!formData.vehiclePlate.trim() || formData.vehiclePlate.replace(/\D/g, '').length === 0 && formData.vehiclePlate.length < 7) {
        errs.vehiclePlate = 'Informe a placa do veículo.';
      }
    }

    if (currentStep === 3) {
      if (!formData.service) {
        errs.service = 'Selecione o serviço principal desejado.';
      }
    }

    if (currentStep === 4) {
      if (!formData.date) {
        errs.date = 'Selecione uma data para o agendamento.';
      }
      if (!formData.time) {
        errs.time = 'Selecione um horário disponível da oficina.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      setSubmitError('Por favor, revise os campos do formulário antes de confirmar.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await api.createAppointment(formData);
      setConfirmedData(response.summary || {
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        vehicle: `${formData.vehicleBrand} ${formData.vehicleModel} (${formData.vehicleYear})`,
        plate: formData.vehiclePlate,
        service: formData.service,
        date: formData.date.split('-').reverse().join('/'),
        time: formData.time,
      });
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Ocorreu um erro ao salvar o agendamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitSuccess(false);
    setStep(1);
    setFormData({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: new Date().getFullYear().toString(),
      vehiclePlate: '',
      vehicleMileage: '',
      service: 'Revisão preventiva',
      description: '',
      date: formData.date,
      time: '',
    });
    if (onClearPreselectedService) onClearPreselectedService();
  };

  // Min selectable date (Today)
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <section id="agendamento" className="section-padding" style={{ backgroundColor: '#101115', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <CalendarIcon size={14} /> Atendimento Rápido e Sem Fila
          </div>
          <h2 className="section-title">
            FAÇA SEU <span>AGENDAMENTO</span>
          </h2>
          <p className="section-subtitle">
            Agende o diagnóstico ou manutenção do seu veículo diretamente em nossa agenda. Horários atualizados em tempo real para sua conveniência.
          </p>
        </div>

        {/* Main Card */}
        <div
          className="card-surface"
          style={{
            background: 'linear-gradient(180deg, #1B1D23 0%, #15161B 100%)',
            border: '1px solid rgba(143, 20, 27, 0.4)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            padding: '36px',
            borderRadius: '16px',
          }}
        >
          {submitSuccess ? (
            /* Success Screen */
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10B981',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <CheckCircle2 size={48} />
              </div>

              <h3 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '12px' }}>
                Agendamento Solicitado com Sucesso!
              </h3>

              {/* Requirement 10 Exact Message */}
              <div
                style={{
                  background: 'rgba(143, 20, 27, 0.15)',
                  border: '1px solid rgba(143, 20, 27, 0.5)',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  margin: '20px auto 28px',
                  maxWidth: '560px',
                  color: '#ff858a',
                  fontWeight: 700,
                  fontSize: '15px',
                }}
              >
                "Solicitação recebida. Aguarde a confirmação da oficina."
              </div>

              <p style={{ color: 'var(--mk-gray-300)', fontSize: '15px', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                Nossa equipe recebeu sua solicitação e já enviou um e-mail de confirmação para{' '}
                <strong style={{ color: '#ffffff' }}>{formData.clientEmail}</strong>. Também entraremos em contato pelo WhatsApp{' '}
                <strong style={{ color: '#ffffff' }}>{formData.clientPhone}</strong> para formalizar seu atendimento.
              </p>

              {/* Summary Card */}
              {confirmedData && (
                <div
                  style={{
                    background: 'var(--mk-black-deep)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '24px',
                    maxWidth: '560px',
                    margin: '0 auto 32px',
                    textAlign: 'left',
                    fontSize: '14px',
                  }}
                >
                  <div style={{ fontWeight: 800, color: 'var(--mk-red-light)', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.5px' }}>
                    Resumo do Agendamento
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', color: 'var(--mk-gray-300)' }}>
                    <span style={{ color: 'var(--mk-gray-500)' }}>Cliente:</span>
                    <strong style={{ color: '#ffffff' }}>{confirmedData.clientName}</strong>

                    <span style={{ color: 'var(--mk-gray-500)' }}>Contato:</span>
                    <span>{confirmedData.clientPhone}</span>

                    <span style={{ color: 'var(--mk-gray-500)' }}>Veículo:</span>
                    <span>{confirmedData.vehicle}</span>

                    <span style={{ color: 'var(--mk-gray-500)' }}>Placa:</span>
                    <span style={{ color: '#60a5fa', fontWeight: 700 }}>{confirmedData.plate}</span>

                    <span style={{ color: 'var(--mk-gray-500)' }}>Serviço:</span>
                    <strong style={{ color: '#ffffff' }}>{confirmedData.service}</strong>

                    <span style={{ color: 'var(--mk-gray-500)' }}>Data:</span>
                    <strong style={{ color: '#10B981' }}>{confirmedData.date}</strong>

                    <span style={{ color: 'var(--mk-gray-500)' }}>Horário:</span>
                    <strong style={{ color: '#10B981' }}>{confirmedData.time}</strong>
                  </div>
                </div>
              )}

              <button onClick={resetForm} className="btn btn-secondary">
                Fazer Outro Agendamento
              </button>
            </div>
          ) : (
            <div>
              {/* Stepper Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '36px',
                  position: 'relative',
                }}
              >
                {[
                  { num: 1, label: 'Cliente', icon: <User size={16} /> },
                  { num: 2, label: 'Veículo', icon: <Car size={16} /> },
                  { num: 3, label: 'Serviço', icon: <FileText size={16} /> },
                  { num: 4, label: 'Data & Hora', icon: <Clock size={16} /> },
                  { num: 5, label: 'Confirmação', icon: <ShieldCheck size={16} /> },
                ].map((s) => (
                  <div
                    key={s.num}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      zIndex: 2,
                      cursor: s.num < step ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                      if (s.num < step) setStep(s.num);
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background:
                          step === s.num
                            ? 'var(--mk-red)'
                            : step > s.num
                            ? '#10B981'
                            : 'var(--mk-black-elevated)',
                        border: '2px solid',
                        borderColor:
                          step === s.num
                            ? '#ffffff'
                            : step > s.num
                            ? '#10B981'
                            : 'rgba(255,255,255,0.1)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '13px',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {step > s.num ? <CheckCircle2 size={18} /> : s.num}
                    </div>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: step === s.num ? 700 : 500,
                        color: step === s.num ? '#ffffff' : 'var(--mk-gray-500)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                      className="stepper-label"
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {submitError && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #ef4444',
                    borderRadius: '8px',
                    padding: '14px',
                    color: '#fca5a5',
                    fontSize: '14px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <AlertCircle size={20} />
                  <span>{submitError}</span>
                </div>
              )}

              {/* STEP 1: Dados do Cliente */}
              {step === 1 && (
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={20} color="var(--mk-red-light)" /> 1. Dados do Cliente
                  </h3>

                  <div style={{ display: 'grid', gap: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Carlos Eduardo de Oliveira"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          background: 'var(--mk-black-deep)',
                          border: `1px solid ${errors.clientName ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`,
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '15px',
                        }}
                      />
                      {errors.clientName && <span style={{ color: '#f87171', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.clientName}</span>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                          E-mail *
                        </label>
                        <input
                          type="email"
                          placeholder="seu.email@exemplo.com"
                          value={formData.clientEmail}
                          onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'var(--mk-black-deep)',
                            border: `1px solid ${errors.clientEmail ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`,
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '15px',
                          }}
                        />
                        {errors.clientEmail && <span style={{ color: '#f87171', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.clientEmail}</span>}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                          Telefone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          placeholder="(11) 98888-8888"
                          value={formData.clientPhone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'var(--mk-black-deep)',
                            border: `1px solid ${errors.clientPhone ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`,
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '15px',
                          }}
                        />
                        {errors.clientPhone && <span style={{ color: '#f87171', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.clientPhone}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Dados do Veículo */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Car size={20} color="var(--mk-red-light)" /> 2. Dados do Veículo
                  </h3>

                  <div style={{ display: 'grid', gap: '18px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                          Marca *
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Honda, Toyota, Fiat"
                          value={formData.vehicleBrand}
                          onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'var(--mk-black-deep)',
                            border: `1px solid ${errors.vehicleBrand ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`,
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '15px',
                          }}
                        />
                        {errors.vehicleBrand && <span style={{ color: '#f87171', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.vehicleBrand}</span>}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                          Modelo *
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Civic EXL, Corolla, Hilux"
                          value={formData.vehicleModel}
                          onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'var(--mk-black-deep)',
                            border: `1px solid ${errors.vehicleModel ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`,
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '15px',
                          }}
                        />
                        {errors.vehicleModel && <span style={{ color: '#f87171', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.vehicleModel}</span>}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                          Ano *
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 2021"
                          maxLength={4}
                          value={formData.vehicleYear}
                          onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value.replace(/\D/g, '') })}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'var(--mk-black-deep)',
                            border: `1px solid ${errors.vehicleYear ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`,
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '15px',
                          }}
                        />
                        {errors.vehicleYear && <span style={{ color: '#f87171', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.vehicleYear}</span>}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                          Placa *
                        </label>
                        <input
                          type="text"
                          placeholder="ABC-1234 ou ABC1D23"
                          value={formData.vehiclePlate}
                          onChange={(e) => handlePlateChange(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'var(--mk-black-deep)',
                            border: `1px solid ${errors.vehiclePlate ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`,
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '15px',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            letterSpacing: '1px',
                          }}
                        />
                        {errors.vehiclePlate && <span style={{ color: '#f87171', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.vehiclePlate}</span>}
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                          Quilometragem (opcional)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: 58.000 km"
                          value={formData.vehicleMileage}
                          onChange={(e) => setFormData({ ...formData, vehicleMileage: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'var(--mk-black-deep)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '15px',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Serviço & Problema */}
              {step === 3 && (
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={20} color="var(--mk-red-light)" /> 3. Serviço & Descrição do Problema
                  </h3>

                  <div style={{ display: 'grid', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                        Qual serviço você precisa? *
                      </label>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                          gap: '10px',
                        }}
                      >
                        {[
                          'Revisão preventiva',
                          'Troca de óleo',
                          'Freios',
                          'Suspensão',
                          'Motor',
                          'Diagnóstico eletrônico',
                          'Injeção eletrônica',
                          'Elétrica geral',
                          'Ar-condicionado',
                          'Embreagem e Câmbio',
                          'Alinhamento e Balanceamento',
                          'Outro',
                        ].map((srv) => {
                          const isSelected = formData.service === srv;
                          return (
                            <button
                              key={srv}
                              type="button"
                              onClick={() => setFormData({ ...formData, service: srv })}
                              style={{
                                padding: '12px 14px',
                                borderRadius: '8px',
                                border: isSelected
                                  ? '2px solid var(--mk-red)'
                                  : '1px solid rgba(255, 255, 255, 0.1)',
                                background: isSelected
                                  ? 'rgba(143, 20, 27, 0.25)'
                                  : 'var(--mk-black-deep)',
                                color: isSelected ? '#ffffff' : 'var(--mk-gray-300)',
                                fontWeight: isSelected ? 700 : 500,
                                fontSize: '13px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {srv}
                            </button>
                          );
                        })}
                      </div>
                      {errors.service && <span style={{ color: '#f87171', fontSize: '12px', marginTop: '6px', display: 'block' }}>{errors.service}</span>}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                        Descreva brevemente o problema apresentado pelo veículo
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Ex: Barulho metálico nas rodas dianteiras ao frear, luz da injeção acesa no painel, ar-condicionado parou de gelar..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          background: 'var(--mk-black-deep)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '14px',
                          lineHeight: 1.6,
                          resize: 'vertical',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Escolha da Data e Horário */}
              {step === 4 && (
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '20px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={20} color="var(--mk-red-light)" /> 4. Escolha a Data e Horário
                  </h3>

                  <div style={{ display: 'grid', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                        Escolha a data *
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        style={{
                          maxWidth: '280px',
                          width: '100%',
                          padding: '14px 16px',
                          background: 'var(--mk-black-deep)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '15px',
                          colorScheme: 'dark',
                        }}
                      />
                      {errors.date && <span style={{ color: '#f87171', fontSize: '12px', marginTop: '6px', display: 'block' }}>{errors.date}</span>}
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                          Escolha o horário *
                        </label>
                        <span style={{ fontSize: '12px', color: 'var(--mk-gray-400)' }}>
                          Somente horários livres são selecionáveis
                        </span>
                      </div>

                      {loadingSlots ? (
                        <div style={{ padding: '36px', textAlign: 'center', color: 'var(--mk-gray-400)' }}>
                          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block' }} />
                          <span>Consultando agenda da oficina em tempo real...</span>
                        </div>
                      ) : !isDayOpen ? (
                        <div
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            padding: '20px',
                            textAlign: 'center',
                            color: '#f87171',
                          }}
                        >
                          <AlertCircle size={24} style={{ margin: '0 auto 8px', display: 'block' }} />
                          <div style={{ fontWeight: 700, marginBottom: '4px' }}>Oficina Fechada Nesta Data</div>
                          <div style={{ fontSize: '13px' }}>{dayOpenMessage}</div>
                          <div style={{ fontSize: '13px', marginTop: '8px', color: 'var(--mk-gray-300)' }}>
                            Nosso expediente é de Segunda a Sexta das 08h às 18h e Sábados das 08h às 12h.
                          </div>
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--mk-gray-400)' }}>
                          Nenhum horário disponível para esta data. Por favor, selecione outro dia.
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                            gap: '10px',
                          }}
                        >
                          {availableSlots.map((slot) => {
                            const isSelected = formData.time === slot.time;
                            return (
                              <button
                                key={slot.time}
                                type="button"
                                disabled={!slot.available}
                                onClick={() => setFormData({ ...formData, time: slot.time })}
                                style={{
                                  padding: '12px 10px',
                                  borderRadius: '8px',
                                  border: isSelected
                                    ? '2px solid var(--mk-red)'
                                    : slot.available
                                    ? '1px solid rgba(255, 255, 255, 0.12)'
                                    : '1px solid rgba(255, 255, 255, 0.04)',
                                  background: isSelected
                                    ? 'linear-gradient(135deg, var(--mk-red) 0%, var(--mk-red-dark) 100%)'
                                    : slot.available
                                    ? 'var(--mk-black-deep)'
                                    : 'rgba(255, 255, 255, 0.02)',
                                  color: isSelected
                                    ? '#ffffff'
                                    : slot.available
                                    ? '#ffffff'
                                    : 'var(--mk-gray-600)',
                                  cursor: slot.available ? 'pointer' : 'not-allowed',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <span style={{ fontWeight: 800, fontSize: '15px' }}>{slot.time}</span>
                                <span
                                  style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    color: isSelected
                                      ? '#ffffff'
                                      : slot.available
                                      ? '#10B981'
                                      : '#ef4444',
                                  }}
                                >
                                  {slot.available ? 'Disponível' : 'Ocupado'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {errors.time && <span style={{ color: '#f87171', fontSize: '12px', marginTop: '8px', display: 'block' }}>{errors.time}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Resumo e Confirmação */}
              {step === 5 && (
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={20} color="var(--mk-red-light)" /> 5. Conferência dos Dados
                  </h3>

                  <p style={{ color: 'var(--mk-gray-400)', fontSize: '14px', marginBottom: '24px' }}>
                    Por favor, revise atentamente os dados antes de confirmar. Após a confirmação, os dados serão enviados para a oficina e você receberá uma confirmação por e-mail.
                  </p>

                  <div
                    style={{
                      background: 'var(--mk-black-deep)',
                      border: '1px solid rgba(143, 20, 27, 0.3)',
                      borderRadius: '12px',
                      padding: '24px',
                      marginBottom: '28px',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                      {/* Cliente */}
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--mk-red-light)', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Dados do Cliente
                        </div>
                        <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
                          <div><strong style={{ color: '#ffffff' }}>{formData.clientName}</strong></div>
                          <div style={{ color: 'var(--mk-gray-400)' }}>{formData.clientEmail}</div>
                          <div style={{ color: 'var(--mk-gray-300)' }}>{formData.clientPhone}</div>
                        </div>
                      </div>

                      {/* Veículo */}
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--mk-red-light)', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Dados do Veículo
                        </div>
                        <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
                          <div><strong style={{ color: '#ffffff' }}>{formData.vehicleBrand} {formData.vehicleModel} ({formData.vehicleYear})</strong></div>
                          <div>Placa: <strong style={{ color: '#60a5fa' }}>{formData.vehiclePlate}</strong></div>
                          {formData.vehicleMileage && <div style={{ color: 'var(--mk-gray-400)' }}>KM: {formData.vehicleMileage}</div>}
                        </div>
                      </div>

                      {/* Data & Serviço */}
                      <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--mk-red-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
                              Serviço Selecionado
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{formData.service}</div>
                          </div>

                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--mk-red-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
                              Data e Horário
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#10B981' }}>
                              {formData.date.split('-').reverse().join('/')} às {formData.time}
                            </div>
                          </div>
                        </div>

                        {formData.description && (
                          <div style={{ marginTop: '16px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--mk-gray-400)', textTransform: 'uppercase', marginBottom: '4px' }}>
                              Descrição do Problema
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--mk-gray-300)', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '6px' }}>
                              {formData.description}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '32px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '24px',
                }}
              >
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className="btn btn-secondary"
                  >
                    <ArrowLeft size={16} />
                    <span>Voltar</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn btn-primary"
                  >
                    <span>Próximo Passo</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    id="btn-confirmar-agendamento"
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn btn-primary pulse-glow"
                    style={{ padding: '16px 32px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Enviando Agendamento...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>CONFIRMAR AGENDAMENTO</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @media (max-width: 600px) {
          .stepper-label { display: none; }
        }
      `}</style>
    </section>
  );
};
