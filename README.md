# MK SERVIÇOS AUTOMOTIVOS — Sistema Web Completo

Plataforma web profissional, moderna, responsiva e totalmente funcional desenvolvida para a oficina mecânica **MK Serviços Automotivos**, com identidade visual 100% fiel à fachada oficial (`FACHADA_MK.pdf`).

---

## 🚀 Visão Geral das Funcionalidades

1. **Website Institucional de Alta Performance**:
   - Identidade visual oficial: logotipo com emblema circular 3D, chave cromada, assinatura cursiva *"Serviços Automotivos"*, paleta bordô automotivo (`#8F141B`) e grafite metálico.
   - Chamadas oficiais: *"Mecânico de gasolina e diesel"*, *"SOCORRO 24H"*, *"COBRIMOS QUALQUER ORÇAMENTO"*, *"Seu carro em boas mãos"*.
   - 12 cards interativos de serviços com microinterações e agendamento direto.
   - Seção Sobre Nós, equipe técnica, garantias e diferenciais.
   - Seção de contato com endereço físico (`Rua O, 83 - Vitória Régia, SP`), telefone, WhatsApp, Instagram e mapa integrado via Google Maps.
   - Botão flutuante de WhatsApp com balão de atendimento e link direto.

2. **Sistema Real de Agendamento ("FAÇA SEU AGENDAMENTO")**:
   - Formulário multi-etapas com validação estrita (dados do cliente, veículo, serviço e descrição do problema).
   - Máscara dinâmica de telefone celular e placa veicular (padrão Mercosul e tradicional).
   - **Consulta de disponibilidade em tempo real**: horários ocupados por outros clientes ou bloqueados pela oficina são desabilitados, impedindo duplicidade.
   - Tela de conferência dos dados antes de confirmar.
   - Disparo automático de e-mails de notificação para a oficina (`mkservicosautomotivos5@gmail.com`) e comprovante para o cliente.

3. **Painel Administrativo da Oficina (`/admin`)**:
   - Autenticação segura com JWT e senhas criptografadas via `bcryptjs`.
   - **Dashboard**: contadores em tempo real (Hoje, Semana, Aguardando, Confirmados, Cancelados), gráfico de distribuição e lista de próximos agendamentos.
   - **Calendário Visual**: visualização por dia e mês com cards de compromissos e horários bloqueados.
   - **Gestão de Agendamentos**: filtros por status e busca por nome/placa/telefone, modal de detalhes, alteração de status e reagendamento.
   - **Cancelamento Motivado**: cancelamento com registro obrigatório de motivo e administrador responsável.
   - **Trilha de Auditoria (Histórico)**: registro detalhado de todas as alterações feitas em cada agendamento.
   - **Grade Semanal & Bloqueio de Horários**: configuração do horário de abertura, fechamento e almoço, além de bloqueio pontual de datas/horários com motivo (ex: "Reunião interna", "Feriado").
   - **Configurações**: personalização dos contatos, WhatsApp, endereço e link do Google Maps.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Vite, Vanilla CSS com Design System baseado na fachada, Lucide Icons.
- **Backend**: Node.js 24, Express, TypeScript, SQLite nativo (`node:sqlite` de alto desempenho, sem dependência de compiladores C++), Nodemailer, JWT, BcryptJS.
- **Banco de Dados**: SQLite estruturado com integridade referencial e índices.

---

## 📦 Estrutura do Projeto

```text
mk-servicos-automotivos/
├── backend/
│   ├── src/
│   │   ├── config/             # Configurações e variáveis de ambiente
│   │   ├── db/                 # Banco de dados SQLite, migrações e seeds
│   │   ├── middleware/         # Autenticação JWT e proteção de rotas
│   │   ├── routes/             # Endpoints (auth, appointments, admin)
│   │   ├── services/           # Envio de e-mails (Nodemailer)
│   │   └── index.ts            # Ponto de entrada do servidor Express
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/                 # Favicon, robots.txt, sitemap.xml, assets
│   ├── src/
│   │   ├── assets/             # Logotipo oficial, imagens da fachada
│   │   ├── components/         # Header, Hero, Services, BookingWizard, Admin, etc.
│   │   ├── services/           # Cliente de API
│   │   ├── styles/             # CSS moderno e tokens de design
│   │   ├── types/              # Definições TypeScript
│   │   ├── App.tsx             # Roteamento e renderização principal
│   │   └── main.tsx
│   ├── index.html              # SEO, Open Graph e fontes Google
│   ├── package.json
│   └── vite.config.ts
├── assets/                     # Assets originais processados da FACHADA_MK.pdf
├── package.json                # Orquestrador de inicialização simultânea
└── README.md                   # Documentação completa do sistema
```

---

## ⚙️ Como Instalar e Executar Localmente

### Pré-requisitos
- **Node.js**: Versão 20 ou superior (recomendado v22 ou v24).
- **NPM**: Versão 9 ou superior.

### 1. Instalação das Dependências
No diretório raiz do projeto (`mk-servicos-automotivos`):
```bash
# Instala as dependências da raiz
npm install

# Instala as dependências do backend
npm install --prefix backend

# Instala as dependências do frontend
npm install --prefix frontend
```

### 2. Executar em Modo de Desenvolvimento
Para rodar tanto o backend (porta 5000) quanto o frontend (porta 3000) simultaneamente:
```bash
npm run dev
```

- **Acesse o site**: [http://localhost:3000](http://localhost:3000)
- **Acesse o painel administrativo**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔐 Credenciais Padrão do Administrador

Ao iniciar pela primeira vez, o sistema cria automaticamente o usuário administrador inicial no banco de dados:

- **E-mail**: `admin@mkservicos.com.br`
- **Senha**: `admin123`

*(Você pode alterar a senha ou cadastrar novos administradores diretamente pelo banco ou definindo as variáveis `DEFAULT_ADMIN_EMAIL` e `DEFAULT_ADMIN_PASSWORD` no arquivo `.env` antes do primeiro início).*

---

## 📧 Como Configurar o Envio Real de E-mails (Nodemailer / SMTP)

O sistema possui modo **resiliente**: quando as variáveis de e-mail não estiverem preenchidas, ele registra os e-mails com formatação completa no console do backend e salva os agendamentos no banco normalmente, permitindo testes sem falhas.

Para ativar o envio real via Gmail ou servidor SMTP:

1. No diretório `backend`, crie um arquivo `.env` baseado em `.env.example`:
```env
PORT=5000
JWT_SECRET=mk_servicos_automotivos_jwt_secret_key_2026_super_secure
DB_PATH=mk_database.sqlite

# Configuração de E-mail SMTP (Exemplo Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=mkservicosautomotivos5@gmail.com
EMAIL_PASSWORD=coloque_aqui_sua_senha_de_app_do_google
EMAIL_DESTINATION=mkservicosautomotivos5@gmail.com
EMAIL_FROM_NAME=MK Serviços Automotivos
```

> **Como gerar Senha de App no Gmail**:
> 1. Acesse sua Conta Google > Segurança.
> 2. Ative a *Verificação em duas etapas*.
> 3. Pesquise por *"Senhas de app"*, digite "MK Oficina" e gere a senha de 16 letras.
> 4. Cole essa senha no campo `EMAIL_PASSWORD`.

---

## 📱 Como Configurar o WhatsApp e o Endereço

Você pode alterar o telefone, WhatsApp e endereço de duas formas:

1. **Pelo Painel Administrativo** (`/admin`):
   - Faça login com o usuário administrador.
   - Clique na aba **Configurações**.
   - Atualize os campos de Telefone, WhatsApp, E-mail, Endereço e Link do Google Maps e clique em **Salvar Configurações**. O site é atualizado instantaneamente!

2. **Pelas Variáveis de Ambiente no `backend/.env`**:
   ```env
   WORKSHOP_PHONE=(11) 98878-7548
   WORKSHOP_WHATSAPP=5511988787548
   WORKSHOP_EMAIL=mkservicosautomotivos5@gmail.com
   WORKSHOP_ADDRESS=Rua O, 83 - Vitória Régia, SP
   WORKSHOP_INSTAGRAM=@mk.automotivos
   ```

---

## 🌐 Como Fazer o Deploy em Produção

### Opção 1: VPS / Servidor Dedicado (Ubuntu / Debian / Windows Server)
1. Clone o repositório no servidor.
2. Execute `npm install` na raiz, em `backend` e em `frontend`.
3. Gere o build de produção do frontend:
   ```bash
   npm run build --prefix frontend
   ```
4. Inicie o servidor Node.js com o gerenciador de processos PM2:
   ```bash
   pm2 start backend/src/index.ts --name "mk-oficina-api" --interpreter npx --interpreter-args "tsx"
   ```
5. Aponte o Nginx ou Apache para servir a pasta `frontend/dist` e fazer proxy reverso de `/api` para `http://localhost:5000`.

### Opção 2: Plataformas em Nuvem (Render, Railway, Fly.io)
- Configure o serviço Node.js com comando de inicialização `npm run start --prefix backend`.
- Adicione as variáveis de ambiente no painel da nuvem.

---

## 🔍 Testes e Validação de Conflitos

- **Prevenção de Duplicidade de Horário**: Quando um cliente agenda um horário (ex: Terça-feira às 09:00), o sistema marca o horário como `Ocupado` imediatamente para todos os outros usuários. Qualquer tentativa simultânea retorna status HTTP 409 Conflict.
- **Bloqueio Administrativo**: O administrador pode bloquear horários específicos na aba *Horários & Bloqueios* com motivo cadastrado (ex: "Reunião interna"), impedindo novas reservas.
- **Auditoria de Alterações**: Toda mudança de status, cancelamento ou reagendamento é registrada com timestamp e usuário responsável.
