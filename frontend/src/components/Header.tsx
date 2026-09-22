import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Phone, ShieldCheck, Wrench } from 'lucide-react';

interface HeaderProps {
  onNavigateToBooking: () => void;
  onNavigateToAdmin?: () => void;
  phone?: string;
  whatsapp?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateToBooking,
  onNavigateToAdmin,
  phone = '(11) 98878-7548',
  whatsapp = '5511988787548',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: isScrolled ? 'rgba(13, 14, 17, 0.95)' : 'rgba(13, 14, 17, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: isScrolled ? 'rgba(143, 20, 27, 0.35)' : 'rgba(255, 255, 255, 0.08)',
        boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Top Banner with Guarantee and 24h Emergency */}
      <div
        style={{
          background: 'linear-gradient(90deg, #8F141B 0%, #5C0D11 50%, #8F141B 100%)',
          padding: '6px 0',
          fontSize: '12px',
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ background: '#10B981', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }}></span>
            SOCORRO 24H • MECÂNICO DE GASOLINA E DIESEL
          </span>
          <span style={{ display: 'none', md: 'inline' } as any} className="top-banner-guarantee">
            ★ COBRIMOS QUALQUER ORÇAMENTO ★
          </span>
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20MK.`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Phone size={13} /> {phone}
          </a>
        </div>
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
        {/* Brand Logo & Name */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}
        >
          <img
            src="/logo_mk_badge.png"
            alt="MK Serviços Automotivos"
            style={{
              width: '56px',
              height: '56px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 10px rgba(143, 20, 27, 0.5))',
              transition: 'transform 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <div>
            <div
              style={{
                fontFamily: 'var(--mk-font-heading)',
                fontWeight: 900,
                fontSize: '20px',
                letterSpacing: '-0.3px',
                color: '#ffffff',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              MK <span style={{ color: 'var(--mk-red-light)', fontSize: '18px' }}>SERVIÇOS AUTOMOTIVOS</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--mk-gray-400)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Mecânica Especializada • Gasolina e Diesel
            </div>
          </div>
        </a>

        {/* Desktop Menu */}
        <nav style={{ display: 'none', lg: 'flex' } as any} className="desktop-nav">
          <ul style={{ display: 'flex', alignItems: 'center', gap: '28px', listStyle: 'none' }}>
            <li>
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('home');
                }}
                style={{ fontWeight: 600, fontSize: '14px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--mk-red-light)')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#ffffff')}
              >
                Início
              </a>
            </li>
            <li>
              <a
                href="#servicos"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('servicos');
                }}
                style={{ fontWeight: 600, fontSize: '14px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--mk-red-light)')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#ffffff')}
              >
                Serviços
              </a>
            </li>
            <li>
              <a
                href="#sobre"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('sobre');
                }}
                style={{ fontWeight: 600, fontSize: '14px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--mk-red-light)')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#ffffff')}
              >
                Sobre Nós
              </a>
            </li>
            <li>
              <a
                href="#agendamento"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('agendamento');
                }}
                style={{ fontWeight: 600, fontSize: '14px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--mk-red-light)')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#ffffff')}
              >
                Agendamento
              </a>
            </li>
            <li>
              <a
                href="#contato"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contato');
                }}
                style={{ fontWeight: 600, fontSize: '14px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'var(--mk-red-light)')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#ffffff')}
              >
                Contato
              </a>
            </li>
          </ul>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Main Booking Button */}
          <button
            id="btn-nav-agendamento"
            onClick={() => {
              setMobileMenuOpen(false);
              scrollToSection('agendamento');
            }}
            className="btn btn-primary pulse-glow"
            style={{
              padding: '12px 24px',
              fontSize: '13px',
              letterSpacing: '1px',
            }}
          >
            <Calendar size={16} />
            <span>Faça Seu Agendamento</span>
          </button>

          {/* Hamburger Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir Menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--mk-black-surface)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--mk-black-deep)',
            borderTop: '1px solid rgba(143, 20, 27, 0.3)',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          }}
        >
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <li>
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('home');
                }}
                style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', display: 'block', padding: '8px 0' }}
              >
                Início
              </a>
            </li>
            <li>
              <a
                href="#servicos"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('servicos');
                }}
                style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', display: 'block', padding: '8px 0' }}
              >
                Nossos Serviços
              </a>
            </li>
            <li>
              <a
                href="#sobre"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('sobre');
                }}
                style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', display: 'block', padding: '8px 0' }}
              >
                Sobre Nós
              </a>
            </li>
            <li>
              <a
                href="#agendamento"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('agendamento');
                }}
                style={{ fontSize: '16px', fontWeight: 700, color: 'var(--mk-red-light)', display: 'block', padding: '8px 0' }}
              >
                Faça Seu Agendamento
              </a>
            </li>
            <li>
              <a
                href="#contato"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contato');
                }}
                style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', display: 'block', padding: '8px 0' }}
              >
                Contato & Localização
              </a>
            </li>
            <li style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigateToAdmin) onNavigateToAdmin();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--mk-gray-400)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Wrench size={16} /> Acesso Administrativo (/admin)
              </button>
            </li>
          </ul>
        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .top-banner-guarantee { display: inline !important; }
        }
        @media (max-width: 991px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .top-banner-guarantee { display: none !important; }
        }
      `}</style>
    </header>
  );
};
