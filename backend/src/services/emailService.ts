import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

interface AppointmentEmailData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehiclePlate: string;
  vehicleMileage?: string;
  service: string;
  date: string;
  time: string;
  description?: string;
  createdAt: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured: boolean = false;

  constructor() {
    if (config.email.host && config.email.user && config.email.password) {
      try {
        this.transporter = nodemailer.createTransport({
          host: config.email.host,
          port: config.email.port,
          secure: config.email.port === 465,
          auth: {
            user: config.email.user,
            pass: config.email.password,
          },
        });
        this.isConfigured = true;
        console.log('[EmailService] SMTP transporter configured successfully.');
      } catch (err) {
        console.warn('[EmailService] Failed to create SMTP transporter:', err);
      }
    } else {
      console.log('[EmailService] SMTP credentials not set. Running in resilient mock/logger mode.');
    }
  }

  public async sendNewAppointmentNotification(data: AppointmentEmailData): Promise<boolean> {
    const subject = 'NOVO AGENDAMENTO — MK SERVIÇOS AUTOMOTIVOS';
    const destination = config.email.destination || config.workshopEmail;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #121212; color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #8F141B;">
        <div style="background: linear-gradient(135deg, #8F141B 0%, #4a0a0e 100%); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">
            MK SERVIÇOS AUTOMOTIVOS
          </h1>
          <p style="color: #e5e7eb; margin: 8px 0 0; font-size: 14px;">Novo Agendamento Recebido via Website</p>
        </div>
        
        <div style="padding: 24px; background-color: #1a1a1a;">
          <h2 style="color: #10B981; font-size: 18px; border-bottom: 1px solid #333; padding-bottom: 8px; margin-top: 0;">
            Dados do Agendamento
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; width: 40%;"><strong>Data / Horário:</strong></td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${data.date} às ${data.time}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;"><strong>Serviço Desejado:</strong></td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${data.service}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;"><strong>Data da Solicitação:</strong></td>
              <td style="padding: 8px 0; color: #ffffff;">${data.createdAt}</td>
            </tr>
          </table>

          <h2 style="color: #e5e7eb; font-size: 16px; border-bottom: 1px solid #333; padding-bottom: 8px;">
            Dados do Cliente
          </h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; width: 40%;"><strong>Nome:</strong></td>
              <td style="padding: 8px 0; color: #ffffff;">${data.clientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;"><strong>E-mail:</strong></td>
              <td style="padding: 8px 0; color: #ffffff;"><a href="mailto:${data.clientEmail}" style="color: #60a5fa;">${data.clientEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;"><strong>Telefone / WhatsApp:</strong></td>
              <td style="padding: 8px 0; color: #ffffff;">${data.clientPhone}</td>
            </tr>
          </table>

          <h2 style="color: #e5e7eb; font-size: 16px; border-bottom: 1px solid #333; padding-bottom: 8px;">
            Dados do Veículo
          </h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #9ca3af; width: 40%;"><strong>Veículo:</strong></td>
              <td style="padding: 8px 0; color: #ffffff;">${data.vehicleBrand} ${data.vehicleModel} (${data.vehicleYear})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;"><strong>Placa:</strong></td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: bold; letter-spacing: 1px;">${data.vehiclePlate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #9ca3af;"><strong>Quilometragem:</strong></td>
              <td style="padding: 8px 0; color: #ffffff;">${data.vehicleMileage || 'Não informada'}</td>
            </tr>
          </table>

          <h2 style="color: #e5e7eb; font-size: 16px; border-bottom: 1px solid #333; padding-bottom: 8px;">
            Descrição do Problema / Observações
          </h2>
          <div style="background-color: #262626; padding: 12px; border-radius: 6px; font-size: 14px; color: #e5e7eb; line-height: 1.5;">
            ${data.description ? data.description.replace(/\n/g, '<br/>') : 'Nenhuma observação informada pelo cliente.'}
          </div>
        </div>

        <div style="padding: 16px; background-color: #0d0d0d; text-align: center; font-size: 12px; color: #6b7280;">
          MK SERVIÇOS AUTOMOTIVOS • Mecânico de Gasolina e Diesel • Socorro 24h<br/>
          R. O, 79 - Jardim Vitória Régia (Zona Norte), São Paulo - SP, 02675-031 • WhatsApp: (11) 98878-7548
        </div>
      </div>
    `;

    const textContent = `
NOVO AGENDAMENTO — MK SERVIÇOS AUTOMOTIVOS

Cliente: ${data.clientName}
E-mail: ${data.clientEmail}
Telefone: ${data.clientPhone}

Veículo: ${data.vehicleBrand} ${data.vehicleModel} / ${data.vehicleYear}
Placa: ${data.vehiclePlate}
Quilometragem: ${data.vehicleMileage || 'Não informada'}

Serviço: ${data.service}
Data: ${data.date}
Horário: ${data.time}

Descrição do problema:
${data.description || 'Não informada'}

Data/hora da solicitação: ${data.createdAt}
    `.trim();

    if (this.isConfigured && this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"${config.email.fromName}" <${config.email.user}>`,
          to: destination,
          subject,
          text: textContent,
          html: htmlContent,
        });
        console.log(`[EmailService] Workshop notification sent to ${destination}`);
        return true;
      } catch (err) {
        console.error('[EmailService] Failed to send email via SMTP:', err);
        return false;
      }
    } else {
      console.log(`[EmailService - MOCK SEND] To Workshop: ${destination}\n${textContent}`);
      return true;
    }
  }

  public async sendClientConfirmation(data: AppointmentEmailData): Promise<boolean> {
    const subject = 'Solicitação de Agendamento Recebida — MK Serviços Automotivos';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #1f2937; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #8F141B 0%, #5e0e12 100%); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; text-transform: uppercase;">
            MK SERVIÇOS AUTOMOTIVOS
          </h1>
          <p style="color: #fca5a5; margin: 6px 0 0; font-size: 13px;">Seu carro em boas mãos</p>
        </div>

        <div style="padding: 24px;">
          <p style="font-size: 16px; margin-top: 0;">Olá, <strong>${data.clientName}</strong>.</p>
          <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
            Seu pedido de agendamento foi recebido pela <strong>MK Serviços Automotivos</strong>.
          </p>

          <div style="background-color: #f9fafb; border-left: 4px solid #8F141B; padding: 16px; margin: 20px 0; border-radius: 0 6px 6px 0;">
            <p style="margin: 4px 0; font-size: 14px;"><strong>Data Solicitada:</strong> ${data.date}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Horário:</strong> ${data.time}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Veículo:</strong> ${data.vehicleBrand} ${data.vehicleModel} (${data.vehiclePlate})</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Serviço:</strong> ${data.service}</p>
          </div>

          <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 14px; margin: 20px 0; text-align: center;">
            <strong style="color: #065f46; font-size: 14px;">
              ✓ Solicitação recebida. Aguarde a confirmação da oficina.
            </strong>
            <p style="margin: 6px 0 0; font-size: 13px; color: #047857;">
              Nossa equipe técnica recebeu sua solicitação e entrará em contato via WhatsApp ou telefone para confirmar o atendimento.
            </p>
          </div>

          <p style="font-size: 14px; color: #4b5563;">
            Obrigado por escolher a <strong>MK Serviços Automotivos</strong>. Cobrimos qualquer orçamento com a melhor qualidade e garantia!
          </p>
        </div>

        <div style="padding: 16px; background-color: #f3f4f6; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
          <strong>MK Serviços Automotivos</strong> • Mecânico de Gasolina e Diesel • Socorro 24H<br/>
          R. O, 79 - Jardim Vitória Régia (Zona Norte), São Paulo - SP, 02675-031 • WhatsApp: (11) 98878-7548
        </div>
      </div>
    `;

    const textContent = `
Olá, ${data.clientName}.

Seu pedido de agendamento foi recebido pela MK Serviços Automotivos.

Data: ${data.date}
Horário: ${data.time}
Veículo: ${data.vehicleBrand} ${data.vehicleModel} (${data.vehiclePlate})
Serviço: ${data.service}

Solicitação recebida. Aguarde a confirmação da oficina.

Nossa equipe recebeu sua solicitação e entrará em contato para confirmar o atendimento.

Obrigado por escolher a MK Serviços Automotivos.
    `.trim();

    if (this.isConfigured && this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"${config.email.fromName}" <${config.email.user}>`,
          to: data.clientEmail,
          subject,
          text: textContent,
          html: htmlContent,
        });
        console.log(`[EmailService] Client confirmation sent to ${data.clientEmail}`);
        return true;
      } catch (err) {
        console.error('[EmailService] Failed to send client confirmation:', err);
        return false;
      }
    } else {
      console.log(`[EmailService - MOCK SEND] To Client: ${data.clientEmail}\n${textContent}`);
      return true;
    }
  }
}

export const emailService = new EmailService();
