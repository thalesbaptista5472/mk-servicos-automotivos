import React from 'react';
import { Wrench, Phone, Mail, MapPin, ShieldCheck, Zap } from 'lucide-react';

const InstagramIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface FooterProps {
  onNavigateToAdmin: () => void;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToAdmin,
  phone = '(11) 98878-7548',
  whatsapp = '5511988787548',
  email = 'mkservicosautomotivos5@gmail.com',
  address = 'Rua O, 83 - Vitória Régia, SP',
}) => {
  return (
    <footer style={{ backgroundColor: '#0A0B0D', borderTop: '1px solid rgba(143, 20, 27, 0.4)', paddingTop: '60px', paddingBottom: '30px' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img src="/logo_mk_badge.png" alt="MK Serviços Automotivos" style={{ width: '48px', height: '48px' }} />
              <div>
                <div style={{ fontFamily: 'var(--mk-font-heading)', fontWeight: 900, fontSize: '18px', color: '#ffffff' }}>
                  MK SERVIÇOS AUTOMOTIVOS
                </div>
                <div style={{ fontSize: '11px', color: 'var(--mk-gray-400)', fontWeight: 600 }}>MECÂNICO GASOLINA E DIESEL</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--mk-gray-400)', lineHeight: 1.6, marginBottom: '20px' }}>
              Oficina mecânica especializada em manutenção preventiva e corretiva para todas as marcas nacionais e importadas. Diagnóstico de precisão e garantia total.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', color: '#34d399', fontWeight: 700 }}>
              <ShieldCheck size={14} /> COBRIMOS QUALQUER ORÇAMENTO
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '16px', color: '#ffffff', textTransform: 'uppercase', marginBottom: '18px', letterSpacing: '0.5px' }}>
              Navegação Rápida
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--mk-gray-400)' }}>
              <li><a href="#home" style={{ color: 'inherit' }}>Início</a></li>
              <li><a href="#servicos" style={{ color: 'inherit' }}>Nossos Serviços</a></li>
              <li><a href="#sobre" style={{ color: 'inherit' }}>Sobre a MK</a></li>
              <li><a href="#agendamento" style={{ color: 'inherit' }}>Faça Seu Agendamento</a></li>
              <li><a href="#contato" style={{ color: 'inherit' }}>Contato e Endereço</a></li>
            </ul>
          </div>

          {/* Emergency & Working Hours */}
          <div>
            <h4 style={{ fontSize: '16px', color: '#ffffff', textTransform: 'uppercase', marginBottom: '18px', letterSpacing: '0.5px' }}>
              Atendimento & Socorro
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--mk-gray-400)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff858a', fontWeight: 700 }}>
                <Zap size={16} /> SOCORRO 24 HORAS
              </div>
              <div><strong>Segunda a Sexta:</strong> 08:00 às 18:00</div>
              <div><strong>Almoço:</strong> 12:00 às 13:30</div>
              <div><strong>Sábado:</strong> 08:00 às 12:00</div>
              <div><strong>Domingo:</strong> Fechado (Atendimento sob chamada)</div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '16px', color: '#ffffff', textTransform: 'uppercase', marginBottom: '18px', letterSpacing: '0.5px' }}>
              Contato Oficial
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--mk-gray-400)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--mk-red-light)" /> {address}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#10B981" /> {phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#60a5fa" /> {email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <InstagramIcon size={16} /> @mk.automotivos
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '12px',
            color: 'var(--mk-gray-500)',
          }}
        >
          <div>
            © 2026 <strong>MK Serviços Automotivos</strong>. Todos os direitos reservados.
          </div>

          {/* Direct link to /admin */}
          <button
            onClick={onNavigateToAdmin}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--mk-gray-500)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              transition: 'color 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--mk-red-light)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--mk-gray-500)')}
          >
            <Wrench size={13} /> Acesso Restrito Oficina (/admin)
          </button>
        </div>
      </div>
    </footer>
  );
};
