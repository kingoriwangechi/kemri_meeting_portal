# Environment Variables for KEMRI Meeting Portal

This document lists all the required environment variables for the KEMRI Meeting Portal application.

## Required for Production Deployment

| Variable Name     | Description                                             | Required              | Default                                |
| ----------------- | ------------------------------------------------------- | --------------------- | -------------------------------------- |
| `MONGODB_URI`     | MongoDB connection string                               | Yes (for DB features) | None (falls back to in-memory storage) |
| `NEXTAUTH_SECRET` | Secret used for JWT encryption                          | Yes                   | None                                   |
| `NEXTAUTH_URL`    | Full URL of your application (e.g. https://example.com) | Yes                   | None                                   |

## Authentication Providers

### Google OAuth (Optional)

| Variable Name   | Description                | Required                                              |
| --------------- | -------------------------- | ----------------------------------------------------- |
| `GOOGLE_ID`     | Google OAuth Client ID     | No (If not provided, Google sign-in will be disabled) |
| `GOOGLE_SECRET` | Google OAuth Client Secret | No                                                    |

### Microsoft Azure AD (Optional)

| Variable Name            | Description            | Required                                                 |
| ------------------------ | ---------------------- | -------------------------------------------------------- |
| `AZURE_AD_CLIENT_ID`     | Azure AD Client ID     | No (If not provided, Microsoft sign-in will be disabled) |
| `AZURE_AD_CLIENT_SECRET` | Azure AD Client Secret | No                                                       |
| `AZURE_AD_TENANT_ID`     | Azure AD Tenant ID     | No                                                       |

## Email Functionality (Optional)

| Variable Name    | Description                       | Required |
| ---------------- | --------------------------------- | -------- |
| `EMAIL_SERVER`   | SMTP server (e.g. smtp.gmail.com) | No       |
| `EMAIL_PORT`     | SMTP port (usually 587 or 465)    | No       |
| `EMAIL_USERNAME` | SMTP username                     | No       |
| `EMAIL_PASSWORD` | SMTP password or app password     | No       |
| `EMAIL_FROM`     | Sender email address              | No       |

## Zoom API Integration (Optional)

| Variable Name     | Description     | Required |
| ----------------- | --------------- | -------- |
| `ZOOM_API_KEY`    | Zoom API Key    | No       |
| `ZOOM_API_SECRET` | Zoom API Secret | No       |

## Setup Instructions

1. Create a `.env.local` file in the root of the project
2. Add the required environment variables in the format `VARIABLE_NAME=value`
3. For production deployment, configure these variables in your hosting platform (e.g. Vercel)

Example `.env.local`:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NEXTAUTH_SECRET=your-secret-key-at-least-32-chars-long
NEXTAUTH_URL=http://localhost:3000
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
```
