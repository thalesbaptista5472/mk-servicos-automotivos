import React from 'react';
import { Calendar, Wrench, CheckCircle2, ShieldCheck, Zap, Award, ArrowRight } from 'lucide-react';

interface HeroProps {
  onScheduleClick: () => void;
  onServicesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScheduleClick, onServicesClick }) => {
  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        paddingTop: '140px',
        paddingBottom: '70px',
        display: 'flex',
        alignItems: 'center',
        background: `
          radial-gradient(circle at 80% 20%, rgba(143, 20, 27, 0.25) 0%, transparent 60%),
          radial-gradient(circle at 10% 80%, rgba(143, 20, 27, 0.15) 0%, transparent 50%),
          linear-gradient(180deg, #0D0E11 0%, #141519 100%)
        `,
        overflow: 'hidden',
      }}
    >
      {/* Decorative Gear Watermarks in background */}
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '450px',
          height: '450px',
          backgroundImage: 'radial-gradient(circle, rgba(143, 20, 27, 0.08) 10%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Copy & Value Proposition */}
          <div style={{ zIndex: 2 }}>
            {/* Guarantee and Emergency Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #8F141B 0%, #5C0D11 100%)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 12px rgba(143, 20, 27, 0.4)',
                }}
              >
                <Zap size={14} fill="#ffffff" /> SOCORRO 24H
              </span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                <ShieldCheck size={14} /> COBRIMOS QUALQUER ORÇAMENTO
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(34px, 5vw, 54px)',
                lineHeight: 1.1,
                marginBottom: '16px',
                textTransform: 'uppercase',
                fontWeight: 900,
              }}
            >
              MECÂNICO DE <span style={{ color: 'var(--mk-red-light)' }}>GASOLINA</span> E{' '}
              <span style={{ color: 'var(--mk-red-light)' }}>DIESEL</span>
            </h1>

            <div
              style={{
                fontFamily: 'var(--mk-font-heading)',
                fontSize: '22px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ width: '28px', height: '3px', background: 'var(--mk-red)' }}></span>
              Seu carro em boas mãos.
            </div>

            <p
              style={{
                fontSize: '16px',
                color: 'var(--mk-gray-300)',
                maxWidth: '560px',
                marginBottom: '28px',
                lineHeight: 1.6,
              }}
            >
              Serviços automotivos com qualidade, confiança e compromisso com você e seu veículo. Da revisão preventiva ao diagnóstico eletrônico de precisão.
            </p>

            {/* Checklist from Fachada */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginBottom: '36px',
                background: 'rgba(27, 29, 35, 0.6)',
                padding: '18px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {[
                'Injeção eletrônica',
                'Sistema de freios',
                'Suspensão completa',
                'Embreagem e Câmbio',
                'Elétrica geral',
                'Diagnóstico Computadorizado',
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#f3f4f6' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Call to Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <button
                id="btn-hero-agendamento"
                onClick={onScheduleClick}
                className="btn btn-primary btn-lg pulse-glow"
                style={{ flexGrow: 1, maxWidth: '280px' }}
              >
                <Calendar size={18} />
                <span>FAÇA SEU AGENDAMENTO</span>
              </button>

              <button
                id="btn-hero-servicos"
                onClick={onServicesClick}
                className="btn btn-secondary btn-lg"
                style={{ flexGrow: 1, maxWidth: '260px' }}
              >
                <Wrench size={18} />
                <span>CONHEÇA NOSSOS SERVIÇOS</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Composite from Fachada */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Circular Glow Effect Behind Emblem */}
            <div
              style={{
                position: 'absolute',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(143, 20, 27, 0.5) 0%, transparent 70%)',
                filter: 'blur(30px)',
                zIndex: 1,
              }}
            />

            {/* Official Circular MK Emblem */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                maxWidth: '460px',
                textAlign: 'center',
              }}
            >
              <img
                src="/logo_mk_badge.png"
                alt="Emblema MK Serviços Automotivos"
                style={{
                  width: '78%',
                  maxWidth: '340px',
                  height: 'auto',
                  filter: 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.8))',
                  animation: 'floatBadge 4s ease-in-out infinite',
                }}
              />

              {/* Cars Banner from Fachada sitting dynamically below emblem */}
              <div style={{ marginTop: '-40px', zIndex: 3, position: 'relative' }}>
                <img
                  src="/cars_banner.png"
                  alt="Veículos atendidos pela MK Serviços Automotivos"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 12px 25px rgba(0, 0, 0, 0.9))',
                  }}
                />
              </div>

              {/* Floating Quality Tag */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(13, 14, 17, 0.92)',
                  border: '1px solid #8F141B',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(8px)',
                  zIndex: 4,
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--mk-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <Award size={20} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: 'var(--mk-gray-400)', textTransform: 'uppercase' }}>Compromisso</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>Garantia Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatBadge {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </section>
  );
};
