# KEMRI Meeting Portal - Architecture & Design Guide

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Authentication Flow](#authentication-flow)
3. [Meeting Lifecycle](#meeting-lifecycle)
4. [API Integration Details](#api-integration-details)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Security Considerations](#security-considerations)
8. [Performance Optimization](#performance-optimization)

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                             │
│  (React Components, Next.js Frontend State)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│           Next.js Application Server                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Route Handlers & API Endpoints            │  │
│  │  /api/auth/* (NextAuth.js)                           │  │
│  │  /api/meetings/* (CRUD operations)                   │  │
│  │  /api/graph/* (Microsoft Graph proxy)                │  │
│  │  /dashboard, /profile (UI routes)                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                       ↓←↑← ← ←─────────────────┐           │
│  ┌──────────────────────────────────────────┐ │           │
│  │   Middleware Layer (Authentication)      │ │           │
│  │   - Token validation                     │ │           │
│  │   - Route protection                     │ │           │
│  └──────────────────────────────────────────┘ │           │
│                       ↓                        │           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Business Logic & Services Layer              │  │
│  │  - Meeting management (CRUD)                        │  │
│  │  - Teams meeting creation                           │  │
│  │  - Email sending coordination                        │  │
│  │  - Authorization checks                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         ↓         ↓          ↓           ↓         ↓
      ┌──────┐ ┌─────────┐ ┌──────────┐ ┌──────┐ ┌────────┐
      │Zoom  │ │Microsoft│ │SendGrid  │ │MongoDB│ │JSON FS │
      │ API  │ │ Graph   │ │  Email   │ │      │ │Storage │
      │      │ │  API    │ │          │ │      │ │        │
      └──────┘ └─────────┘ └──────────┘ └──────┘ └────────┘
         ↓         ↓          ↓           ↓         ↓
    Zoom Inc.   Microsoft   SendGrid    MongoDB   File System
   (meeting     (Teams       (email)    (database) (local dev)
   creation)    integration)
```

### Component Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── layout.js                 # Root layout with providers
│   ├── page.js                   # Home page
│   ├── globals.css               # Global styles
│   │
│   ├── auth/                     # Auth pages
│   │   ├── signin/page.js        # Sign-in UI
│   │   └── error/page.js         # Auth error display
│   │
│   ├── api/                      # Backend routes
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.js          # NextAuth handler
│   │   │                         #  - Providers config
│   │   │                         #  - Callbacks
│   │   │                         #  - Session/JWT
│   │   │
│   │   ├── meetings/
│   │   │   ├── route.js          # GET (list), POST (create)
│   │   │   └── [id]/route.js     # GET, PUT, DELETE
│   │   │
│   │   ├── graph/
│   │   │   └── online-meetings   # Microsoft Graph proxy
│   │   │       └── route.js      # Teams meeting management
│   │   │
│   │   └── auth-debug/
│   │       └── route.js          # Debug endpoint
│   │
│   ├── dashboard/                # Main application
│   │   └── page.js               # Calendar & meeting list
│   │
│   └── profile/                  # User profile
│       └── page.js               # Profile info & settings
│
├── components/                   # React Components
│   ├── SessionProvider.js        # NextAuth Provider
│   ├── AuthDebugInfo.js          # [REMOVED: Debug display]
│   ├── MeetingForm.js            # Create/edit form
│   │                             # - Platform selection
│   │                             # - Zoom auto-gen
│   │                             # - Teams manual/auto
│   ├── MeetingList.js            # Display meetings
│   ├── MeetingDetails.js         # Modal for details
│   ├── Footer.js                 # Footer component
│   │
│   └── ui/                       # Reusable UI elements
│       └── [components]
│
├── lib/                          # Utilities & Services
│   ├── mongodb.js                # MongoDB connection
│   ├── storage.js                # Data abstraction layer
│   │                             # - File-based fallback
│   │                             # - MongoDB support
│   │
│   ├── zoom.js                   # Zoom API integration
│   │                             # - JWT token generation
│   │                             # - Meeting creation
│   │
│   ├── graph-app-only.js         # Microsoft Graph (app-only)
│   │                             # - Teams meetings
│   │                             # - OAuth token handling
│   │
│   ├── email.js                  # SendGrid integration
│   │                             # - Meeting invitations
│   │
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Meeting.js            # Meeting schema
│   │   └── Attendee.js           # Attendee tracking
│   │
│   └── zoom-update.js            # Zoom meeting updates
│
└── middleware.js                 # Auth middleware
                                  # - Token validation
                                  # - Route protection
```

---

## Authentication Flow

### Sign-In Flow

```
User clicks "Sign in with Google"
         ↓
NextAuth redirects to OAuth provider
         ↓
User authenticates at provider
         ↓
Provider redirects back to /api/auth/callback/[provider]
         ↓
NextAuth validates response
         ↓
session() callback executes
(adds user info to session)
         ↓
JWT token created & encrypted
         ↓
Redirect to dashboard
         ↓
User has valid session cookie
```

### JWT Token Structure

```javascript
// Payload stored in JWT
{
  "sub": "user-id",                    // Subject (user ID)
  "name": "User Name",                 // Full name
  "email": "user@example.com",         // Email
  "picture": "https://...",            // Profile picture
  "provider": "google|azure-ad|...",   // Auth provider
  "iat": 1701234567,                   // Issued at
  "exp": 1701320967,                   // Expiration (30 days)
  "iss": "http://localhost:3001",      // Issuer
  "jti": "xxx"                         // JWT ID
}
```

### Session Refresh

```
User accessed at 08:00AM
         ↓
Token expires after 30 days
         ↓
On next request, JWT checked
         ↓
If expired, user redirected to sign-in
         ↓
If within update age (24h), token refreshed
```

---

## Meeting Lifecycle

### Create Meeting Workflow

```
Frontend: User submits form
          ↓
API POST /api/meetings
          ↓
Auth middleware validates JWT
          ↓
Validate meeting data
  - Title & date required
  - DateTime in future
  - Platform is zoom|teams
          ↓
If Platform == "zoom":
  ├─ Call Zoom API → Get meeting link
  ├─ Wait for response
  └─ Set meetingLink in meeting obj
          ↓
If Platform == "teams":
  ├─ Try Teams/Graph API creation
  ├─ If fails: Log error, continue
  │  (allow meeting without link)
  └─ Set meetingLink if successful
          ↓
Save meeting to database
  - MongoDB if configured
  - JSON file fallback
          ↓
If isRestrictive && attendees.length > 0:
  ├─ For each attendee:
  │  └─ Send email via SendGrid
  └─ Track invitation sent
          ↓
Return created meeting object (201)
          ↓
Frontend: Display confirmation
```

### Update Meeting Workflow

```
Frontend: User modifies form
          ↓
API PUT /api/meetings/:id
          ↓
Auth + authorization check
  - User must be organizer
          ↓
Find existing meeting
          ↓
Update allowed fields:
  ✓ title, description, dateTime
  ✓ type, attendees
  ✗ platform (cannot change)
  ✗ createdAt (immutable)
          ↓
If platform changed from none to zoom:
  └─ Generate Zoom link
          ↓
If platform changed from none to teams:
  └─ Try to generate Teams link
          ↓
Save changes
          ↓
Notify attendees of changes (optional)
          ↓
Return updated meeting (200)
```

### Delete Meeting Workflow

```
Frontend: User clicks delete
          ↓
API DELETE /api/meetings/:id
          ↓
Auth + authorization check
  - User must be organizer
          ↓
Find meeting
          ↓
Delete from database
          ↓
Optionally notify attendees
          ↓
Return success (200)
          ↓
Frontend: Remove from list
```

---

## API Integration Details

### Zoom API Integration

**Endpoint Used**: POST `https://zoom.us/oauth/token`

**Process**:

1. Generate JWT token using Zoom API key + secret
2. Use JWT to get OAuth token
3. Create meeting with OAuth token

**Code Location**: [src/lib/zoom.js](src/lib/zoom.js)

```javascript
// JWT Generation
const payload = {
	iss: ZOOM_API_KEY,
	exp: Math.floor(Date.now() / 1000) + 3600,
};
const jwtToken = sign(payload, ZOOM_API_SECRET, { algorithm: "HS256" });

// Create Meeting
const meetingUrl = "https://zoom.us/v2/users/me/meetings";
const response = await fetch(meetingUrl, {
	method: "POST",
	headers: {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		topic: title,
		type: 2, // Scheduled meeting
		start_time: dateTime,
		duration: 60,
		timezone: "UTC",
	}),
});
```

### Microsoft Graph API Integration

**Endpoint Used**: POST `/me/onlineMeetings`

**Authentication**:

- Bearer token from Azure AD (app-only auth)
- Client credentials flow

**Code Location**: [src/lib/graph-app-only.js](src/lib/graph-app-only.js)

```javascript
// Get access token (client credentials)
const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

// Create Teams meeting
const meetingUrl = "https://graph.microsoft.com/v1.0/me/onlineMeetings";
const response = await fetch(meetingUrl, {
	method: "POST",
	headers: {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		subject: title,
		startDateTime: new Date(dateTime).toISOString(),
		endDateTime: new Date(+new Date(dateTime) + 3600000).toISOString(),
		audioConferencing: {
			conferenceId: "NA", // Generated by Teams
		},
	}),
});
```

### SendGrid Email Integration

**Endpoint Used**: POST `https://api.sendgrid.com/v3/mail/send`

**Code Location**: [src/lib/email.js](src/lib/email.js)

```javascript
// Send invite
const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
	method: "POST",
	headers: {
		Authorization: `Bearer ${SENDGRID_API_KEY}`,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		personalizations: [
			{
				to: [{ email: attendeeEmail }],
				subject: `You're invited: ${title}`,
			},
		],
		from: { email: "noreply@kemri.go.ke" },
		content: [
			{
				type: "text/html",
				value: htmlBody,
			},
		],
	}),
});
```

---

## Data Models

### Meeting Schema

```javascript
{
  id: String,                    // UUID
  title: String,                 // Required
  description: String,           // Optional
  dateTime: Date,                // Required, must be future
  type: String,                  // internal|external|research|training
  platform: String,              // zoom|teams
  meetingLink: String,           // Auto-generated or manual
  organizer: String,             // Email of creator
  attendees: [String],           // Array of emails
  isRestrictive: Boolean,        // Invite-only access

  // Metadata
  createdAt: Date,              // Auto-set at creation
  updatedAt: Date,              // Auto-update on changes
  status: String,               // scheduled|completed|cancelled

  // Optional tracking
  zoomMeetingId: String,        // Zoom's internal ID
  teamsEventId: String,         // Teams event ID
  joinedCount: Number,          // Attendees who joined
}
```

### User Session Schema

```javascript
{
  user: {
    id: String,                 // User ID from provider
    email: String,              // Email
    name: String,               // Full name
    image: String,              // Profile picture URL
  },
  provider: String,             // google|azure-ad|credentials
  expires: Date,                // Session expiration time
  accessToken: String,          // OAuth token (for Graph API)
  idToken: String,              // ID token from provider
}
```

---

## Error Handling

### Error Handling Strategy

```
User Action
    ↓
Try-Catch Block
    ├─ Validation Error
    │  └─ Return 400 Bad Request
    │
    ├─ Authorization Error
    │  └─ Return 403 Forbidden
    │
    ├─ Not Found Error
    │  └─ Return 404 Not Found
    │
    ├─ API Error (Zoom/Teams/SendGrid)
    │  ├─ Log details
    │  ├─ Check if critical
    │  ├─ If critical: Return 500
    │  └─ If non-critical: Continue with fallback
    │
    └─ Unexpected Error
       └─ Log & Return 500
```

### Common Error Scenarios

**Zoom API Failure**:

```javascript
try {
	const meeting = await createZoomMeeting(data);
} catch (error) {
	console.error("Zoom API error:", error);
	// Critical - cannot create meeting
	return { status: 500, error: "Failed to create Zoom meeting" };
}
```

**Teams API Failure (Non-Critical)**:

```javascript
try {
	const meeting = await createTeamsMeeting(data);
} catch (error) {
	console.warn("Teams auto-generation failed:", error);
	// Non-critical fallback
	// Continue to save meeting without Teams link
	meeting.teamsLink = null;
	return { status: 201, warning: "Meeting created without Teams link" };
}
```

**Email Sending Failure**:

```javascript
try {
	await sendInvitations(meeting, attendees);
} catch (error) {
	console.warn("Email failed:", error);
	// Non-critical
	// Meeting still created, just notify user
	return { status: 201, warning: "Meeting created but notifications failed" };
}
```

---

## Security Considerations

### Authentication & Authorization

1. **JWT Token Security**
   - Signed with `NEXTAUTH_SECRET`
   - Encrypted in HTTP-only cookie
   - Automatically refreshed every 24 hours
   - Expires after 30 days

2. **Route Protection**
   - Middleware validates JWT on protected routes
   - `/api/meetings/*` requires valid session
   - `/dashboard`, `/profile` require authentication

3. **Authorization Checks**
   - User can only modify their own meetings
   - Check `organizer === currentUser.email` on PUT/DELETE
   - Empty attendee list without explicit permission

### API Security

1. **API Keys Management**
   - All keys in `.env.local` (never in code)
   - Different keys for dev/prod
   - Rotate compromised keys immediately

2. **OAuth Scope Limitation**
   - Google: `openid profile email`
   - Azure AD: `https://graph.microsoft.com/.default`
   - No unnecessary scopes requested

3. **CORS & CSRF**
   - NextAuth handles CSRF tokens
   - Same-site cookies enabled
   - API routes only from same origin

### Data Security

1. **Password Handling**
   - Credentials provider hashes with bcrypt
   - Never log passwords
   - HTTPS only in production

2. **Sensitive Data**
   - API keys never logged
   - User tokens stored securely
   - No PII in error messages

3. **Database Security**
   - MongoDB connection string in env
   - Connection pooling enabled
   - Validate all input before storing

---

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**
   - Next.js auto-splits by route
   - Component lazy loading for modal
   - Image optimization with Next.js Image

2. **Caching Strategy**
   - Static pages cached (home)
   - API responses cached client-side
   - Session data reused across requests

### Backend Optimization

1. **Database Optimization**
   - Connection pooling
   - Index on `organizer` field
   - Query only needed fields

2. **API Call Optimization**
   - Parallel API calls where possible
   - Request timeouts to prevent hanging
   - Rate limit handling (backoff)

3. **Middleware Optimization**
   - Early path returns for public routes
   - No unnecessary DB queries in middleware
   - Token validation is lightweight

### Network Optimization

1. **Request Bundling**
   - Send meeting + attendees in one request
   - Batch email sending when possible

2. **Response Size**
   - Only return needed fields
   - Compress JSON responses
   - Pagination for large lists

---

## Monitoring & Debugging

### Logging Strategy

```javascript
// Errors (always)
console.error("Critical error:", error);

// Warnings (important but recoverable)
console.warn("Non-critical issue:", details);

// Debugging (development)
if (process.env.DEBUG) {
	console.log("Debug info:", data);
}
```

### Debug Endpoint

**GET `/api/auth-debug`** (if enabled):

- Returns current user session
- Shows authentication provider
- Useful for troubleshooting auth issues

---

## Future Enhancements

1. **Calendar Integration**
   - Google Calendar sync
   - Outlook Calendar sync
   - iCal export

2. **Recurring Meetings**
   - Weekly/monthly patterns
   - Timezone handling

3. **Advanced Features**
   - Meeting templates
   - Attendance tracking
   - Meeting recordings
   - Real-time notifications

4. **Performance**
   - Redis caching layer
   - Database query optimization
   - CDN for static assets

---

## Architecture Decision Log

### Decision 1: JWT vs Session Cookies

**Choice**: JWT + HTTP-only cookies
**Reason**: Stateless, scalable, works across multiple servers
**Trade-off**: Slightly larger cookie but better security

### Decision 2: File Storage Fallback

**Choice**: JSON file + MongoDB abstraction
**Reason**: Development without MongoDB, production with scale
**Trade-off**: File storage not suitable for production

### Decision 3: Teams API Graceful Failure

**Choice**: Non-blocking Teams generation
**Reason**: Teams licensing varies by organization
**Trade-off**: Some users can't auto-generate Teams links

### Decision 4: NextAuth.js

**Choice**: Use NextAuth for auth management
**Reason**: Handles OAuth, sessions, security best practices
**Trade-off**: Dependency on third-party library

---

Last Updated: February 27, 2026
