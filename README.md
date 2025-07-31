# KEMRI Meeting Portal

The Kenya Medical Research Institute (KEMRI) Meeting Portal is a web-based application designed to streamline the scheduling, management, and coordination of meetings for KEMRI staff and external collaborators. This centralized platform enhances communication, reduces administrative overhead, and provides seamless integration with popular video conferencing platforms.

## Features

### User Authentication & Authorization

- Multiple sign-in options:
  - Google OAuth
  - Credentials (email/password)
  - Microsoft OAuth (in progress)
- Role-based access control
- Secure authentication flow using NextAuth.js

### Meeting Management

- Creation, editing, and cancellation of meetings
- Option for open (public) or restricted (invitation-only) meetings
- Automated meeting link generation for Zoom and Microsoft Teams
- Calendar integration and scheduling tools
- Integration with Zoom API (Microsoft Teams coming soon)

### Communication Features

- Automated email notifications for meeting invites via SendGrid
- Reminder system for upcoming meetings
- Direct messaging for meeting participants (in progress)

### Reporting & Analytics (Planned)

- Meeting attendance tracking
- Usage reports and statistics
- Meeting history and archives
- Responsive UI with KEMRI branding

## Technology Stack

- **Frontend**: Next.js with React, Tailwind CSS for responsive UI
- **Backend**: Next.js API routes with server-side processing
- **Authentication**: NextAuth.js with multiple provider support
- **Storage**: JSON file storage (development), scalable to database solutions
- **Email Notifications**: SendGrid email API
- **Video Conferencing**: Integration with Zoom and Microsoft Teams APIs
- **Deployment**: Vercel (proposed)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Zoom API key and secret
- SendGrid API key
- Google OAuth credentials
- Microsoft OAuth credentials (for Microsoft authentication)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret

# Microsoft OAuth - Required for future implementation
AZURE_AD_CLIENT_ID=your-microsoft-client-id
AZURE_AD_CLIENT_SECRET=your-microsoft-client-secret
AZURE_AD_TENANT_ID=your-microsoft-tenant-id

# Zoom API
ZOOM_API_KEY=your-zoom-api-key
ZOOM_API_SECRET=your-zoom-api-secret
ZOOM_HOST_EMAIL=your-zoom-account-email

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=your-sender-email
```

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/kemri-meeting-portal.git
cd kemri-meeting-portal

# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Timeline & Implementation Status

### Phase 1: Core Development

- [x] Setup development environment
- [x] Implement basic authentication system (Google, Credentials)
- [x] Develop basic meeting management functionality
- [x] Create responsive UI design with KEMRI branding
- [ ] Complete Microsoft OAuth integration
- [ ] Implement role-based access control

### Phase 2: Integration & Enhancement

- [x] Basic Zoom API integration
- [ ] Microsoft Teams integration
- [ ] Implement comprehensive email notification system
- [ ] Add recurring meeting support
- [ ] Implement meeting edit functionality
- [ ] Develop reporting and analytics features
- [ ] Add direct messaging for meeting participants
- [ ] User acceptance testing

### Phase 3: Deployment & Training

- [ ] Production deployment setup
- [ ] Migration to database storage solution
- [ ] User training and documentation
- [ ] System monitoring and optimization
- [ ] Security audits and enhancements

## Target Audience

- KEMRI administrators and managers
- Research staff and scientists
- External collaborators and partners
- Administrative assistants and coordinators

## Success Criteria

- 90% reduction in manual meeting scheduling time
- Elimination of scheduling conflicts and double-bookings
- 100% uptime for critical meeting management functions
- Positive user feedback (>85% satisfaction rate)
- Successful integration with existing workflows

## Deployment

This application is configured for deployment on Vercel. For detailed deployment instructions, see the [deployment checklist](./docs/deployment_checklist.md).

### Quick Deployment

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy the application:

```bash
vercel
```

4. For production deployment:

```bash
vercel --prod
```

### Environment Variables

Make sure to set up all required environment variables on your deployment platform. See `.env.production.example` for a list of required variables.

## License

[MIT](LICENSE)
