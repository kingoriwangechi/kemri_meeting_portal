# KEMRI Meeting Portal - API Reference & Developer Guide

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Meeting Endpoints](#meeting-endpoints)
4. [Microsoft Graph Endpoints](#microsoft-graph-endpoints)
5. [Error Codes](#error-codes)
6. [Rate Limiting](#rate-limiting)
7. [Development Tips](#development-tips)
8. [Testing APIs](#testing-apis)

---

## API Overview

### Base URL

```
Development: http://localhost:3001
Production: https://yourdomain.com
```

### API Format

- Content-Type: `application/json`
- Authentication: Bearer JWT token in cookies
- Response Format: JSON

### Common Guidelines

- All timestamps in ISO 8601 format (UTC)
- All endpoints require authentication unless noted
- Rate limits apply to Zoom/Teams/SendGrid APIs
- Errors return appropriate HTTP status codes

---

## Authentication Endpoints

### Sign In Page

**GET** `/auth/signin`

- Public endpoint
- HTML form for authentication
- Redirects to OAuth providers

**Providers Available**:

- `google` - Google OAuth
- `azure-ad` - Microsoft Azure AD
- `credentials` - Email/password

### OAuth Callback

**GET** `/api/auth/callback/:provider`

- Handled by NextAuth
- Processes OAuth response
- Sets session cookie
- Internal endpoint

### Sign Out

**GET** `/api/auth/signout`

- Clears session
- Removes JWT cookie
- Redirects to home

### Session Check

**GET** `/api/auth/session`

- Returns current user session
- Returns null if not authenticated
- Used internally by SessionProvider

**Response**:

```json
{
	"user": {
		"email": "user@example.com",
		"name": "User Name",
		"image": "https://...",
		"id": "user-id"
	},
	"provider": "google",
	"expires": "2026-03-27T18:00:00Z"
}
```

### Callback: /api/auth/signin

**POST** `/auth/signin`

```json
{
	"email": "user@example.com",
	"password": "password123"
}
```

- For credentials provider only
- Returns session cookie
- Credentials auth is fallback only

---

## Meeting Endpoints

### List All Meetings

**GET** `/api/meetings`

**Query Parameters**:

```
?type=internal        // Filter by type
?platform=zoom        // Filter by platform
?status=scheduled     // Filter by status
?limit=10             // Default: all
?skip=0               // For pagination
```

**Response** (200):

```json
[
	{
		"id": "550e8400-e29b-41d4-a716-446655440000",
		"title": "Weekly Team Sync",
		"description": "Discussing project updates",
		"dateTime": "2026-03-01T10:00:00Z",
		"type": "internal",
		"platform": "zoom",
		"organizer": "organizer@kemri.go.ke",
		"attendees": ["user1@kemri.go.ke", "user2@kemri.go.ke"],
		"meetingLink": "https://zoom.us/j/1234567890",
		"isRestrictive": true,
		"status": "scheduled",
		"createdAt": "2026-02-27T18:00:00Z",
		"updatedAt": "2026-02-27T18:00:00Z"
	}
]
```

**Error** (401): Not authenticated

---

### Create Meeting

**POST** `/api/meetings`

**Request Body**:

```json
{
	"title": "Team Meeting",
	"description": "Weekly sync",
	"dateTime": "2026-03-01T10:00:00Z",
	"type": "internal",
	"platform": "zoom",
	"attendees": ["user@example.com"],
	"isRestrictive": true,
	"meetingLink": null
}
```

**Field Definitions**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | Yes | Meeting name |
| description | string | No | Optional details |
| dateTime | string | Yes | ISO 8601, must be future |
| type | string | Yes | "internal", "external", "research", "training" |
| platform | string | Yes | "zoom" or "teams" |
| attendees | string[] | No | Email addresses |
| isRestrictive | boolean | No | Default: false |
| meetingLink | string | No | For manual Teams links |

**Response** (201):

```json
{
	"id": "550e8400-e29b-41d4-a716-446655440000",
	"title": "Team Meeting",
	"description": "Weekly sync",
	"dateTime": "2026-03-01T10:00:00Z",
	"type": "internal",
	"platform": "zoom",
	"organizer": "current.user@kemri.go.ke",
	"attendees": ["user@example.com"],
	"meetingLink": "https://zoom.us/j/1234567890",
	"isRestrictive": true,
	"status": "scheduled",
	"createdAt": "2026-02-27T18:00:00Z",
	"updatedAt": "2026-02-27T18:00:00Z"
}
```

**Errors**:

- 400: Invalid request (missing fields, past date)
- 401: Not authenticated
- 500: Zoom API failure (critical)
- 202: Created but Teams link failed to auto-generate

---

### Get Meeting Details

**GET** `/api/meetings/:id`

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Meeting UUID |

**Response** (200):

```json
{
	"id": "550e8400-e29b-41d4-a716-446655440000",
	"title": "Team Meeting",
	"description": "Weekly sync",
	"dateTime": "2026-03-01T10:00:00Z",
	"type": "internal",
	"platform": "zoom",
	"organizer": "organizer@kemri.go.ke",
	"attendees": ["user@example.com"],
	"meetingLink": "https://zoom.us/j/1234567890",
	"isRestrictive": true,
	"status": "scheduled",
	"createdAt": "2026-02-27T18:00:00Z",
	"updatedAt": "2026-02-27T18:00:00Z",
	"joinedCount": 3
}
```

**Errors**:

- 404: Meeting not found
- 401: Not authenticated

---

### Update Meeting

**PUT** `/api/meetings/:id`

**Request Body**:

```json
{
	"title": "Updated Title",
	"description": "Updated description",
	"dateTime": "2026-03-08T10:00:00Z",
	"type": "external",
	"attendees": ["user1@example.com", "user2@example.com"],
	"isRestrictive": true
}
```

**Immutable Fields**:

- `id` - Cannot change
- `platform` - Cannot change type of meeting
- `organizer` - Cannot change owner
- `createdAt` - Cannot change creation time

**Response** (200):

```json
{
	"id": "550e8400-e29b-41d4-a716-446655440000",
	"title": "Updated Title",
	"description": "Updated description",
	"dateTime": "2026-03-08T10:00:00Z",
	"type": "external",
	"platform": "zoom",
	"organizer": "organizer@kemri.go.ke",
	"attendees": ["user1@example.com", "user2@example.com"],
	"meetingLink": "https://zoom.us/j/1234567890",
	"isRestrictive": true,
	"status": "scheduled",
	"createdAt": "2026-02-27T18:00:00Z",
	"updatedAt": "2026-02-27T18:05:00Z"
}
```

**Errors**:

- 400: Invalid data
- 403: Not authorized (not organizer)
- 404: Meeting not found
- 401: Not authenticated

---

### Delete Meeting

**DELETE** `/api/meetings/:id`

**Response** (200):

```json
{
	"message": "Meeting deleted successfully",
	"id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Errors**:

- 403: Not authorized (not organizer)
- 404: Meeting not found
- 401: Not authenticated

---

## Microsoft Graph Endpoints

### Get Teams Meetings

**GET** `/api/graph/online-meetings`

**Query Parameters**:

```
?searchTerm=meeting   // Optional search
?limit=10             // Items per page
?skip=0               // Pagination offset
```

**Response** (200):

```json
{
	"meetings": [
		{
			"id": "MSAxMDAsNDA=",
			"creationDateTime": "2026-02-27T18:00:00Z",
			"startDateTime": "2026-03-01T10:00:00Z",
			"endDateTime": "2026-03-01T11:00:00Z",
			"subject": "Team Sync",
			"joinWebUrl": "https://teams.microsoft.com/l/meetup-join/..."
		}
	],
	"total": 5
}
```

**Errors**:

- 401: Not authenticated or Teams token unavailable
- 403: Missing Teams permissions
- 500: Microsoft Graph API error

---

### Create Teams Meeting

**POST** `/api/graph/online-meetings`

**Request Body**:

```json
{
	"subject": "Team Meeting",
	"startDateTime": "2026-03-01T10:00:00Z",
	"endDateTime": "2026-03-01T11:00:00Z",
	"attendees": ["user@example.com"]
}
```

**Response** (201):

```json
{
	"id": "MSAxMDAsNDA=",
	"creationDateTime": "2026-02-27T18:00:00Z",
	"startDateTime": "2026-03-01T10:00:00Z",
	"endDateTime": "2026-03-01T11:00:00Z",
	"subject": "Team Meeting",
	"joinWebUrl": "https://teams.microsoft.com/l/meetup-join/19:meeting_12345@thread.v2/0",
	"audioConferencing": {
		"dialinUrl": "https://dialin.teams.microsoft.com/?id=speaker"
	}
}
```

**Notes**:

- This is a helper endpoint
- Meeting creation in `/api/meetings` handles Teams automatically
- Use when you need direct Graph API access

**Errors**:

- 400: Invalid parameters
- 403: No Teams license on account
- 500: Graph API error

---

## Error Codes

### HTTP Status Codes

| Code | Status            | Meaning                                       |
| ---- | ----------------- | --------------------------------------------- |
| 200  | OK                | Successful GET/PUT/DELETE                     |
| 201  | Created           | Successful POST                               |
| 202  | Accepted          | Created but with warnings (Teams link failed) |
| 400  | Bad Request       | Invalid input data                            |
| 401  | Unauthorized      | Missing/invalid authentication                |
| 403  | Forbidden         | Authenticated but not authorized              |
| 404  | Not Found         | Resource doesn't exist                        |
| 429  | Too Many Requests | Rate limit exceeded                           |
| 500  | Server Error      | Internal server error                         |
| 502  | Bad Gateway       | External API error (Zoom/Teams/SendGrid)      |

### Error Response Format

```json
{
	"error": "Error message",
	"status": 400,
	"code": "INVALID_DATE",
	"details": {
		"field": "dateTime",
		"issue": "Date must be in the future"
	}
}
```

### Common Error Codes

**MISSING_REQUIRED_FIELD** (400)

```json
{
	"error": "Missing required field: title",
	"status": 400,
	"code": "MISSING_REQUIRED_FIELD"
}
```

**INVALID_DATE** (400)

```json
{
	"error": "Meeting date must be in the future",
	"status": 400,
	"code": "INVALID_DATE"
}
```

**NOT_AUTHORIZED** (403)

```json
{
	"error": "You are not authorized to modify this meeting",
	"status": 403,
	"code": "NOT_AUTHORIZED"
}
```

**ZOOM_API_ERROR** (500)

```json
{
	"error": "Failed to create Zoom meeting",
	"status": 500,
	"code": "ZOOM_API_ERROR",
	"details": {
		"reason": "Invalid API key"
	}
}
```

**NOT_FOUND** (404)

```json
{
	"error": "Meeting not found",
	"status": 404,
	"code": "NOT_FOUND"
}
```

---

## Rate Limiting

### Service Limits

**Zoom API**:

- 50 requests per second
- 10,000 requests per day
- Contact Zoom for higher limits

**Microsoft Graph API**:

- Throttling: 2,000 requests per 10 seconds
- Batch: 20 requests per batch
- Service limits apply per user

**SendGrid API**:

- 600 requests per minute
- 500 recipients per request
- Monitor credits/balance

### Local Rate Limiting

Currently not implemented. Recommended for production:

```javascript
// Use express-rate-limit
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

---

## Development Tips

### Using cURL

**Get meetings**:

```bash
curl -X GET http://localhost:3001/api/meetings \
  -H "Content-Type: application/json" \
  -b "cookies.txt"
```

**Create meeting**:

```bash
curl -X POST http://localhost:3001/api/meetings \
  -H "Content-Type: application/json" \
  -b "cookies.txt" \
  -d '{
    "title": "Test Meeting",
    "dateTime": "2026-03-01T10:00:00Z",
    "platform": "zoom"
  }'
```

**Delete meeting**:

```bash
curl -X DELETE http://localhost:3001/api/meetings/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -b "cookies.txt"
```

### Using JavaScript Fetch

```javascript
// Get meetings
const response = await fetch("/api/meetings", {
	method: "GET",
	credentials: "include", // Include cookies
	headers: {
		"Content-Type": "application/json",
	},
});
const meetings = await response.json();

// Create meeting
const newMeeting = await fetch("/api/meetings", {
	method: "POST",
	credentials: "include",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		title: "New Meeting",
		dateTime: "2026-03-01T10:00:00Z",
		platform: "zoom",
	}),
});
const meeting = await newMeeting.json();
```

### Using Postman

1. **Set Base URL**:
   - Click "Environments"
   - Create `KEMRI Dev`
   - Set `{{base_url}}` = `http://localhost:3001`

2. **Requests**:
   - GET `{{base_url}}/api/meetings`
   - POST `{{base_url}}/api/meetings`
   - PUT `{{base_url}}/api/meetings/:id`
   - DELETE `{{base_url}}/api/meetings/:id`

3. **Authentication**:
   - Sign in at `http://localhost:3001/auth/signin`
   - Copy session cookie from browser
   - Add to Postman cookie jar

4. **Headers**:

```
Content-Type: application/json
```

---

## Testing APIs

### Setting Up Tests

**Install testing library**:

```bash
npm install --save-dev jest supertest
```

**Example test**:

```javascript
import request from "supertest";

describe("Meetings API", () => {
	it("should create a meeting", async () => {
		const response = await request(app)
			.post("/api/meetings")
			.send({
				title: "Test",
				dateTime: new Date(Date.now() + 86400000).toISOString(),
				platform: "zoom",
			})
			.expect(201);

		expect(response.body).toHaveProperty("id");
		expect(response.body.title).toBe("Test");
	});

	it("should list meetings", async () => {
		const response = await request(app).get("/api/meetings").expect(200);

		expect(Array.isArray(response.body)).toBe(true);
	});
});
```

### Manual Testing Flow

1. **Sign In**
   - Visit `http://localhost:3001/auth/signin`
   - Choose provider
   - Complete auth flow

2. **Create Meeting**
   - Navigate to `/dashboard`
   - Click "Create New Meeting"
   - Fill form and submit
   - Verify meeting appears in list

3. **Verify API Call**
   - Open browser DevTools
   - Go to Network tab
   - Look for POST `/api/meetings` request
   - Check response includes meeting ID and link

4. **Edit Meeting**
   - Click meeting in list
   - Click "Edit"
   - Modify details
   - Click "Update"
   - Verify changes reflected

5. **Delete Meeting**
   - Select meeting
   - Click "Delete"
   - Confirm
   - Verify removed from list

---

## Common Integration Examples

### Creating a Meeting from External System

```javascript
async function createMeetingForUser(userEmail, meetingData) {
	// 1. User must already be authenticated
	// 2. Session cookie must be present

	return fetch("http://localhost:3001/api/meetings", {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			title: meetingData.title,
			description: meetingData.description,
			dateTime: new Date(meetingData.datetime).toISOString(),
			type: "external",
			platform: "zoom",
			attendees: [userEmail],
			isRestrictive: true,
		}),
	}).then((r) => r.json());
}
```

### Checking Meeting Status

```javascript
async function getMeetingDetails(meetingId) {
	return fetch(`http://localhost:3001/api/meetings/${meetingId}`, {
		credentials: "include",
	}).then((r) => r.json());
}
```

### Bulk Operations

```javascript
async function getMeetingsByType(type) {
	return fetch(`http://localhost:3001/api/meetings?type=${type}`, {
		credentials: "include",
	}).then((r) => r.json());
}
```

---

Last Updated: February 27, 2026
