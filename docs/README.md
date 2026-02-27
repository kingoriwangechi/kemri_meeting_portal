# KEMRI Meeting Portal - Documentation Index

Welcome to the comprehensive documentation for the KEMRI Meeting Portal. This folder contains everything you need to understand, set up, develop, and troubleshoot the application.

## Documentation Files

### 📘 [QUICK_START_CHEATSHEET.md](QUICK_START_CHEATSHEET.md)

**Best for: Getting started quickly, quick reference**

- 5-minute quick start guide
- Environment variables cheat sheet
- Common commands reference
- API endpoint cheat sheet
- OAuth provider setup instructions
- Browser console debugging tips
- Keyboard shortcuts

**Read this first if you**: Want to get up and running in 5 minutes

---

### 📙 [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)

**Best for: Complete project overview, general understanding**

- Project overview and objectives
- Feature list with status
- Full technology stack
- Installation steps
- Configuration guide
- Project structure
- Meeting management workflows
- Deployment checklist
- Common troubleshooting with solutions

**Read this if you**: Need complete project context and features

---

### 📕 [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md)

**Best for: Technical deep dive, system design, code understanding**

- System architecture diagrams
- Component structure
- Authentication flow details
- Meeting lifecycle (create, update, delete)
- API integration details (Zoom, Teams, SendGrid)
- Data model schemas
- Error handling strategy
- Security considerations
- Performance optimization techniques
- Architecture decision log

**Read this if you**: Want to understand how the system works internally

---

### 📗 [API_REFERENCE.md](API_REFERENCE.md)

**Best for: API endpoints, development, integration**

- API overview and guidelines
- Authentication endpoints
- Meeting CRUD endpoints with examples
- Microsoft Graph endpoints
- Error codes and error responses
- Rate limiting information
- Development tips (cURL, Fetch, Postman)
- Testing APIs
- Integration examples

**Read this if you**: Need to call APIs or integrate with the system

---

### 📕 [TROUBLESHOOTING_FAQ.md](TROUBLESHOOTING_FAQ.md)

**Best for: Solving problems, frequently asked questions**

- General FAQs
- Feature FAQs
- Technical FAQs
- Authentication issues with solutions
- Meeting creation issues with solutions
- Integration issues (SendGrid, etc)
- Database issues with solutions
- Deployment issues
- Performance issues
- Browser compatibility
- Getting help information

**Read this if you**: Encounter an issue or have common questions

---

## How to Use This Documentation

### I'm a New Developer

1. Start here: [QUICK_START_CHEATSHEET.md](QUICK_START_CHEATSHEET.md)
2. Get context: [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)
3. Deep dive: [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md)
4. Reference: [API_REFERENCE.md](API_REFERENCE.md)

### I'm Setting Up for Development

1. Follow: [QUICK_START_CHEATSHEET.md](QUICK_START_CHEATSHEET.md) - Quick Start section
2. Configure: OAuth providers from same file
3. Check: [TROUBLESHOOTING_FAQ.md](TROUBLESHOOTING_FAQ.md) if you hit issues

### I'm Implementing a Feature

1. Review: [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md) - Architecture section
2. Code: Reference the existing patterns
3. Test: Using [API_REFERENCE.md](API_REFERENCE.md) - Testing section
4. Debug: Use [TROUBLESHOOTING_FAQ.md](TROUBLESHOOTING_FAQ.md) as needed

### I'm Integrating with This API

1. Start: [API_REFERENCE.md](API_REFERENCE.md) - API Overview
2. Read: Relevant endpoint documentation
3. Test: Follow Testing APIs section
4. Reference: Common integration examples

### I'm Troubleshooting an Issue

1. Search: [TROUBLESHOOTING_FAQ.md](TROUBLESHOOTING_FAQ.md)
2. Find: Similar issue description
3. Follow: Solutions listed
4. If unresolved: Check [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) Troubleshooting section

### I'm Deploying to Production

1. Review: [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) - Deployment section
2. Checklist: Verify all items checked
3. Verify: Environment variables set correctly
4. Monitor: Watch logs for issues

---

## Quick Links by Topic

### Authentication

- [Setup Guides](QUICK_START_CHEATSHEET.md#setting-up-oauth-providers)
- [Auth Flow](ARCHITECTURE_DESIGN.md#authentication-flow)
- [Auth Issues](TROUBLESHOOTING_FAQ.md#authentication-issues)
- [NextAuth Config](ARCHITECTURE_DESIGN.md#nextauthjs-configuration)

### Meetings

- [Meeting Lifecycle](ARCHITECTURE_DESIGN.md#meeting-lifecycle)
- [Meeting API Endpoints](API_REFERENCE.md#meeting-endpoints)
- [Meeting Issues](TROUBLESHOOTING_FAQ.md#meeting-creation-issues)
- [Meeting Management](PROJECT_DOCUMENTATION.md#meeting-management)

### API Integration

- [Zoom Integration](ARCHITECTURE_DESIGN.md#zoom-api-integration)
- [Teams/Graph Integration](ARCHITECTURE_DESIGN.md#microsoft-graph-api-integration)
- [Email Integration](ARCHITECTURE_DESIGN.md#sendgrid-email-integration)
- [Graph API Endpoints](API_REFERENCE.md#microsoft-graph-endpoints)

### Database

- [Data Models](ARCHITECTURE_DESIGN.md#data-models)
- [Database Issues](TROUBLESHOOTING_FAQ.md#database-issues)
- [Database Config](PROJECT_DOCUMENTATION.md#configuration)

### Deployment

- [Deployment Checklist](PROJECT_DOCUMENTATION.md#pre-deployment-checklist)
- [Deployment Issues](TROUBLESHOOTING_FAQ.md#deployment-issues)
- [Vercel Deployment](PROJECT_DOCUMENTATION.md#vercel-deployment)
- [Benchmark Data](QUICK_START_CHEATSHEET.md#performance-benchmarks)

### Development

- [Commands Reference](QUICK_START_CHEATSHEET.md#common-commands)
- [File Structure](ARCHITECTURE_DESIGN.md#project-structure)
- [Dev Tips](QUICK_START_CHEATSHEET.md#debugging-tips)
- [API Testing](API_REFERENCE.md#testing-apis)

---

## Common Questions Answered

**"I'm stuck on setup, where do I start?"**
→ [QUICK_START_CHEATSHEET.md - Quick Start](QUICK_START_CHEATSHEET.md#quick-start-5-minutes)

**"How do I set up Google OAuth?"**
→ [QUICK_START_CHEATSHEET.md - Google OAuth Setup](QUICK_START_CHEATSHEET.md#google-oauth-5-minutes)

**"How do I set up Microsoft Azure AD?"**
→ [QUICK_START_CHEATSHEET.md - Azure AD Setup](QUICK_START_CHEATSHEET.md#microsoft-azure-ad-10-minutes)

**"What are all the environment variables?"**
→ [QUICK_START_CHEATSHEET.md - Environment Variables](QUICK_START_CHEATSHEET.md#environment-variables-cheat-sheet)

**"How does authentication work?"**
→ [ARCHITECTURE_DESIGN.md - Authentication Flow](ARCHITECTURE_DESIGN.md#authentication-flow)

**"How can I call the meeting API?"**
→ [API_REFERENCE.md - Meeting Endpoints](API_REFERENCE.md#meeting-endpoints) or [QUICK_START_CHEATSHEET.md - API Requests](QUICK_START_CHEATSHEET.md#creating-an-api-request-from-browser-console)

**"How do meetings get created?"**
→ [ARCHITECTURE_DESIGN.md - Meeting Lifecycle](ARCHITECTURE_DESIGN.md#meeting-lifecycle)

**"My Teams meetings aren't auto-generating, why?"**
→ [TROUBLESHOOTING_FAQ.md - Teams Issue](TROUBLESHOOTING_FAQ.md#issue-teams-meeting-link-fails-to-generate)

**"Sign in keeps redirecting back to the signin page"**
→ [TROUBLESHOOTING_FAQ.md - Sign In Redirect Issue](TROUBLESHOOTING_FAQ.md#issue-sign-in-with-microsoft-redirects-back-to-login-page)

**"How do I debug something?"**
→ [QUICK_START_CHEATSHEET.md - Debugging Tips](QUICK_START_CHEATSHEET.md#debugging-tips)

**"How do I deploy this?"**
→ [PROJECT_DOCUMENTATION.md - Deployment](PROJECT_DOCUMENTATION.md#deployment)

---

## File Organization

```
docs/
├── README.md                          # This file
├── QUICK_START_CHEATSHEET.md          # Quick start & reference
├── PROJECT_DOCUMENTATION.md           # Complete overview
├── ARCHITECTURE_DESIGN.md             # Technical architecture
├── API_REFERENCE.md                   # API endpoints
├── TROUBLESHOOTING_FAQ.md             # Troubleshooting & FAQ
├── environment_variables.md           # (existing) Env var details
├── deployment_checklist.md            # (existing) Deployment info
├── analysis_design.md                 # (existing) Initial analysis
├── project_proposal.md                # (existing) Project proposal
├── vercel_deployment_guide.md         # (existing) Vercel guide
├── ZOOM_DATA_USAGE.md                 # (existing) Zoom data info
└── ... (other docs)
```

---

## For Different Roles

### Project Manager

→ Read: [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)

- Features, roadmap, architecture overview

### Backend Developer

→ Read: [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md) + [API_REFERENCE.md](API_REFERENCE.md)

- API design, data models, integration details

### Frontend Developer

→ Read: [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) + [QUICK_START_CHEATSHEET.md](QUICK_START_CHEATSHEET.md)

- Features, components, development commands

### DevOps/Deployment

→ Read: [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) Deployment section + [TROUBLESHOOTING_FAQ.md](TROUBLESHOOTING_FAQ.md)

- Setup, environment variables, deployment

### Quality Assurance/Testing

→ Read: [API_REFERENCE.md](API_REFERENCE.md) Testing section + [TROUBLESHOOTING_FAQ.md](TROUBLESHOOTING_FAQ.md)

- API endpoints, test scenarios, common issues

### Security Reviewer

→ Read: [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md) Security section + [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md) Authentication Flow

- Security model, authentication, data protection

---

## Documentation Standards

### Version Info

- **Last Updated**: February 27, 2026
- **Project Version**: 0.1.0
- **Documentation Version**: 1.0

### How to Update Documentation

1. Make code changes
2. Update relevant documentation file
3. Note update in "Last Updated" date at bottom of file
4. Commit with both code and docs changes
5. Keep changes in sync

### Suggesting Improvements

- Issue on GitHub
- Pull request with changes
- Slack message to team
- Email to development team

---

## Navigation Tips

**Search**: Use Ctrl+F (or Cmd+F) to search within any document for keywords

**Links**: All markdown links are internal and should work in most readers

**Tables of Contents**: Each document starts with a table of contents for easy navigation

**Cross References**: Documents reference each other; follow relevant links for more info

---

## Troubleshooting Documentation

**"I can't find what I'm looking for"**

1. Try searching (Ctrl+F) for a keyword
2. Check the "Quick Links by Topic" section above
3. Check "Common Questions Answered" section
4. Browse the index to each document's table of contents

**"Documentation seems outdated"**

1. Check "Last Updated" date at bottom of file
2. Report if information is stale
3. Current as of February 27, 2026

**"I found an error in the docs"**

1. Note the file and section
2. Report to development team
3. Submit correction suggestion

---

## Version History

| Date         | Version | Changes                                   |
| ------------ | ------- | ----------------------------------------- |
| Feb 27, 2026 | 1.0     | Initial comprehensive documentation suite |

---

## Additional Resources

### Project Repository

- GitHub: [Link to repository]
- Issues: Report bugs
- Discussions: Ask questions

### External Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Microsoft Graph Documentation](https://docs.microsoft.com/graph)
- [Zoom API Documentation](https://developers.zoom.us/docs)

### Support

- Development Team Slack
- Project Email: [email]
- Direct Contact: [contact info]

---

## Getting Help

**Can't find answer?**

1. Check [TROUBLESHOOTING_FAQ.md](TROUBLESHOOTING_FAQ.md) first
2. Search all docs for keyword
3. Contact development team
4. Include: error message, steps taken, what you tried

---

## Quick Navigation

| Need               | Document                                               | Section       |
| ------------------ | ------------------------------------------------------ | ------------- |
| Get started fast   | [QUICK_START_CHEATSHEET.md](QUICK_START_CHEATSHEET.md) | Quick Start   |
| Understand project | [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)   | Overview      |
| Learn architecture | [ARCHITECTURE_DESIGN.md](ARCHITECTURE_DESIGN.md)       | Full document |
| Use APIs           | [API_REFERENCE.md](API_REFERENCE.md)                   | Endpoints     |
| Fix problem        | [TROUBLESHOOTING_FAQ.md](TROUBLESHOOTING_FAQ.md)       | Issues        |
| Setup OAuth        | [QUICK_START_CHEATSHEET.md](QUICK_START_CHEATSHEET.md) | OAuth Setup   |
| Deploy             | [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)   | Deployment    |

---

Last Updated: February 27, 2026
