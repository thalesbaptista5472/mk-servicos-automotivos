import React, { useState } from 'react';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { api } from '../services/api.js';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('admin@mkservicos.com.br');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await api.login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0D0E11',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        background: 'radial-gradient(circle at 50% 30%, rgba(143, 20, 27, 0.25) 0%, #0D0E11 75%)',
      }}
    >
      {/* Return to website */}
      <button
        onClick={onBackToSite}
        style={{
          position: 'absolute',
          top: '28px',
          left: '28px',
          background: 'var(--mk-black-surface)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'var(--mk-gray-300)',
          padding: '10px 18px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <ArrowLeft size={16} /> Voltar ao Site
      </button>

      <div
        className="card-surface"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid rgba(143, 20, 27, 0.5)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          backgroundColor: '#16181E',
          textAlign: 'center',
        }}
      >
        {/* Brand Emblem */}
        <img
          src="/logo_mk_badge.png"
          alt="MK Serviços Automotivos"
          style={{ width: '80px', height: '80px', margin: '0 auto 16px', display: 'block' }}
        />

        <h2 style={{ fontSize: '22px', color: '#ffffff', textTransform: 'uppercase', marginBottom: '4px' }}>
          Área Administrativa
        </h2>
        <div style={{ fontSize: '13px', color: 'var(--mk-gray-400)', marginBottom: '28px' }}>
          MK Serviços Automotivos • Painel da Oficina
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '12px',
              color: '#fca5a5',
              fontSize: '13px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
              E-mail do Administrador
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', top: '15px', left: '14px', color: 'var(--mk-gray-500)' }} />
              <input
                id="admin-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',
                  background: 'var(--mk-black-deep)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
              Senha de Acesso
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '15px', left: '14px', color: 'var(--mk-gray-500)' }} />
              <input
                id="admin-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 44px',
                  background: 'var(--mk-black-deep)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <button
            id="btn-admin-entrar"
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '15px', marginTop: '10px' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <span>Entrar no Painel</span>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', fontSize: '12px', color: 'var(--mk-gray-400)' }}>
          <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: '#10B981' }} />
          Acesso protegido. Suas credenciais são criptografadas com hash bcrypt.
        </div>
      </div>
    </div>
  );
};
