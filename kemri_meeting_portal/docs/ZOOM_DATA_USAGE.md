# Zoom API Data Usage and Storage Documentation

## Scope Usage

### 1. meeting:read:meeting:admin

**Usage**:

- Fetching meeting details
- Listing user's meetings
- Verifying meeting existence

**Data Accessed**:

- Meeting ID
- Meeting topic
- Start time
- Duration
- Join URL
- Meeting settings

**Storage**:

- Meeting ID (stored in plain text in JSON file)
- Join URL (stored in plain text in JSON file)
- Basic meeting details (stored in plain text in JSON file)

### 2. meeting:read:invitation:admin

**Usage**:

- Retrieving meeting invitation details
- Sending email invitations to attendees

**Data Accessed**:

- Meeting invitation text
- Dial-in numbers
- Meeting passwords

**Storage**:

- Meeting invitation text (stored in plain text in JSON file)
- Temporarily used in email sending process (not persisted)

### 3. meeting:write:meeting:admin

**Usage**:

- Creating new meetings
- Deleting meetings
- Managing meeting settings

**Data Accessed**:

- Meeting creation capabilities
- Meeting deletion capabilities
- Meeting settings modification

**Storage**:

- Meeting creation responses stored in JSON file
- No permanent storage of API credentials

### 4. user:read:user:admin

**Usage**:

- Verifying user existence
- Getting user details for meeting creation

**Data Accessed**:

- Basic user profile information
- User settings

**Storage**:

- No user data is stored permanently
- Temporarily used during meeting creation

## Data Storage Details

### Location

```
/data/meetings.json
```

### Stored Meeting Data Structure

```json
{
	"id": "uuid-v4",
	"title": "Meeting Title",
	"description": "Meeting Description",
	"dateTime": "ISO Date String",
	"type": "meeting-type",
	"platform": "zoom",
	"attendees": ["email addresses"],
	"meetingLink": "Zoom Join URL",
	"zoomMeetingId": "Zoom Meeting ID",
	"zoomInvitation": "Full Zoom invitation text",
	"organizer": "Organizer email",
	"createdAt": "ISO Date String",
	"status": "scheduled"
}
```

### Security Considerations

1. **API Credentials**

   - Stored in `.env.local`
   - Never exposed to client-side
   - Not stored in version control

2. **Meeting Data**

   - Stored in plain text JSON
   - Access controlled via NextAuth session
   - Recommendation: Implement encryption for production

3. **Invitation Data**
   - Contains meeting join links and passwords
   - Stored in plain text
   - Recommendation: Implement encryption for production

### Data Lifecycle

1. **Creation**

   - Meeting data created via Zoom API
   - Stored in local JSON file
   - Invitation sent via email

2. **Access**

   - Read from JSON storage
   - Protected by authentication
   - Available to meeting organizer and attendees

3. **Deletion**
   - Meeting deleted from Zoom
   - Removed from local storage
   - No backup retained

## Security Recommendations for Production

1. **Data Encryption**

   - Implement encryption at rest for stored meeting data
   - Use secure key management system
   - Encrypt sensitive fields (passwords, join URLs)

2. **Database Migration**

   - Move from JSON file to secure database
   - Implement proper backup procedures
   - Use database encryption features

3. **Access Control**

   - Implement role-based access control
   - Add audit logging for sensitive operations
   - Implement rate limiting

4. **Compliance**
   - Implement data retention policies
   - Add data export capabilities for GDPR
   - Document data processing activities

## API Rate Limiting

- Zoom API has rate limits
- Currently no rate limiting implemented
- Recommendation: Add rate limiting for production

## Data Backup

Current:

- Data stored in JSON file
- No automatic backup

Recommendations:

1. Implement regular backups
2. Use secure backup storage
3. Implement backup rotation policy

## Monitoring

Recommendations:

1. Add logging for all Zoom API interactions
2. Monitor API usage and rate limits
3. Set up alerts for API failures
4. Implement error tracking

## Privacy Considerations

1. Meeting data is visible to:

   - Meeting organizer
   - System administrators
   - Authenticated users (limited view)

2. Email notifications:

   - Contain meeting details
   - Sent only to specified attendees
   - Include Zoom-generated passwords

3. Data retention:
   - Currently indefinite
   - Recommendation: Implement cleanup policy
   - Add data export/deletion capabilities
