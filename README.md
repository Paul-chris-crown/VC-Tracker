# VC Tracker - Project Management Platform

A comprehensive project management platform built with Next.js 14, TypeScript, and modern web technologies. VC Tracker provides teams with powerful tools for project planning, task management, time tracking, and collaboration.

## 🚀 Features

### Core Capabilities
- **Multi-tenant Organizations** with role-based access control (Owner, Admin, Manager, Member, Viewer)
- **Project Management** with epics, tasks, subtasks, and labels
- **Kanban Board** with drag-and-drop task management
- **Time Tracking** with billable hours and rate management
- **Real-time Collaboration** with live updates and notifications
- **File Management** with UploadThing integration
- **Search** with PostgreSQL trigram indexing
- **Automations** with rule-based workflows
- **AI Assistants** for task breakdown and estimation

### Views & Interfaces
- **Portfolio View** - Organization-wide project overview
- **Board View** - Kanban-style task management
- **List View** - Table-based task organization
- **Calendar View** - Timeline-based project planning
- **Gantt View** - Project timeline visualization
- **Reports** - Analytics and insights
- **Admin Dashboard** - Organization management

### Authentication & Security
- **OAuth Integration** (Google, GitHub)
- **Email Magic Links** for passwordless authentication
- **Role-based Access Control** with granular permissions
- **Row-level Security** on all data operations

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **Lucide React** for icons

### Backend & Database
- **Prisma** as ORM
- **PostgreSQL** as primary database
- **NextAuth.js** for authentication
- **Zod** for validation

### Real-time & Integrations
- **Pusher** for real-time features
- **UploadThing** for file uploads
- **TanStack Query** for data fetching
- **TanStack Table** for data tables

### Development Tools
- **ESLint** for code linting
- **Prettier** for code formatting
- **Vitest** for unit testing
- **Playwright** for E2E testing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vc-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/vc_tracker"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   
   # Email (for magic links)
   RESEND_API_KEY="your-resend-api-key"
   EMAIL_FROM="noreply@yourdomain.com"
   
   # UploadThing
   UPLOADTHING_SECRET="your-uploadthing-secret"
   UPLOADTHING_APP_ID="your-uploadthing-app-id"
   
   # Pusher (for realtime)
   PUSHER_APP_ID="your-pusher-app-id"
   PUSHER_KEY="your-pusher-key"
   PUSHER_SECRET="your-pusher-secret"
   PUSHER_CLUSTER="your-pusher-cluster"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Or run migrations
   npm run db:migrate
   ```

5. **Seed the database with demo data**
   ```bash
   npm run db:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test UI
```bash
npm run test:ui
```

## 📊 Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users** - Application users with authentication
- **Organizations** - Multi-tenant organizations
- **Memberships** - User roles within organizations
- **Projects** - Project containers with metadata
- **Epics** - Project epics for grouping tasks
- **Tasks** - Individual work items with status, priority, assignees
- **Comments** - Task discussions and feedback
- **Time Entries** - Time tracking with billable rates
- **Labels** - Task categorization
- **Files** - File attachments
- **Activities** - Audit trail and notifications
- **Invites** - User invitation system

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Database Setup

For production, use a managed PostgreSQL service:
- **Neon** (recommended)
- **Supabase**
- **Railway**
- **PlanetScale**

### Environment Variables for Production

Ensure all required environment variables are set in your deployment platform:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"
# ... other variables
```

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema changes
npm run db:migrate      # Run migrations
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed with demo data
npm run db:reset        # Reset database

# Testing
npm run test            # Run unit tests
npm run test:ui         # Run tests with UI
npm run test:e2e        # Run E2E tests

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
npm run format          # Format code with Prettier
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (app)/             # Protected app pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── app/               # App-specific components
│   └── providers/         # Context providers
├── lib/                    # Library configurations
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # Prisma client
│   ├── pusher.ts          # Pusher config
│   ├── uploadthing.ts     # UploadThing config
│   └── validations.ts     # Zod schemas
├── types/                  # TypeScript types
├── utils/                  # Utility functions
└── hooks/                  # Custom React hooks
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation

## 🎯 Roadmap

- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Advanced automations
- [ ] Third-party integrations (Slack, GitHub, etc.)
- [ ] Advanced search with Elasticsearch
- [ ] Multi-language support
- [ ] Advanced permissions system
- [ ] API for third-party integrations

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
# VC-Tracker
# VC-Tracker
# VC-Tracker
