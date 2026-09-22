import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, AlertCircle, Mail, Phone, MapPin, Globe, Loader2, Info } from 'lucide-react';
import { api } from '../services/api.js';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({
    workshop_name: 'MK SERVIÇOS AUTOMOTIVOS',
    workshop_phone: '(11) 98878-7548',
    workshop_whatsapp: '5511988787548',
    workshop_email: 'mkservicosautomotivos5@gmail.com',
    workshop_address: 'R. O, 79 - Jardim Vitória Régia (Zona Norte), São Paulo - SP, 02675-031',
    workshop_instagram: '@mk.automotivos',
    workshop_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.8!2d-46.7324!3d-23.5312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef892bf4bfbfb%3A0x2a0fefc2a9ec682b!2sR.%20O%2C%2079%20-%20Jardim%20Vit%C3%B3ria%20R%C3%A9gia%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2002675-031!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api.getSettings();
      setSettings((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.updateSettings(settings);
      setMessage({ text: 'Configurações atualizadas com sucesso!', isError: false });
    } catch (err: any) {
      setMessage({ text: err.message || 'Erro ao salvar configurações.', isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '800px' }}>
      <div>
        <h2 style={{ fontSize: '26px', color: '#ffffff', textTransform: 'uppercase', marginBottom: '4px' }}>
          Configurações da Oficina
        </h2>
        <p style={{ color: 'var(--mk-gray-400)', fontSize: '14px' }}>
          Atualize os dados de contato, WhatsApp, endereço e informações exibidas no site.
        </p>
      </div>

      {message && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: message.isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${message.isError ? '#ef4444' : '#10B981'}`,
            color: message.isError ? '#fca5a5' : '#34d399',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {message.isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--mk-gray-400)' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block' }} />
          Carregando dados da oficina...
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            className="card-surface"
            style={{
              background: 'var(--mk-black-surface)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '28px',
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <h3 style={{ fontSize: '18px', color: '#ffffff', textTransform: 'uppercase', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
              Dados de Identificação & Contato
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                Nome Comercial da Oficina
              </label>
              <input
                type="text"
                value={settings.workshop_name || ''}
                onChange={(e) => setSettings({ ...settings, workshop_name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--mk-black-deep)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#ffffff',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                  Telefone de Atendimento
                </label>
                <input
                  type="text"
                  value={settings.workshop_phone || ''}
                  onChange={(e) => setSettings({ ...settings, workshop_phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--mk-black-deep)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                  WhatsApp Comercial (somente números)
                </label>
                <input
                  type="text"
                  value={settings.workshop_whatsapp || ''}
                  onChange={(e) => setSettings({ ...settings, workshop_whatsapp: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--mk-black-deep)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: '#ffffff',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                  E-mail Oficial da Oficina
                </label>
                <input
                  type="email"
                  value={settings.workshop_email || ''}
                  onChange={(e) => setSettings({ ...settings, workshop_email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--mk-black-deep)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                  Instagram Oficial
                </label>
                <input
                  type="text"
                  value={settings.workshop_instagram || ''}
                  onChange={(e) => setSettings({ ...settings, workshop_instagram: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--mk-black-deep)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: '#ffffff',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                Endereço Físico Completo
              </label>
              <input
                type="text"
                value={settings.workshop_address || ''}
                onChange={(e) => setSettings({ ...settings, workshop_address: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--mk-black-deep)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#ffffff',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mk-gray-300)', marginBottom: '6px' }}>
                Link de Incorporação (iframe src) do Google Maps
              </label>
              <textarea
                rows={3}
                value={settings.workshop_maps_embed || ''}
                onChange={(e) => setSettings({ ...settings, workshop_maps_embed: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--mk-black-deep)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ alignSelf: 'flex-start', padding: '12px 24px' }}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Salvar Configurações
            </button>
          </div>

          {/* Email Integration Documentation Card (Section 29) */}
          <div
            className="card-surface"
            style={{
              background: 'var(--mk-black-surface)',
              border: '1px solid rgba(143, 20, 27, 0.3)',
              padding: '24px',
              borderRadius: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', marginBottom: '12px' }}>
              <Info size={18} />
              <h4 style={{ fontSize: '15px', color: '#ffffff', textTransform: 'uppercase' }}>
                Configuração do Serviço de E-mail (Nodemailer / SMTP)
              </h4>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--mk-gray-300)', lineHeight: 1.6, marginBottom: '12px' }}>
              Para envio ativo dos e-mails através da sua conta de e-mail (ex: Gmail), configure as seguintes variáveis no arquivo <code>backend/.env</code> no servidor:
            </p>
            <pre
              style={{
                background: 'var(--mk-black-deep)',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#34d399',
                overflowX: 'auto',
                lineHeight: 1.5,
              }}
            >
{`EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=mkservicosautomotivos5@gmail.com
EMAIL_PASSWORD=sua_senha_de_app_gerada_no_google
EMAIL_DESTINATION=mkservicosautomotivos5@gmail.com`}
            </pre>
            <p style={{ fontSize: '12px', color: 'var(--mk-gray-500)', marginTop: '10px' }}>
              * Quando estas variáveis não estão configuradas, o sistema opera em modo de desenvolvimento resiliente, gravando o payload e o log no console para nunca interromper a experiência do usuário.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
