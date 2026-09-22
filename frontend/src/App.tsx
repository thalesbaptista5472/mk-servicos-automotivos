import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { Hero } from './components/Hero.js';
import { Services } from './components/Services.js';
import { AboutUs } from './components/AboutUs.js';
import { BookingWizard } from './components/BookingWizard.js';
import { MapContact } from './components/MapContact.js';
import { WhatsAppFloat } from './components/WhatsAppFloat.js';
import { Footer } from './components/Footer.js';
import { AdminLogin } from './components/AdminLogin.js';
import { AdminLayout } from './components/AdminLayout.js';
import { api } from './services/api.js';
import { WorkshopSettings } from './types/index.js';

export const App: React.FC = () => {
  // Navigation mode: 'site' or 'admin'
  const [currentView, setCurrentView] = useState<'site' | 'admin'>('site');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(api.isAuthenticated());
  const [preselectedService, setPreselectedService] = useState<string>('');

  // Public Settings
  const [settings, setSettings] = useState<Partial<WorkshopSettings>>({
    workshop_name: 'MK SERVIÇOS AUTOMOTIVOS',
    workshop_phone: '(11) 98878-7548',
    workshop_whatsapp: '5511988787548',
    workshop_email: 'mkservicosautomotivos5@gmail.com',
    workshop_address: 'R. O, 79 - Jardim Vitória Régia (Zona Norte), São Paulo - SP, 02675-031',
    workshop_instagram: '@mk.automotivos',
  });

  // Check URL pathname for /admin
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/admin')) {
      setCurrentView('admin');
    }
  }, []);

  // Fetch Public Settings
  useEffect(() => {
    api
      .getPublicSettings()
      .then((data) => {
        if (data) setSettings((prev) => ({ ...prev, ...data }));
      })
      .catch((err) => console.error('Error fetching public settings:', err));
  }, []);

  const handleSelectServiceFromCard = (serviceName: string) => {
    setPreselectedService(serviceName);
    const el = document.getElementById('agendamento');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToBooking = () => {
    const el = document.getElementById('agendamento');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToServices = () => {
    const el = document.getElementById('servicos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
    window.history.pushState(null, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSite = () => {
    setCurrentView('site');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    api.logout();
    setIsAdminAuthenticated(false);
  };

  // If in Admin view
  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToSite={handleBackToSite}
        />
      );
    }

    return (
      <AdminLayout
        onLogout={handleAdminLogout}
        onBackToSite={handleBackToSite}
      />
    );
  }

  // Public Landing Page
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0E11', color: '#ffffff' }}>
      {/* Header */}
      <Header
        onNavigateToBooking={handleNavigateToBooking}
        onNavigateToAdmin={handleOpenAdmin}
        phone={settings.workshop_phone}
        whatsapp={settings.workshop_whatsapp}
      />

      {/* Hero Section */}
      <Hero
        onScheduleClick={handleNavigateToBooking}
        onServicesClick={handleNavigateToServices}
      />

      {/* Services Section */}
      <Services onSelectService={handleSelectServiceFromCard} />

      {/* About Us Section */}
      <AboutUs />

      {/* Interactive Booking Wizard */}
      <BookingWizard
        preselectedService={preselectedService}
        onClearPreselectedService={() => setPreselectedService('')}
      />

      {/* Map and Contact Section */}
      <MapContact
        phone={settings.workshop_phone}
        whatsapp={settings.workshop_whatsapp}
        email={settings.workshop_email}
        address={settings.workshop_address}
        instagram={settings.workshop_instagram}
        mapsEmbed={settings.workshop_maps_embed}
      />

      {/* Footer */}
      <Footer
        onNavigateToAdmin={handleOpenAdmin}
        phone={settings.workshop_phone}
        whatsapp={settings.workshop_whatsapp}
        email={settings.workshop_email}
        address={settings.workshop_address}
      />

      {/* Floating WhatsApp Action */}
      <WhatsAppFloat whatsapp={settings.workshop_whatsapp} />
    </div>
  );
};
