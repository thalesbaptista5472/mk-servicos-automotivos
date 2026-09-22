import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Clock,
  Settings,
  LogOut,
  ExternalLink,
  Wrench,
  User,
} from 'lucide-react';
import { api } from '../services/api.js';
import { AdminDashboard } from './AdminDashboard.js';
import { AdminCalendar } from './AdminCalendar.js';
import { AdminAppointments } from './AdminAppointments.js';
import { AdminSchedule } from './AdminSchedule.js';
import { AdminSettings } from './AdminSettings.js';
import { DashboardData } from '../types/index.js';

interface AdminLayoutProps {
  onLogout: () => void;
  onBackToSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout, onBackToSite }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  const currentUser = api.getCurrentUser();

  useEffect(() => {
    loadDashboard();
  }, [activeTab]);

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    }
  };

  const handleSelectAppointmentFromAnywhere = (id: number) => {
    setSelectedAppointmentId(id);
    setActiveTab('appointments');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'calendar', label: 'Calendário', icon: <Calendar size={18} /> },
    { id: 'appointments', label: 'Agendamentos', icon: <ClipboardList size={18} /> },
    { id: 'schedule', label: 'Horários & Bloqueios', icon: <Clock size={18} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={18} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0E11', display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Navbar */}
      <header
        style={{
          background: 'var(--mk-black-surface)',
          borderBottom: '1px solid rgba(143, 20, 27, 0.4)',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/logo_mk_badge.png"
            alt="MK Serviços Automotivos"
            style={{ width: '42px', height: '42px', filter: 'drop-shadow(0 2px 8px rgba(143,20,27,0.5))' }}
          />
          <div>
            <div style={{ fontFamily: 'var(--mk-font-heading)', fontWeight: 900, fontSize: '16px', color: '#ffffff' }}>
              MK SERVIÇOS AUTOMOTIVOS
            </div>
            <div style={{ fontSize: '11px', color: 'var(--mk-red-light)', fontWeight: 700, textTransform: 'uppercase' }}>
              Painel Administrativo da Oficina
            </div>
          </div>
        </div>

        {/* User Info & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'none', sm: 'flex' } as any} className="admin-user-badge">
            <div style={{ textAlign: 'right', marginRight: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{currentUser?.name || 'Administrador'}</div>
              <div style={{ fontSize: '11px', color: 'var(--mk-gray-400)' }}>{currentUser?.email}</div>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(143, 20, 27, 0.3)',
                border: '1px solid var(--mk-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <User size={18} />
            </div>
          </div>

          <button
            onClick={onBackToSite}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ExternalLink size={14} /> Ver Site
          </button>

          <button
            onClick={onLogout}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', borderColor: '#ef4444', color: '#f87171' }}
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </header>

      {/* Main Body with Nav Tabs */}
      <div className="container" style={{ flexGrow: 1, padding: '24px 24px 60px' }}>
        {/* Navigation Tabs Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            background: 'var(--mk-black-surface)',
            padding: '8px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '32px',
          }}
        >
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, var(--mk-red) 0%, var(--mk-red-dark) 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--mk-gray-400)',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        {activeTab === 'dashboard' && (
          <AdminDashboard
            data={dashboardData}
            onViewAppointment={handleSelectAppointmentFromAnywhere}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'calendar' && (
          <AdminCalendar onSelectAppointment={handleSelectAppointmentFromAnywhere} />
        )}

        {activeTab === 'appointments' && (
          <AdminAppointments
            selectedAppointmentId={selectedAppointmentId}
            onClearSelectedId={() => setSelectedAppointmentId(null)}
          />
        )}

        {activeTab === 'schedule' && <AdminSchedule />}

        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
};
