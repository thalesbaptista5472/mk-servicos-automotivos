import React from 'react';
import {
  Wrench,
  Droplet,
  Disc,
  Compass,
  Cpu,
  Zap,
  Wind,
  Settings,
  BatteryCharging,
  Gauge,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
}

export interface ServiceItem {
  id: string;
  name: string;
  shortDesc: string;
  icon: React.ReactNode;
  tag?: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: 'revisao-preventiva',
    name: 'Revisão Preventiva',
    shortDesc: 'Inspeção completa de mais de 40 itens essenciais para segurança, longevidade e economia do veículo.',
    icon: <Settings size={28} />,
    tag: 'Mais Procurado',
  },
  {
    id: 'troca-de-oleo',
    name: 'Troca de Óleo e Filtros',
    shortDesc: 'Lubrificantes de alta performance recomendados pelas montadoras, com troca de filtros de óleo, ar e combustível.',
    icon: <Droplet size={28} />,
    tag: 'Rápido',
  },
  {
    id: 'freios',
    name: 'Sistema de Freios',
    shortDesc: 'Revisão e troca de pastilhas, discos, tambores, sapatas, sangria e fluido de freio com aferição milimétrica.',
    icon: <Disc size={28} />,
    tag: 'Segurança',
  },
  {
    id: 'suspensao',
    name: 'Suspensão e Amortecedores',
    shortDesc: 'Troca de amortecedores, molas, buchas, pivôs e bandejas. Elimine ruídos e recupere a estabilidade na pista.',
    icon: <Layers size={28} />,
  },
  {
    id: 'alinhamento-balanceamento',
    name: 'Alinhamento e Balanceamento',
    shortDesc: 'Geometria 3D computadorizada e balanceamento de precisão para evitar desgaste irregular dos pneus.',
    icon: <Compass size={28} />,
  },
  {
    id: 'diagnostico-eletronico',
    name: 'Diagnóstico Eletrônico',
    shortDesc: 'Scanner automotivo de última geração para leitura precisa de códigos de falha em todos os módulos da ECU.',
    icon: <Cpu size={28} />,
    tag: 'Tecnologia',
  },
  {
    id: 'injecao-eletronica',
    name: 'Injeção Eletrônica',
    shortDesc: 'Limpeza e equalização de bicos injetores, testes de pressão de bomba, corpo de borboleta (TBI) e velas.',
    icon: <Gauge size={28} />,
  },
  {
    id: 'ar-condicionado',
    name: 'Ar-condicionado e Higienização',
    shortDesc: 'Carga de gás refrigerante, teste de vazamento com contraste UV, higienização com ozônio e troca de filtro de cabine.',
    icon: <Wind size={28} />,
  },
  {
    id: 'motor',
    name: 'Motor (Gasolina e Diesel)',
    shortDesc: 'Reparo e retífica de motores ciclo Otto e Diesel, troca de correia dentada, junta de cabeçote e arrefecimento.',
    icon: <Wrench size={28} />,
    tag: 'Especialidade MK',
  },
  {
    id: 'embreagem-cambio',
    name: 'Embreagem e Câmbio',
    shortDesc: 'Substituição de kit platô, disco e rolamento, atuadores hidráulicos e revisão de transmissão manual e automática.',
    icon: <Sparkles size={28} />,
  },
  {
    id: 'sistema-eletrico',
    name: 'Sistema Elétrico Geral',
    shortDesc: 'Diagnóstico de chicotes, iluminação em LED, faróis, lanternas, travas elétricas, vidros e alternador.',
    icon: <Zap size={28} />,
  },
  {
    id: 'bateria',
    name: 'Bateria e Carga',
    shortDesc: 'Teste de saúde da bateria, verificação do regulador de voltagem e substituição por marcas líderes com garantia.',
    icon: <BatteryCharging size={28} />,
  },
];

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  return (
    <section id="servicos" className="section-padding" style={{ backgroundColor: '#141519', position: 'relative' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Wrench size={14} /> Soluções Automotivas Completas
          </div>
          <h2 className="section-title">
            Nossos <span>Serviços</span>
          </h2>
          <p className="section-subtitle">
            Atendimento especializado para veículos leves, utilitários, SUVs e frotas a gasolina e diesel. Todos os serviços contam com garantia e cobrimos qualquer orçamento.
          </p>
        </div>

        {/* Services Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="card-surface"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '28px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(143, 20, 27, 0.7)';
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(143, 20, 27, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => onSelectService(service.name)}
            >
              <div>
                {/* Header Icon + Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(143, 20, 27, 0.3) 0%, rgba(20, 21, 25, 0.8) 100%)',
                      border: '1px solid rgba(143, 20, 27, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--mk-red-light)',
                    }}
                  >
                    {service.icon}
                  </div>

                  {service.tag && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: 'rgba(143, 20, 27, 0.2)',
                        border: '1px solid rgba(143, 20, 27, 0.5)',
                        color: '#ff858a',
                      }}
                    >
                      {service.tag}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '19px', marginBottom: '12px', color: '#ffffff' }}>
                  {service.name}
                </h3>

                <p style={{ fontSize: '14px', color: 'var(--mk-gray-400)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {service.shortDesc}
                </p>
              </div>

              {/* Action Trigger */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  color: 'var(--mk-red-light)',
                  fontWeight: 700,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <span>Agendar Este Serviço</span>
                <ArrowUpRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
