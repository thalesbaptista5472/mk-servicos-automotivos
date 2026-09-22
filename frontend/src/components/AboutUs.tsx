import React from 'react';
import { Award, ShieldCheck, Users, Clock, CheckCircle2 } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <section id="sobre" className="section-padding" style={{ backgroundColor: '#0D0E11', position: 'relative' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '56px',
            alignItems: 'center',
          }}
        >
          {/* Visual Showcase */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(143, 20, 27, 0.4)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
                position: 'relative',
              }}
            >
              <img
                src="/hero_fachada_full.png"
                alt="MK Serviços Automotivos Estrutura"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  filter: 'contrast(1.05) brightness(0.95)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 50%, rgba(13, 14, 17, 0.95) 100%)',
                }}
              />
            </div>

            {/* Float Highlight Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-25px',
                left: '30px',
                background: 'linear-gradient(135deg, #8F141B 0%, #4a0a0e 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '14px',
                padding: '16px 24px',
                color: '#ffffff',
                boxShadow: '0 10px 30px rgba(143, 20, 27, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <Award size={36} color="#ffffff" />
              <div>
                <div style={{ fontSize: '24px', fontWeight: 900, lineHeight: 1 }}>100%</div>
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#e5e7eb' }}>
                  Garantia e Confiança
                </div>
              </div>
            </div>
          </div>

          {/* Copy and Pillars */}
          <div>
            <div className="section-badge">
              <ShieldCheck size={14} /> Tradição e Tecnologia Automotiva
            </div>

            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>
              Sobre a <span>MK Serviços</span>
            </h2>

            <p style={{ fontSize: '16px', color: 'var(--mk-gray-300)', lineHeight: 1.7, marginBottom: '24px' }}>
              A <strong>MK Serviços Automotivos</strong> nasceu com a missão de oferecer uma experiência mecânica transparente, honesta e de alto padrão tecnológico. Localizada na <strong>R. O, 79 - Jardim Vitória Régia (Zona Norte), São Paulo - SP, 02675-031</strong>, nossa oficina combina mecânicos experientes com equipamentos de diagnóstico digital de última geração.
            </p>

            <p style={{ fontSize: '15px', color: 'var(--mk-gray-400)', lineHeight: 1.7, marginBottom: '32px' }}>
              Trabalhamos com motores a gasolina, flex e diesel, oferecendo atendimento completo: desde revisões preventivas para sua viagem até serviços complexos de injeção, freios, suspensão e câmbio. E cumprimos o compromisso estampado em nossa fachada: <strong>cobrimos qualquer orçamento!</strong>
            </p>

            {/* 4 Pillars Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'var(--mk-black-surface)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: 'var(--mk-red-light)', marginBottom: '8px' }}>
                  <Clock size={24} />
                </div>
                <h4 style={{ fontSize: '16px', color: '#ffffff', marginBottom: '4px' }}>Socorro 24H</h4>
                <p style={{ fontSize: '13px', color: 'var(--mk-gray-400)' }}>Atendimento emergencial para você nunca ficar na mão.</p>
              </div>

              <div style={{ background: 'var(--mk-black-surface)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: '#10B981', marginBottom: '8px' }}>
                  <ShieldCheck size={24} />
                </div>
                <h4 style={{ fontSize: '16px', color: '#ffffff', marginBottom: '4px' }}>Peças Genuínas</h4>
                <p style={{ fontSize: '13px', color: 'var(--mk-gray-400)' }}>Garantia total em peças e mão de obra especializada.</p>
              </div>

              <div style={{ background: 'var(--mk-black-surface)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: '#60a5fa', marginBottom: '8px' }}>
                  <Users size={24} />
                </div>
                <h4 style={{ fontSize: '16px', color: '#ffffff', marginBottom: '4px' }}>Equipe Especializada</h4>
                <p style={{ fontSize: '13px', color: 'var(--mk-gray-400)' }}>Mecânicos certificados para motores leves e diesel.</p>
              </div>

              <div style={{ background: 'var(--mk-black-surface)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ color: '#fbbf24', marginBottom: '8px' }}>
                  <Award size={24} />
                </div>
                <h4 style={{ fontSize: '16px', color: '#ffffff', marginBottom: '4px' }}>Melhor Preço</h4>
                <p style={{ fontSize: '13px', color: 'var(--mk-gray-400)' }}>Cobrimos qualquer orçamento com transparência.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
