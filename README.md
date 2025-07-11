# KEMRI Meeting Portal

This project is a meeting management portal for the Kenya Medical Research Institute (KEMRI), built with Next.js, NextAuth.js, and integrated with Zoom API for meeting management and SendGrid for email notifications.

## Features

- User authentication via:
  - Google OAuth
  - Credentials (email/password)
  - Microsoft OAuth (in progress)
- Meeting management:
  - Create, view, and delete meetings
  - Integration with Zoom API
  - Email notifications for meeting invites
- Responsive UI with KEMRI branding

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Zoom API key and secret
- SendGrid API key
- Google OAuth credentials
- Microsoft OAuth credentials (for future implementation)

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

## TODO List

- [ ] **Microsoft Authentication Integration**:

  - Complete the Microsoft OAuth implementation
  - Test authentication flow
  - Add proper error handling for Microsoft auth
  - Update the UI to show Microsoft authentication status

- [ ] Enhanced meeting features:

  - Add recurring meeting support
  - Implement meeting edit functionality
  - Add Teams integration alongside Zoom

- [ ] Production deployment:
  - Set up proper database for storing user data
  - Configure proper email templates
  - Implement proper security measures

## License

[MIT](LICENSE)
