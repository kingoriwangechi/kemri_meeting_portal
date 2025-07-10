This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# KEMRI Meeting Portal

A comprehensive web application for managing KEMRI meetings, featuring authentication, automated Zoom meeting creation, and email notifications.

## Features

- **Authentication**

  - Credentials-based authentication (email/password)
  - Support for Google and Microsoft OAuth (configurable)
  - Custom sign-in/sign-up interface with KEMRI branding

- **Meeting Management**

  - Create, view, and delete meetings
  - Automatic Zoom meeting creation with custom settings
  - Email notifications for meeting invitations
  - Meeting details storage and management

- **User Interface**
  - Modern, responsive design
  - KEMRI-branded theme
  - Intuitive dashboard for meeting management
  - Form validation and error handling

## Prerequisites

- Node.js 18 or later
- npm or yarn
- A Zoom Developer account
- A SendGrid account (for email notifications)

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kemri_meeting_portal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory with the following variables:

   ```bash
   # NextAuth Configuration
   NEXTAUTH_SECRET=your_generated_secret
   NEXTAUTH_URL=http://localhost:3001

   # SendGrid Configuration
   SENDGRID_API_KEY=your_sendgrid_api_key

   # Zoom API Configuration
   ZOOM_API_KEY=your_zoom_api_key
   ZOOM_API_SECRET=your_zoom_api_secret
   ZOOM_ACCOUNT_ID=your_zoom_account_id
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at http://localhost:3001

## Configuration

### Authentication

The portal currently uses credentials-based authentication. To enable OAuth providers:

1. Update the NextAuth configuration in `src/app/api/auth/[...nextauth]/route.js`
2. Add the corresponding provider credentials to `.env.local`

### Zoom Integration

1. Create a Zoom App in the [Zoom App Marketplace](https://marketplace.zoom.us/)
2. Generate Server-to-Server OAuth credentials
3. Add the credentials to `.env.local`

### Email Notifications

1. Set up a SendGrid account
2. Create an API key
3. Add the API key to `.env.local`
4. Customize email templates in `src/lib/email.js`

## Project Structure

```
kemri_meeting_portal/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── layout.js       # Root layout
│   │   └── page.js         # Landing page
│   ├── components/         # React components
│   ├── lib/               # Utility functions
│   │   ├── email.js       # Email functionality
│   │   ├── storage.js     # Meeting storage
│   │   └── zoom.js        # Zoom API integration
│   └── styles/            # CSS styles
├── public/               # Static assets
├── .env.local           # Environment variables
└── package.json         # Dependencies
```

## API Documentation

### Meeting Management

- `POST /api/meetings` - Create a new meeting
- `GET /api/meetings` - List all meetings
- `DELETE /api/meetings/:id` - Delete a meeting

### Authentication

- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signup` - Sign up (when using credentials)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary and confidential. All rights reserved.

## Support

For support, please contact the system administrator or raise an issue in the project repository.
