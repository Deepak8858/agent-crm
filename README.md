# Agent CRM - Voice AI Integration

A comprehensive CRM system built with Next.js 14+, TypeScript, Prisma, and PostgreSQL, designed for seamless integration with Voice AI Agents.

## 🚀 Features

### Core CRM Functionality
- **Contact Management** - Full CRUD operations with advanced search and filtering
- **Company/Account Management** - Hierarchical company relationships with health scoring
- **Deal Pipeline** - Visual drag-and-drop pipeline with stage probability tracking
- **Activity Logging** - Comprehensive activity timeline with voice call integration
- **Support Tickets** - Priority-based ticket management with SLA tracking

### Voice AI Agent Integration
- **Secure API Authentication** - bcrypt-hashed API keys with scoped permissions
- **Real-time Call Logging** - Automatic activity creation from voice agent calls
- **Post-call Data Updates** - Seamless contact and deal updates after calls
- **Transcript Storage** - Voice call transcripts and recordings management
- **Audit Trail** - Complete logging of all voice agent actions

### Analytics & Reporting
- **KPI Dashboard** - Real-time performance metrics and insights
- **Voice Agent Analytics** - Call volume, duration, and outcome analysis
- **Conversion Tracking** - Lead-to-customer conversion funnel analysis
- **Custom Reports** - Flexible reporting with data export capabilities

## 🛠 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **UI**: TailwindCSS + shadcn/ui components
- **Authentication**: NextAuth.js or Clerk (configurable)
- **API**: RESTful endpoints with Zod validation
- **Security**: bcryptjs, JWT tokens, API key management
- **Deployment**: DigitalOcean App Platform ready

## 📁 Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── contacts/           # Contact management pages
│   │   ├── companies/          # Company management pages
│   │   ├── deals/              # Deal pipeline pages
│   │   ├── activities/         # Activity timeline pages
│   │   ├── tickets/            # Support ticket pages
│   │   ├── settings/           # Settings and API key management
│   │   └── analytics/          # Analytics dashboard
│   ├── api/
│   │   ├── contacts/           # Contact CRUD endpoints
│   │   ├── companies/          # Company CRUD endpoints
│   │   ├── deals/              # Deal CRUD endpoints
│   │   ├── activities/         # Activity CRUD endpoints
│   │   ├── tickets/            # Ticket CRUD endpoints
│   │   ├── agent/              # Voice Agent Integration APIs
│   │   ├── admin/              # Admin API endpoints
│   │   └── analytics/          # Analytics API endpoints
│   └── globals.css
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── contacts/               # Contact-specific components
│   ├── companies/              # Company-specific components
│   ├── deals/                  # Deal-specific components
│   ├── activities/             # Activity-specific components
│   ├── tickets/                # Ticket-specific components
│   ├── analytics/              # Analytics components
│   └── shared/                 # Shared components
├── lib/
│   ├── db.ts                   # Prisma client
│   ├── auth.ts                 # Authentication utilities
│   ├── api-key.ts              # API key utilities
│   ├── validations.ts          # Zod schemas
│   └── utils.ts                # Utility functions
└── types/                      # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agent-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database URL and other configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/agent_crm"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   API_KEY_SECRET="your-api-key-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # (Optional) Seed the database
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following main entities:

- **Contact** - Customer contact information with consent tracking
- **Company** - Account management with health scoring
- **Deal** - Sales pipeline with stage tracking
- **Activity** - Activity logging with voice agent integration
- **Ticket** - Support ticket management
- **ApiKey** - Secure API key management for voice agents
- **AuditLog** - Comprehensive audit trail
- **Consent** - GDPR compliance tracking

## 🔌 Voice Agent Integration APIs

### Authentication
All voice agent endpoints require API key authentication:
```
Authorization: Bearer va_your_api_key_here
```

### Key Endpoints

#### Contact Lookup
```http
POST /api/agent/lookup-contact
Content-Type: application/json

{
  "phone": "+1234567890",
  "email": "contact@example.com"
}
```

#### Log Voice Call
```http
POST /api/agent/log-call
Content-Type: application/json

{
  "contactId": "contact_id",
  "duration": 300,
  "summary": "Call summary",
  "transcript": "Call transcript",
  "outcome": "qualified"
}
```

#### Update Contact Post-call
```http
PUT /api/agent/update-contact
Content-Type: application/json

{
  "contactId": "contact_id",
  "status": "PROSPECT",
  "tags": ["interested", "follow-up-needed"]
}
```

#### Create Support Ticket
```http
POST /api/agent/create-ticket
Content-Type: application/json

{
  "contactId": "contact_id",
  "subject": "Technical Issue",
  "priority": "HIGH",
  "voiceSummary": "Customer experiencing login issues"
}
```

## 🛡 Security Features

- **API Key Authentication** - Secure, scoped API keys with bcrypt hashing
- **Input Validation** - Comprehensive Zod schema validation
- **Rate Limiting** - Protection against abuse
- **Audit Logging** - Complete action tracking
- **GDPR Compliance** - Consent management and data privacy controls

## 📈 Analytics Dashboard

Monitor key performance indicators including:

- Contact conversion rates
- Deal pipeline velocity
- Voice agent call metrics
- Support ticket resolution times
- Customer satisfaction scores

## 🚀 Deployment

### DigitalOcean App Platform

1. Fork this repository
2. Connect your DigitalOcean account
3. Create a new App and connect your repository
4. Configure environment variables
5. Set up a PostgreSQL database add-on
6. Deploy!

### Docker Deployment

```bash
# Build the Docker image
docker build -t agent-crm .

# Run the container
docker run -p 3000:3000 --env-file .env agent-crm
```

## 📝 API Documentation

Visit `/api-docs` when running the application for interactive API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Agent CRM** - Empowering businesses with intelligent customer relationship management and voice AI integration.