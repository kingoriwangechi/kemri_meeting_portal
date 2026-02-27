# KEMRI Meeting Portal - Quick Start & Developer Cheat Sheet

## Quick Start (5 minutes)

### Prerequisites Check

```bash
node --version          # Should be 18+
npm --version          # Or use pnpm
git --version
```

### Clone & Install

```bash
git clone <repo-url>
cd kemri_meeting_portal
npm install
```

### Environment Setup

```bash
# Copy template and edit
cp .env.example .env.local

# Minimal config for quick start:
NEXTAUTH_SECRET=any-random-string-here
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_URL_INTERNAL=http://localhost:3001
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
```

### Run Development Server

```bash
npm run dev
# Opens on http://localhost:3001
```

### Sign In

1. Click "Sign in with Google"
2. Choose your Google account
3. Approve permission request
4. Redirected to dashboard

### Create First Meeting

1. Go to Dashboard
2. Click "Create New Meeting"
3. Fill in title and future date
4. Select platform: Zoom
5. Click "Create"
6. See Zoom link auto-generated

---

## Environment Variables Cheat Sheet

### Required (All Environments)

```env
NEXTAUTH_SECRET=         # Generate: openssl rand -base64 32
NEXTAUTH_URL=            # http://localhost:3001 (dev)
NEXTAUTH_URL_INTERNAL=   # http://localhost:3001 (dev)
```

### OAuth Providers (At least one)

```env
# Google
GOOGLE_ID=
GOOGLE_SECRET=

# Microsoft Azure AD
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=
```

### Meeting APIs

```env
# Zoom (for auto-generating Zoom meetings)
ZOOM_API_KEY=
ZOOM_API_SECRET=
ZOOM_ACCOUNT_ID=

# SendGrid (for email invitations)
SENDGRID_API_KEY=
```

### Database (Optional)

```env
# Use MongoDB or file-based fallback
MONGODB_URI=mongodb://localhost:27017/kemri_portal
# Or: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kemri
```

---

## Common Commands

### Development

```bash
npm run dev              # Start dev server (port 3001)
npm run build           # Build for production
npm start               # Run production build locally
npm run lint            # Check code quality (ESLint)
```

### Database

```bash
# MongoDB (local)
mongod                  # Start MongoDB
mongo                   # Open MongoDB shell

# MongoDB (Atlas)
# Use connection string in MONGODB_URI
```

### Testing

```bash
npm test                # Run tests (if configured)
npm run test:watch     # Watch mode
```

---

## File Structure Quick Reference

| Path               | Purpose                             |
| ------------------ | ----------------------------------- |
| `/src/app/`        | Next.js routes (pages & API)        |
| `/src/app/api/`    | Backend API endpoints               |
| `/src/components/` | React components                    |
| `/src/lib/`        | Utilities & services                |
| `/.env.local`      | Environment variables (git ignored) |
| `/docs/`           | Documentation files                 |
| `/public/`         | Static assets                       |
| `/data/`           | Local JSON storage (dev)            |

---

## API Endpoints Quick Reference

### Authentication

```
GET  /auth/signin              # Sign-in page
GET  /api/auth/callback/:prov  # OAuth callback
GET  /api/auth/signout         # Sign out
GET  /api/auth/session         # Get session
```

### Meetings

```
GET    /api/meetings           # List meetings
POST   /api/meetings           # Create meeting
GET    /api/meetings/:id       # Get details
PUT    /api/meetings/:id       # Update
DELETE /api/meetings/:id       # Delete
```

### Microsoft Graph (Helper)

```
GET  /api/graph/online-meetings     # List Teams meetings
POST /api/graph/online-meetings     # Create Teams meeting
```

---

## Creating an API Request (from browser console)

### Get All Meetings

```javascript
fetch("/api/meetings", {
	credentials: "include",
	headers: { "Content-Type": "application/json" },
})
	.then((r) => r.json())
	.then((d) => console.log(d));
```

### Create Meeting

```javascript
const meeting = {
	title: "Team Meeting",
	dateTime: new Date(Date.now() + 86400000).toISOString(),
	platform: "zoom",
	type: "internal",
};

fetch("/api/meetings", {
	method: "POST",
	credentials: "include",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(meeting),
})
	.then((r) => r.json())
	.then((d) => console.log(d));
```

### Delete Meeting

```javascript
const id = "550e8400-e29b-41d4-a716-446655440000";

fetch(`/api/meetings/${id}`, {
	method: "DELETE",
	credentials: "include",
})
	.then((r) => r.json())
	.then((d) => console.log("Deleted:", d));
```

---

## Debugging Tips

### Enable Console Logging

```javascript
// Add to any API route to see what's happening
console.log("Request body:", body);
console.log("User:", session.user);
console.log("Response:", result);
```

### Watch Terminal Output

```bash
npm run dev
# Watch for:
# - "POST /api/meetings" -> shows request
# - Console logs from routes
# - Build errors
# - Warnings
```

### Browser DevTools

```
F12                     # Open DevTools
Ctrl+Shift+K            # Open console
Ctrl+Shift+I            # Elements tab
Ctrl+Shift+E            # Network tab
Ctrl+Shift+C            # Inspector tool
```

**Network Tab Tips**:

- Filter: "fetch/xhr" shows API calls
- Click request to see payload and response
- Check "Response" for JSON data
- Check "Headers" for auth tokens

### Session/Auth Debugging

```javascript
// Check current session
fetch("/api/auth/session")
	.then((r) => r.json())
	.then((d) => console.log("Session:", d));

// List all cookies
console.log(document.cookie);

// Clear cookies and refresh
document.cookie.split(";").forEach((c) => {
	const name = c.split("=")[0].trim();
	document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC`;
});
location.reload();
```

---

## Setting Up OAuth Providers

### Google OAuth (5 minutes)

1. **Go to Google Cloud Console**
   - https://console.cloud.google.com
   - Sign in with Google account

2. **Create Project**
   - Click project dropdown
   - Click "New Project"
   - Name: "KEMRI Meeting Portal"
   - Click "Create"

3. **Enable Google+ API**
   - Search: "Google+ API"
   - Click result
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "Credentials" (left menu)
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add Authorized Redirect URIs:
     - `http://localhost:3001/api/auth/callback/google`
   - Click "Create"
   - Copy Client ID and Secret
   - Paste into `.env.local`:
     ```env
     GOOGLE_ID=xxx
     GOOGLE_SECRET=yyy
     ```

5. **Restart Dev Server**
   ```bash
   npm run dev
   ```

### Microsoft Azure AD (10 minutes)

1. **Go to Azure Portal**
   - https://portal.azure.com
   - Sign in with Microsoft account

2. **Register Application**
   - Search: "App registrations"
   - Click "New registration"
   - Name: "KEMRI Meeting Portal"
   - Supported account types: "Accounts in this org only"
   - Redirect URI: Web → `http://localhost:3001/api/auth/callback/azure-ad`
   - Click "Register"

3. **Create Client Secret**
   - Go to "Certificates & secrets"
   - Click "New client secret"
   - Description: "Dev key"
   - Expires: "2 years"
   - Click "Add"
   - **Copy VALUE immediately** (copy button)
   - Paste into `.env.local`:
     ```env
     AZURE_AD_CLIENT_SECRET=yyy
     ```

4. **Grant Permissions**
   - Click "API permissions"
   - Click "Add a permission"
   - Select "Microsoft Graph"
   - Select "Application permissions"
   - Search: "OnlineMeetings"
   - Check "OnlineMeetings.ReadWrite"
   - Click "Add permissions"
   - Click "Grant admin consent"
   - Wait for green checkmark

5. **Get IDs from Overview**
   - Copy (Application/Client) ID:
     ```env
     AZURE_AD_CLIENT_ID=xxx
     ```
   - Copy Directory (Tenant) ID:
     ```env
     AZURE_AD_TENANT_ID=zzz
     ```

6. **Restart Dev Server**
   ```bash
   npm run dev
   ```

---

## Zoom API Setup (10 minutes)

1. **Go to Zoom Marketplace**
   - https://marketplace.zoom.us
   - Sign in with Zoom account (create if needed)

2. **Create JWT Application**
   - Click "Develop" (top right)
   - Click "Build" → "Create" → "Server-to-Server OAuth"
   - Or find "JWT" app type (older)
   - Name: "KEMRI Meeting Portal"
   - Company: Your company
   - Click "Create"

3. **Copy Credentials**
   - Go to "App Credentials" tab
   - Copy Account ID (or Client ID):
     ```env
     ZOOM_ACCOUNT_ID=xxx
     ```
   - Copy Client ID:
     ```env
     ZOOM_API_KEY=yyy
     ```
   - Copy Client Secret:
     ```env
     ZOOM_API_SECRET=zzz
     ```

4. **Copy Credentials to `.env.local`**

5. **Restart Dev Server**
   ```bash
   npm run dev
   ```

---

## Deployment Checklist

- [ ] `.env.local` has all required variables
- [ ] `.env.local` is in `.gitignore` (don't commit)
- [ ] Database configured (MongoDB Atlas)
- [ ] OAuth providers configured for production URL
- [ ] `NEXTAUTH_URL` set to production domain
- [ ] `NEXTAUTH_SECRET` is strong (32+ chars)
- [ ] Zoom API credentials valid
- [ ] SendGrid API key valid
- [ ] Build succeeds locally: `npm run build`
- [ ] No console errors in browser (F12)
- [ ] Test sign-in with all providers
- [ ] Test creating Zoom and Teams meetings
- [ ] SSL certificate configured
- [ ] Database backups configured

---

## Useful Links

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph)
- [Zoom API Docs](https://developers.zoom.us/docs)
- [SendGrid API](https://docs.sendgrid.com)

### Services

- [Google Cloud Console](https://console.cloud.google.com)
- [Azure Portal](https://portal.azure.com)
- [Zoom Marketplace](https://marketplace.zoom.us)
- [SendGrid Dashboard](https://app.sendgrid.com)
- [MongoDB Atlas](https://account.mongodb.com)
- [Vercel Dashboard](https://vercel.com)

### Useful Commands

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Check if port is in use
lsof -i :3001              # Mac/Linux
netstat -ano | grep 3001   # Windows

# Kill process on port
kill -9 <PID>              # Mac/Linux
taskkill /PID <PID> /F     # Windows

# Clear npm cache
npm cache clean --force

# Update npm
npm install -g npm@latest
```

---

## Common Modifications

### Change Port

```bash
PORT=3000 npm run dev
```

### Enable/Disable Providers

In `/src/app/api/auth/[...nextauth]/route.js`:

```javascript
providers: [
	// GoogleProvider({ ... }),    // Comment out to disable
	// AzureADProvider({ ... }),   // Comment out to disable
	// CredentialsProvider({ ... })
];
```

### Add New Provider

```javascript
// In providers array
StupidCredentialsProvider({
	id: "custom-provider",
	name: "Custom Auth",
	// ... provider config
});
```

### Change Session Duration

In `/src/app/api/auth/[...nextauth]/route.js`:

```javascript
callbacks: {
  jwt({ token }) {
    // Adjust exp: (30 * 24 * 60 * 60) = 30 days
    // Change to: (7 * 24 * 60 * 60) = 7 days
    token.exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
    return token;
  }
}
```

---

## Performance Benchmarks

| Operation             | Target | Typical |
| --------------------- | ------ | ------- |
| Page load (dashboard) | <2s    | 1.2s    |
| List meetings         | <1s    | 500ms   |
| Create Zoom meeting   | <5s    | 2.5s    |
| Create Teams meeting  | <10s   | 7s      |
| Sign in (Google)      | <5s    | 3s      |
| Sign in (Azure AD)    | <8s    | 5s      |

---

## Keyboard Shortcuts

| Shortcut       | Action                |
| -------------- | --------------------- |
| `F12`          | Open DevTools         |
| `Ctrl+Shift+K` | Open console          |
| `Ctrl+K`       | Search (in many apps) |
| `Escape`       | Close modals/popups   |
| `Tab`          | Navigate form fields  |

---

## Next Steps

1. **Read** [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) - Full overview
2. **Review** [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md) - How it works
3. **Check** [API_REFERENCE.md](API_REFERENCE.md) - API details
4. **Troubleshoot** [TROUBLESHOOTING_FAQ.md](TROUBLESHOOTING_FAQ.md) - If issues

---

Last Updated: February 27, 2026
