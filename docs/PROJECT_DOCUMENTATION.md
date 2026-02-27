# KEMRI Meeting Portal - Complete Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Configuration](#configuration)
6. [Architecture](#architecture)
7. [API Documentation](#api-documentation)
8. [Authentication](#authentication)
9. [Meeting Management](#meeting-management)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

The **KEMRI Meeting Portal** is a modern web application for managing meetings, scheduling video calls, and coordinating with team members. It supports multiple meeting platforms (Zoom and Microsoft Teams) with automatic meeting link generation.

### Key Objectives

- Centralized meeting management
- Multi-platform support (Zoom, Microsoft Teams)
- Role-based access control
- Email notifications for attendees
- Calendar integration capabilities
- User-friendly interface

### Version

- Current Version: 0.1.0
- Last Updated: February 27, 2026

---

## Features

### Core Features

- ✅ **User Authentication**
  - Google OAuth login
  - Microsoft Azure AD login
  - Credentials-based authentication (fallback)
  - Secure session management

- ✅ **Meeting Management**
  - Create meetings with title, description, date, time
  - Support for multiple meeting types (Internal, External, Research, Training)
  - Automatic Zoom meeting generation with join links
  - Microsoft Teams meeting link support (manual or auto-generated)
  - Edit and update existing meetings
  - Delete meetings

- ✅ **Access Control**
  - Restrict meetings to invited attendees only
  - Email invitations for attendees
  - Public/Private meeting modes

- ✅ **Calendar Integration**
  - View meetings in calendar format
  - Upcoming meetings dashboard
  - Meeting status tracking

- ✅ **User Profile**
  - View and edit profile information
  - Authentication provider display
  - Profile picture support

---

## Technology Stack

### Frontend

- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns
- **HTTP Client**: Fetch API

### Backend

- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Authentication**: NextAuth.js 4
- **Database**: MongoDB (with JSON file fallback)
- **ORM**: Mongoose

### External Services

- **Zoom API** - Meeting creation and management
- **Microsoft Graph API** - Teams meetings, calendar events
- **SendGrid** - Email notifications
- **Azure AD** - Enterprise authentication
- **Google OAuth** - Consumer authentication

### DevTools

- **Package Manager**: npm/pnpm
- **Build Tool**: Next.js
- **Linting**: ESLint
- **CSS**: PostCSS

---

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or pnpm
- Git
- Environment variables configured

### Installation Steps

1. **Clone Repository**

```bash
git clone <repository-url>
cd kemri_meeting_portal
```

2. **Install Dependencies**

```bash
npm install
# or
pnpm install
```

3. **Configure Environment Variables**
   Create `.env.local` file:

```bash
cp .env.example .env.local
```

4. **Start Development Server**

```bash
npm run dev
# or
pnpm run dev
```

Server runs on `http://localhost:3001` (if port 3000 is in use)

5. **Build for Production**

```bash
npm run build
npm start
```

---

## Configuration

### Environment Variables

#### Authentication

```env
NEXTAUTH_SECRET=<random-secret-key>
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_URL_INTERNAL=http://localhost:3001
```

#### Google OAuth

```env
GOOGLE_ID=<google-client-id>
GOOGLE_SECRET=<google-client-secret>
```

#### Microsoft Azure AD

```env
AZURE_AD_CLIENT_ID=<azure-app-id>
AZURE_AD_CLIENT_SECRET=<azure-client-secret>
AZURE_AD_TENANT_ID=<azure-tenant-id>
```

#### Zoom API

```env
ZOOM_API_KEY=<zoom-api-key>
ZOOM_API_SECRET=<zoom-api-secret>
ZOOM_ACCOUNT_ID=<zoom-account-id>
```

#### Email (SendGrid)

```env
SENDGRID_API_KEY=<sendgrid-api-key>
```

#### Database

```env
MONGODB_URI=mongodb://localhost:27017/kemri_portal
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kemri_portal
```

### Setting Up OAuth Providers

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URI: `http://localhost:3001/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

#### Microsoft Azure AD Setup

1. Go to [Azure Portal](https://portal.azure.com)
2. Create App Registration
3. Add redirect URI: `http://localhost:3001/api/auth/callback/azure-ad`
4. Create client secret
5. Grant `OnlineMeetings.ReadWrite` permission
6. Copy values to `.env.local`

#### Zoom Setup

1. Go to [Zoom App Marketplace](https://marketplace.zoom.us)
2. Create JWT application
3. Generate credentials
4. Copy to `.env.local`

---

## Architecture

### Project Structure

```
kemri_meeting_portal/
├── src/
│   ├── app/
│   │   ├── auth/               # Authentication pages
│   │   │   ├── signin/         # Sign-in page
│   │   │   ├── error/          # Auth error page
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # NextAuth routes
│   │   │   ├── meetings/       # Meeting CRUD endpoints
│   │   │   ├── graph/          # Microsoft Graph endpoints
│   │   │   ├── auth-debug/     # Debug endpoint
│   │   ├── dashboard/          # Main dashboard
│   │   ├── profile/            # User profile
│   │   ├── layout.js           # Root layout
│   │   ├── page.js             # Home page
│   ├── components/             # React components
│   │   ├── MeetingForm.js      # Create/edit meeting form
│   │   ├── MeetingList.js      # List meetings
│   │   ├── MeetingDetails.js   # Meeting details modal
│   │   ├── SessionProvider.js  # NextAuth provider
│   ├── lib/                    # Utility functions
│   │   ├── mongodb.js          # MongoDB connection
│   │   ├── storage.js          # Data storage (file/DB)
│   │   ├── email.js            # Email sending
│   │   ├── zoom.js             # Zoom API client
│   │   ├── graph-app-only.js   # Microsoft Graph (app-only)
│   │   ├── models/             # Data models
│   ├── middleware.js           # Auth middleware
├── public/                     # Static assets
├── docs/                       # Documentation
├── build/                      # Production build
├── .env.local                  # Environment variables
├── package.json
└── next.config.mjs
```

### Data Flow

```
User Browser
    ↓
Next.js Frontend (React)
    ↓
NextAuth.js (Authentication)
    ↓
API Routes (/api/*)
    ├→ OAuth Providers (Google, Azure AD)
    ├→ Zoom API
    ├→ Microsoft Graph API
    ├→ MongoDB/JSON Storage
    └→ SendGrid (Email)
```

---

## API Documentation

### Base URL

```
http://localhost:3001/api
```

### Authentication Endpoints

#### POST /api/auth/signin

Sign in with credentials

### Meeting Endpoints

#### GET /api/meetings

**Description**: Get all meetings for the current user
**Auth**: Required
**Response**:

```json
[
	{
		"id": "uuid",
		"title": "Team Meeting",
		"description": "Weekly sync",
		"dateTime": "2026-02-28T10:00:00Z",
		"type": "internal",
		"platform": "zoom",
		"attendees": ["user@example.com"],
		"meetingLink": "https://zoom.us/j/...",
		"organizer": "organizer@kemri.go.ke",
		"status": "scheduled",
		"createdAt": "2026-02-27T18:00:00Z"
	}
]
```

#### POST /api/meetings

**Description**: Create a new meeting
**Auth**: Required
**Request Body**:

```json
{
	"title": "Team Meeting",
	"description": "Weekly sync",
	"dateTime": "2026-02-28T10:00:00Z",
	"type": "internal",
	"platform": "zoom",
	"attendees": ["user@example.com"],
	"meetingLink": "https://zoom.us/j/...",
	"isRestrictive": true
}
```

**Response**: Created meeting object (201)

#### GET /api/meetings/:id

**Description**: Get specific meeting details
**Auth**: Required

#### PUT /api/meetings/:id

**Description**: Update meeting
**Auth**: Required

#### DELETE /api/meetings/:id

**Description**: Delete meeting
**Auth**: Required

### Graph API Endpoints

#### GET /api/graph/online-meetings

**Description**: Get Teams meetings
**Auth**: Required (Teams token)

#### POST /api/graph/online-meetings

**Description**: Create Teams meeting
**Auth**: Required (Teams token)
**Request Body**:

```json
{
	"subject": "Team Meeting",
	"startDateTime": "2026-02-28T10:00:00Z",
	"endDateTime": "2026-02-28T11:00:00Z",
	"attendees": ["user@example.com"]
}
```

---

## Authentication

### NextAuth.js Configuration

**Providers Configured**:

1. **Google OAuth** - Consumer authentication
2. **Azure AD** - Enterprise/organizational authentication
3. **Credentials** - Email/password fallback

### Session Management

- **Strategy**: JWT (JSON Web Tokens)
- **Max Age**: 30 days
- **Update Age**: 24 hours
- **Secure Cookies**: Enabled in production

### Protected Routes

Routes requiring authentication:

- `/dashboard` - Main dashboard
- `/profile` - User profile
- `/api/meetings` - All meeting endpoints

Public routes:

- `/` - Home page
- `/auth/signin` - Sign-in page
- `/auth/error` - Error page

---

## Meeting Management

### Creating a Meeting

1. **Navigate to Dashboard** (`/dashboard`)
2. **Click "Create New Meeting"**
3. **Fill in Details**:
   - Title\*
   - Description
   - Date & Time\*
   - Meeting Type (Internal, External, Research, Training)
   - Platform (Zoom, Microsoft Teams)
   - Meeting Link (auto-generated for Zoom, optional for Teams)
   - Restrict Access (Invite-only)
4. **Click "Create Meeting"**

### Zoom Meetings

- ✅ Link auto-generates automatically
- ✅ Invitation sent to attendees (if restrictive)
- ✅ Full metadata stored

### Teams Meetings

- ⚠️ Auto-generation requires proper Azure AD permissions
- ✅ Can manually add Teams meeting link
- ✅ Link field is editable

### Editing Meetings

1. Click meeting in calendar or list
2. Click "Edit" button
3. Modify details
4. Click "Update Meeting"

### Deleting Meetings

1. Select meeting
2. Click "Delete"
3. Confirm deletion
4. Meeting and associated links removed

---

## Deployment

### Vercel Deployment

1. **Push to GitHub**

```bash
git push origin main
```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Select GitHub repository
   - Configure environment variables

3. **Set Environment Variables in Vercel**
   - Add all `.env.local` variables
   - Review in "Settings" > "Environment Variables"

4. **Deploy**
   - Vercel auto-deploys on git push
   - Or manually click "Deploy" in dashboard

### Production Environment Variables

```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<strong-random-secret>
NODE_ENV=production
# ... other variables
```

### Database for Production

- Use MongoDB Atlas (cloud)
- Set `MONGODB_URI` to your Atlas connection string

### Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] NEXTAUTH_URL set to production domain
- [ ] Database (MongoDB) accessible
- [ ] OAuth providers configured for production URL
- [ ] Zoom API credentials valid
- [ ] SendGrid API key valid
- [ ] SSL certificate configured
- [ ] Build succeeds locally (`npm run build`)

---

## Troubleshooting

### Authentication Issues

**Issue**: "Permission denied. Your Azure AD app needs 'OnlineMeetings.ReadWrite' permission"

**Solution**:

1. Go to Azure Portal
2. Find your app registration
3. Click "API Permissions"
4. Add `OnlineMeetings.ReadWrite` permission
5. Grant admin consent
6. Sign out and sign back in

---

**Issue**: Microsoft sign-in keeps redirecting to signin page

**Solutions**:

1. Check `NEXTAUTH_URL_INTERNAL` matches your port
2. Verify redirect URIs in Azure AD match exactly
3. Clear browser cookies completely
4. Try in incognito/private window
5. Check `NEXTAUTH_SECRET` is set

---

**Issue**: "Invalid client secret provided"

**Solution**:

1. The client secret may have expired
2. Go to Azure Portal → App Registration
3. Create a new client secret
4. Copy the VALUE (not the ID)
5. Update `.env.local`
6. Restart server

---

### Meeting Creation Issues

**Issue**: Teams meeting link fails to generate with error 403

**Solutions**:

1. User account may not have Teams license
2. Try manually adding Teams link instead
3. Check that `OnlineMeetings.ReadWrite` permission is granted
4. Sign out and back in to refresh tokens

---

**Issue**: Zoom meeting creation fails

**Solutions**:

1. Verify Zoom API credentials in `.env.local`
2. Check Zoom API key/secret aren't expired
3. Verify account has Zoom Pro or Business plan
4. Check API rate limits haven't been exceeded

---

### Database Issues

**Issue**: "Cannot connect to MongoDB"

**Solutions**:

1. Check MongoDB is running locally: `mongod`
2. Or use MongoDB Atlas connection string
3. Verify `MONGODB_URI` is correct
4. Check network connectivity
5. For Atlas, whitelist your IP address

---

**Issue**: "ENOENT: no such file or directory, open 'data/meetings.json'"

**Solution**:

- Directory will auto-create on first run
- Ensure write permissions on `data/` folder
- Or use MongoDB instead

---

### Performance Issues

**Issue**: Slow meeting creation with Teams

**Causes**:

- Network latency to Microsoft Graph API
- Trying to generate meeting links for every request
- Heavy database queries

**Solutions**:

- Allow manual Teams link entry (skip auto-generation)
- Use Zoom for frequently created meetings
- Monitor API quotas and rate limits

---

### Email Issues

**Issue**: Invitations not being sent to attendees

**Solutions**:

1. Verify `SENDGRID_API_KEY` is valid
2. Check sender email is authorized in SendGrid
3. Verify attendee emails are in `isRestrictive` mode
4. Check spam folder for emails
5. Review SendGrid dashboard for bounces

---

## Support & Contact

For issues or questions:

- Check existing documentation
- Review error messages carefully
- Check terminal logs for detailed errors
- Verify all environment variables are set
- Test with Google sign-in first (easier to debug)

---

## License

Proprietary - KEMRI Meeting Portal

## Last Updated

February 27, 2026
