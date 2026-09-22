import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppFloatProps {
  whatsapp?: string;
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ whatsapp = '5511988787548' }) => {
  const [showTooltip, setShowTooltip] = useState(true);
  const cleanPhone = whatsapp.replace(/\D/g, '');
  const url = `https://wa.me/${cleanPhone}?text=Ol%C3%A1%2C%20visitei%20o%20site%20da%20MK%20Servi%C3%A7os%20Automotivos%20e%20gostaria%20de%20um%20atendimento.`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div
          style={{
            background: 'var(--mk-black-surface)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            marginBottom: '12px',
            maxWidth: '240px',
            fontSize: '13px',
            color: '#ffffff',
            position: 'relative',
            animation: 'fadeInUp 0.3s ease',
          }}
        >
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Fechar dica"
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              background: 'transparent',
              border: 'none',
              color: 'var(--mk-gray-500)',
              cursor: 'pointer',
            }}
          >
            <X size={14} />
          </button>
          <div style={{ fontWeight: 700, color: '#10B981', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
            Atendimento Online
          </div>
          <div style={{ color: 'var(--mk-gray-300)', fontSize: '12px' }}>
            Precisa de um guincho ou tirar dúvidas mecânicas? Fale conosco agora!
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <a
        id="btn-whatsapp-flutuante"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp"
        style={{
          width: '62px',
          height: '62px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.55)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 14px 30px rgba(16, 185, 129, 0.75)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.55)';
        }}
      >
        <MessageCircle size={32} />
      </a>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
