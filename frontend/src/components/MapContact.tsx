import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';

const InstagramIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface MapContactProps {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  instagram?: string;
  mapsEmbed?: string;
}

export const MapContact: React.FC<MapContactProps> = ({
  phone = '(11) 98878-7548',
  whatsapp = '5511988787548',
  email = 'mkservicosautomotivos5@gmail.com',
  address = 'Rua O, 83 - Vitória Régia, SP',
  instagram = '@mk.automotivos',
  mapsEmbed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.0471206132333!2d-46.73236372467069!3d-23.530799778819515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef892bf4bfbfb%3A0x2a0fefc2a9ec682b!2sRua%20O%2C%2083%20-%20Vitoria%20Regia%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr',
}) => {
  const cleanWhatsApp = whatsapp.replace(/\D/g, '');
  const whatsAppUrl = `https://wa.me/${cleanWhatsApp}?text=Ol%C3%A1%2C%20visitei%20o%20site%20da%20MK%20Servi%C3%A7os%20Automotivos%20e%20gostaria%20de%20um%20atendimento.`;

  return (
    <section id="contato" className="section-padding" style={{ backgroundColor: '#141519', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <MapPin size={14} /> Localização e Atendimento
          </div>
          <h2 className="section-title">
            ENTRE EM <span>CONTATO</span>
          </h2>
          <p className="section-subtitle">
            Venha nos fazer uma visita ou fale diretamente com nossos mecânicos. Atendimento rápido, consultoria técnica e orçamento transparente.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'stretch',
          }}
        >
          {/* Contact Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              className="card-surface"
              style={{
                background: 'var(--mk-black-surface)',
                border: '1px solid rgba(143, 20, 27, 0.4)',
                padding: '32px',
                borderRadius: '16px',
              }}
            >
              <h3
                style={{
                  fontSize: '22px',
                  color: '#ffffff',
                  marginBottom: '24px',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  paddingBottom: '12px',
                }}
              >
                MK SERVIÇOS AUTOMOTIVOS
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Address */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(143, 20, 27, 0.2)',
                      border: '1px solid rgba(143, 20, 27, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--mk-red-light)',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--mk-gray-400)', textTransform: 'uppercase' }}>Endereço</div>
                    <div style={{ fontSize: '15px', color: '#ffffff', fontWeight: 600 }}>{address}</div>
                    <div style={{ fontSize: '13px', color: 'var(--mk-gray-400)' }}>Fácil acesso e estacionamento para clientes</div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10B981',
                      flexShrink: 0,
                    }}
                  >
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--mk-gray-400)', textTransform: 'uppercase' }}>WhatsApp & Celular</div>
                    <div style={{ fontSize: '16px', color: '#ffffff', fontWeight: 700 }}>{phone}</div>
                    <div style={{ fontSize: '13px', color: '#34d399' }}>Disponível para agendamentos e orçamentos</div>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#60a5fa',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--mk-gray-400)', textTransform: 'uppercase' }}>E-mail Comercial</div>
                    <a href={`mailto:${email}`} style={{ fontSize: '15px', color: '#60a5fa', fontWeight: 600 }}>{email}</a>
                  </div>
                </div>

                {/* Working Hours */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fbbf24',
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--mk-gray-400)', textTransform: 'uppercase' }}>Horário de Funcionamento</div>
                    <div style={{ fontSize: '14px', color: '#ffffff' }}><strong>Segunda a Sexta:</strong> 08:00 às 18:00 (Almoço: 12h - 13:30)</div>
                    <div style={{ fontSize: '14px', color: '#ffffff' }}><strong>Sábado:</strong> 08:00 às 12:00</div>
                    <div style={{ fontSize: '13px', color: '#ff858a', fontWeight: 600 }}>Domingo: Fechado (Socorro 24H sob chamada)</div>
                  </div>
                </div>

                {/* Instagram */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(236, 72, 153, 0.15)',
                      border: '1px solid rgba(236, 72, 153, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f472b6',
                      flexShrink: 0,
                    }}
                  >
                    <InstagramIcon size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--mk-gray-400)', textTransform: 'uppercase' }}>Siga no Instagram</div>
                    <a
                      href={`https://instagram.com/${instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '15px', color: '#f472b6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {instagram} <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: '28px' }}>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%', padding: '16px' }}
                >
                  <MessageCircle size={20} />
                  <span>FALE CONOSCO PELO WHATSAPP</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Column */}
          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'var(--mk-black-surface)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                background: 'var(--mk-black-elevated)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="var(--mk-red-light)" />
                <span style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>Mapa de Localização</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '12px', color: 'var(--mk-red-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Abrir no Google Maps <ExternalLink size={13} />
              </a>
            </div>

            <div style={{ flexGrow: 1, minHeight: '380px', position: 'relative' }}>
              <iframe
                title="Localização MK Serviços Automotivos"
                src={mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', minHeight: '380px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
