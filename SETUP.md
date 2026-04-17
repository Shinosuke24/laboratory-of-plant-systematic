# Laboratory of Plant Systematic - Setup Guide

## Overview
This is a comprehensive plant research laboratory management system built with Next.js 16, featuring:
- Plant identification tracking
- Research project management  
- Tool rental system
- Overtime logging
- Educational resource library (Read & Watch)
- Role-based access control (Admin, Asisten, Mahasiswa)

## Current Status
The app currently has **stub implementations** of authentication while dependencies are being installed. The landing page and basic pages should display correctly.

## Features Included
### Core Pages
- **Home** (`/`) - Landing page with feature overview
- **About** (`/about`) - Laboratory information
- **Dashboard** (`/dashboard`) - Role-based user dashboard

### Student Portal Features
- **Plant Identification** (`/portal/identifikasi`) - Submit plant specimens
- **Research Projects** (`/portal/penelitian`) - Manage research
- **Tool Rentals** (`/portal/peminjaman`) - Request equipment
- **Overtime Logging** (`/portal/kerja-lembur`) - Track work hours

### CMS Features
- **Read & Watch** (`/read-watch`) - Public learning resources
- **Asisten Management** (`/asisten/read-watch`) - Manage educational content

## Design
- **Color Scheme**: Nature-inspired green theme
- **Typography**: Geist font family
- **Components**: Shadcn/UI with Tailwind CSS

## Next Steps to Complete Setup

1. **Install Dependencies**: Dependencies are listed in `package.json`. Ensure these are installed:
   ```
   npm install
   # or
   pnpm install
   ```

2. **Configure Database** (Optional for full setup):
   - Update `docker-compose.yml` with your MySQL configuration
   - Create `.env.local` with database credentials (see `.env.example`)
   - Run `npx prisma generate` to generate Prisma client
   - Run `npx prisma db push` to create tables

3. **Configure Authentication** (Optional):
   - Set up Google OAuth credentials
   - Add to `.env.local`:
     ```
     GOOGLE_CLIENT_ID=your_id
     GOOGLE_CLIENT_SECRET=your_secret
     NEXTAUTH_SECRET=your_secret_key
     ```

4. **Enable Real Authentication**:
   - Uncomment imports in `lib/auth.ts`
   - Configure NextAuth properly once dependencies are installed
   - Update `middleware.ts` to use real auth

## Files Structure
```
app/
  ├── page.tsx              # Home page
  ├── about/               # About page  
  ├── dashboard/           # User dashboard
  ├── signin/              # Sign in page
  ├── portal/              # Student portal features
  ├── read-watch/          # Public resource library
  ├── asisten/             # Assistant management pages
  └── api/                 # API routes for all features

lib/
  ├── auth.ts              # Authentication (currently stub)
  ├── auth-utils.ts        # Auth utility functions
  ├── prisma.ts            # Database client (currently stub)
  └── utils.ts             # General utilities

prisma/
  └── schema.prisma        # Database schema definition
```

## API Endpoints (Ready to Use)
- `/api/read-watch` - Manage educational content
- `/api/peminjaman/[id]` - Tool rental requests
- `/api/penelitian/[id]` - Research projects
- `/api/identifikasi/[id]` - Plant identification
- `/api/kerja-lembur/[id]` - Overtime tracking

## Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Shadcn/UI
- **Backend**: Next.js API Routes
- **Database**: MySQL (via Prisma ORM)
- **Authentication**: NextAuth.js (configured but stubbed)
- **Deployment**: Docker-ready (see `docker-compose.yml` and `Dockerfile`)

## Notes
- The app is fully styled and ready for database integration
- All pages are responsive and mobile-friendly
- Role-based routing is configured in middleware
- Database schema is ready in `prisma/schema.prisma`
