# KEMRI Meeting Portal - System Analysis & Design Document

## Table of Contents

1. [Introduction](#introduction)
2. [System Analysis](#system-analysis)
3. [Requirements Specification](#requirements-specification)
4. [System Architecture](#system-architecture)
5. [Database Design](#database-design)
6. [User Interface Design](#user-interface-design)
7. [API Design](#api-design)
8. [Security Considerations](#security-considerations)
9. [Implementation Plan](#implementation-plan)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Strategy](#deployment-strategy)
12. [Maintenance Plan](#maintenance-plan)

## Introduction

### Purpose

This document provides a comprehensive analysis and design for the KEMRI Meeting Portal system, which aims to automate and streamline the meeting management process for the Kenya Medical Research Institute (KEMRI).

### Scope

The KEMRI Meeting Portal will provide features for scheduling, managing, and conducting meetings, with integration to popular video conferencing platforms (Zoom, Microsoft Teams) and automated notifications.

### Audience

This document is intended for developers, system administrators, project stakeholders, and future maintainers of the system.

### Definitions, Acronyms, and Abbreviations

- **KEMRI**: Kenya Medical Research Institute
- **API**: Application Programming Interface
- **UI/UX**: User Interface/User Experience
- **OAuth**: Open Authorization
- **MVC**: Model-View-Controller

## System Analysis

### Current System Analysis

Currently, KEMRI manages meetings through manual processes involving email exchanges, calendar invites, and manual record-keeping. This approach leads to inefficiencies, double-bookings, and communication challenges.

### Stakeholder Analysis

| Stakeholder        | Role                    | Needs                                |
| ------------------ | ----------------------- | ------------------------------------ |
| Administrators     | Manage system           | System oversight, user management    |
| Meeting Organizers | Schedule meetings       | Easy scheduling, attendee management |
| Attendees          | Participate in meetings | Clear notifications, easy access     |
| IT Department      | Maintain system         | System stability, security           |

### Problem Areas

1. Inefficient scheduling processes
2. Lack of centralized meeting information
3. Manual attendee management
4. Limited integration with video conferencing tools
5. Absence of automated notifications

### Opportunities

1. Automate scheduling and notifications
2. Centralize meeting information
3. Integrate with popular video conferencing platforms
4. Provide analytics and reporting
5. Enhance user experience with a modern interface

## Requirements Specification

### Functional Requirements

#### Authentication & Authorization

- FR1: Users shall be able to sign in using credentials (email/password)
- FR2: Users shall be able to sign in using Google OAuth
- FR3: Users shall be able to sign in using Microsoft OAuth
- FR4: System shall implement role-based access control

#### Meeting Management

- FR5: Users shall be able to create new meetings
- FR6: Users shall be able to edit existing meetings
- FR7: Users shall be able to delete meetings
- FR8: System shall support open (public) meetings
- FR9: System shall support restricted (invitation-only) meetings
- FR10: System shall generate video conferencing links (Zoom, Teams)
- FR11: System shall display upcoming and past meetings

#### Notifications

- FR12: System shall send email invitations to meeting attendees
- FR13: System shall send reminders before scheduled meetings
- FR14: System shall notify of meeting changes or cancellations

#### User Management

- FR15: Administrators shall be able to manage user accounts
- FR16: Users shall be able to update their profiles

### Non-Functional Requirements

#### Performance

- NFR1: System shall load pages within 3 seconds
- NFR2: System shall handle at least 100 concurrent users
- NFR3: System shall process meeting creation within 5 seconds

#### Security

- NFR4: All communications shall be encrypted using HTTPS
- NFR5: Authentication tokens shall expire after 24 hours
- NFR6: Failed login attempts shall be limited to 5 before temporary lockout

#### Usability

- NFR7: UI shall be responsive and work on mobile devices
- NFR8: System shall be accessible according to WCAG 2.1 AA standards
- NFR9: System shall provide clear error messages and feedback

#### Reliability

- NFR10: System shall maintain 99.9% uptime
- NFR11: Data backups shall be performed daily
- NFR12: System shall have error logging and monitoring

## System Architecture

### High-Level Architecture

The KEMRI Meeting Portal follows a client-server architecture with a React-based frontend and Next.js API backend. The system integrates with external services for authentication, video conferencing, and email notifications.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │  External APIs  │
│  Client Layer   │<────│  Server Layer   │<────│  - Google OAuth │
│  (Next.js/React)│     │  (Next.js API)  │     │  - Microsoft    │
│                 │     │                 │     │  - Zoom         │
└─────────────────┘     └─────────────────┘     │  - SendGrid     │
                               │                └─────────────────┘
                               │
                        ┌──────▼──────┐
                        │             │
                        │  Storage    │
                        │             │
                        └─────────────┘
```

### Component Architecture

- **Authentication Component**: Handles user authentication and session management
- **Meeting Management Component**: Handles creation, editing, and deletion of meetings
- **Notification Component**: Manages email notifications and reminders
- **User Management Component**: Handles user profile management
- **Integration Component**: Manages integration with external services (Zoom, Teams)

### Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Authentication**: NextAuth.js
- **Storage**: JSON files (initial), expandable to database
- **APIs**: Zoom API, Microsoft Graph API, SendGrid API
- **Deployment**: Vercel or similar platform

## Database Design

### Data Storage Approach

The initial implementation uses JSON file storage for simplicity and rapid development. This approach is suitable for prototype and initial deployment but can be migrated to a proper database system as needed.

### Data Models

#### User Model

```json
{
	"id": "unique-id",
	"name": "User Name",
	"email": "user@example.com",
	"image": "https://example.com/profile.jpg",
	"role": "admin|user",
	"createdAt": "2023-06-15T10:00:00Z"
}
```

#### Meeting Model

```json
{
	"id": "unique-id",
	"title": "Meeting Title",
	"description": "Meeting description",
	"dateTime": "2023-06-20T15:00:00Z",
	"duration": 60,
	"type": "internal|external|research|training",
	"platform": "zoom|teams",
	"meetingLink": "https://zoom.us/j/123456789",
	"isRestrictive": false,
	"attendees": ["user1@example.com", "user2@example.com"],
	"organizer": "organizer@example.com",
	"createdAt": "2023-06-15T10:00:00Z",
	"status": "scheduled|completed|cancelled"
}
```

### Relationship Diagram

```
User (1) ───────────┐
                    │
                    │ organizes
                    │
                    ▼
                Meeting (*)
                    │
                    │ has
                    │
                    ▼
              Attendees (*)
```

## User Interface Design

### Design Principles

- Clean, minimalist interface
- Responsive design for all devices
- Consistent color scheme and typography
- Intuitive navigation and workflow
- Clear feedback and error messages

### Key Screens

#### 1. Authentication Screens

- Sign in/Sign up pages with multiple options (credentials, Google, Microsoft)
- Password reset functionality

#### 2. Dashboard

- Overview of upcoming meetings
- Quick actions for creating new meetings
- Calendar view of scheduled meetings

#### 3. Meeting Management

- Meeting creation form with platform selection
- Meeting details view with join options
- Meeting editing interface

#### 4. User Profile

- Profile information display
- Profile editing functionality

### UI Mockups

Wireframes and mockups will be created using Figma or similar design tools to visualize the user interface before implementation.

## API Design

### API Endpoints

#### Authentication API

- `POST /api/auth/[...nextauth]` - Authentication endpoints managed by NextAuth.js

#### Meetings API

- `GET /api/meetings` - List all meetings
- `POST /api/meetings` - Create new meeting
- `GET /api/meetings/:id` - Get meeting details
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting

#### Users API

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

#### Integration API

- `POST /api/zoom/create` - Create Zoom meeting
- `DELETE /api/zoom/:meetingId` - Delete Zoom meeting
- `POST /api/teams/create` - Create Teams meeting
- `DELETE /api/teams/:meetingId` - Delete Teams meeting

### API Response Format

```json
{
	"success": true,
	"data": {},
	"error": null
}
```

### Error Handling

```json
{
	"success": false,
	"data": null,
	"error": {
		"code": "ERROR_CODE",
		"message": "Human-readable error message"
	}
}
```

## Security Considerations

### Authentication Security

- Use of industry-standard OAuth 2.0 flows
- Secure storage of authentication tokens
- Regular token rotation
- HTTPS for all communications

### Authorization Controls

- Role-based access control
- Permission validation on all protected endpoints
- Resource ownership validation

### Data Protection

- Encryption of sensitive data
- Secure storage of API keys and secrets
- Input validation and sanitization
- Protection against common web vulnerabilities (XSS, CSRF)

### Compliance Considerations

- Data privacy compliance
- Audit logging for sensitive operations
- Data retention policies

## Implementation Plan

### Phase 1: Foundation (Week 1-2)

- Project setup and configuration
- Authentication implementation
- Basic UI components
- Core API endpoints

### Phase 2: Core Functionality (Week 3-4)

- Meeting management features
- Email notifications
- User profile management
- Initial testing

### Phase 3: Integration (Week 5-6)

- Zoom API integration
- Microsoft Teams integration
- SendGrid email integration
- Enhanced UI/UX

### Phase 4: Refinement (Week 7-8)

- Performance optimization
- Security enhancements
- Accessibility improvements
- Comprehensive testing

## Testing Strategy

### Testing Levels

- **Unit Testing**: Individual components and functions
- **Integration Testing**: API endpoints and service interactions
- **System Testing**: End-to-end workflows
- **User Acceptance Testing**: Validation with stakeholders

### Testing Tools

- Jest for unit and integration testing
- Cypress for end-to-end testing
- Manual testing for UI/UX validation

### Testing Metrics

- Code coverage (target: >80%)
- Bug severity and frequency
- User satisfaction scores

## Deployment Strategy

### Deployment Environments

- **Development**: Local developer environments
- **Staging**: Pre-production testing environment
- **Production**: Live system for end users

### Deployment Process

1. Code review and approval
2. Automated testing in CI pipeline
3. Staging deployment and validation
4. Production deployment
5. Post-deployment verification

### Infrastructure Requirements

- Web hosting (Vercel recommended)
- Domain name and SSL certificate
- Monitoring and alerting system

## Maintenance Plan

### Routine Maintenance

- Regular security updates
- Performance monitoring and optimization
- Database backups and maintenance

### Support Procedures

- User support channels
- Bug reporting process
- Feature request handling

### Future Enhancements

- Mobile application development
- Advanced analytics dashboard
- Additional video conferencing integrations
- Calendar synchronization features
