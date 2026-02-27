# KEMRI Meeting Portal - Troubleshooting & FAQ Guide

## Table of Contents

1. [Frequently Asked Questions](#frequently-asked-questions)
2. [Authentication Issues](#authentication-issues)
3. [Meeting Creation Issues](#meeting-creation-issues)
4. [Integration Issues](#integration-issues)
5. [Database Issues](#database-issues)
6. [Deployment Issues](#deployment-issues)
7. [Performance Issues](#performance-issues)
8. [Browser Compatibility](#browser-compatibility)

---

## Frequently Asked Questions

### General

**Q: What is the KEMRI Meeting Portal?**
A: It's a web application for managing meetings, supporting Zoom and Microsoft Teams integration with automatic meeting link generation.

**Q: What platforms are supported?**
A: Currently supports Zoom and Microsoft Teams. Calendar integration and other platforms are planned.

**Q: Can I create meetings without invites?**
A: Yes. Meetings can be public (anyone with link) or restricted (invite-only). Default is public.

**Q: How long are meetings stored?**
A: Indefinitely. Historical records are kept. You can manually delete meetings.

**Q: Can I export meeting data?**
A: Currently no export feature. This is planned for future versions.

**Q: What time zones are supported?**
A: All UTC times internally. Browser displays in local timezone.

### Features

**Q: Can I schedule recurring meetings?**
A: Not yet. Each meeting must be created individually. Recurring meetings are planned.

**Q: Can I record meetings through the portal?**
A: No. Use Zoom or Teams native recording features during the meeting.

**Q: Can I integrate with Google Calendar?**
A: Not yet. This is on the roadmap.

**Q: Can I send reminders to attendees?**
A: Email invites are sent at creation time. Automatic reminders are not yet implemented.

**Q: Can multiple organizers edit a meeting?**
A: No. Only the original creator can edit. We may add co-organizers in future versions.

### Technical

**Q: Where is my data stored?**
A: By default, in a local JSON file (`data/meetings.json`). For production, use MongoDB.

**Q: Is my data encrypted?**
A: Database: No. Use MongoDB Atlas for production encryption.
Session JWT: Yes, cryptographically signed.
Passwords: Yes, hashed with bcrypt.

**Q: How many meetings can I create?**
A: No limit set. Depends on storage capacity. File storage limited to reasonable size (recommend <50MB).

**Q: Is the API rate limited?**
A: External APIs (Zoom, Teams, SendGrid) have their own limits. No internal rate limiting currently.

---

## Authentication Issues

### Issue: "Sign in with Microsoft" redirects back to login page

**Symptoms**:

- Click "Sign in with Microsoft"
- Enter credentials and 2FA code
- Redirected back to sign-in page
- Message: auth error or blank

**Possible Causes**:

1. `NEXTAUTH_URL_INTERNAL` is incorrect
2. Redirect URI mismatch in Azure AD
3. Client secret is invalid/expired
4. Browser cookies are blocked

**Solutions** (try in order):

1. **Verify NEXTAUTH_URL_INTERNAL**

```bash
# Check .env.local
cat .env.local | grep NEXTAUTH_URL
# Should show:
# NEXTAUTH_URL_INTERNAL=http://localhost:3001
```

- Fix if missing port number
- Restart server after changing

2. **Check Azure AD Configuration**
   - Go to Azure Portal → App Registration
   - Select your app
   - Click "Redirect URIs"
   - Verify it includes: `http://localhost:3001/api/auth/callback/azure-ad`
   - For production: `https://yourdomain.com/api/auth/callback/azure-ad`

3. **Regenerate Client Secret** (if expired)
   - In Azure Portal → Certificates & Secrets
   - Click "New client secret"
   - Copy the VALUE (not the ID)
   - Update `AZURE_AD_CLIENT_SECRET` in `.env.local`
   - **Important**: Copy before leaving page (it hides after)
   - Restart server

4. **Check Browser Cookies**
   - Open DevTools → Application → Cookies
   - Delete cookies for localhost:3001
   - Try signing in again in private/incognito window

5. **Review NextAuth Debug Logs**
   - Temporarily add to route handler:
   ```javascript
   console.log("Auth error:", error);
   console.log("Environment:", {
   	NEXTAUTH_URL: process.env.NEXTAUTH_URL,
   	NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL,
   });
   ```

   - Check terminal for details

---

### Issue: "Invalid client secret provided"

**Symptoms**:

- Error message during Microsoft sign-in
- Or when trying to create Teams meetings

**Cause**: Client secret is incorrect, expired, or has changed

**Solution**:

1. Go to Azure Portal
2. App Registration → Certificates & Secrets
3. Check if current secret has expiration date
4. If expired, create new secret:
   - Click "New client secret"
   - Set expiration to further in future (e.g., 2 years)
   - **Copy the VALUE immediately** (copy button next to value)
   - Paste into `.env.local`: `AZURE_AD_CLIENT_SECRET=<value>`
5. Delete old secret if there are multiple
6. Restart dev server: `npm run dev`

---

### Issue: "Cannot read properties of undefined (reading 'user')"

**Symptoms**:

- White page or error on dashboard
- Console shows session is undefined

**Cause**: Session not loading properly

**Solutions**:

1. Check if authenticated:
   - Visit `http://localhost:3001/auth/signin`
   - Sign in again
2. Verify SessionProvider wrapper:
   - Check [src/app/layout.js](src/app/layout.js)
   - Should have `<SessionProvider>` wrapper
   - Should import from `components/SessionProvider.js`

3. Clear all cookies:
   ```javascript
   // In browser console:
   document.cookie
   	.split(";")
   	.forEach(
   		(c) =>
   			(document.cookie =
   				c.split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC"),
   	);
   ```
   Then refresh and sign in again

---

### Issue: Sessions expire too quickly or too slowly

**Configuration**:

- Max age: 30 days (edit in [src/app/api/auth/[...nextauth]/route.js](src/app/api/auth/[...nextauth]/route.js))
- Update age: 24 hours (refresh interval)

**To change**:

```javascript
// In route.js, session callback:
callbacks: {
  session({ session, token }) {
    // Modify token.exp for expiration
    return session;
  },
  jwt({ token }) {
    // token.exp controls JWT expiration
    // Default: 30 days = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
    return token;
  }
}
```

---

## Meeting Creation Issues

### Issue: Zoom meeting link not generated

**Symptoms**:

- Create meeting with Zoom platform
- No link in response
- Error about "Failed to create Zoom meeting"

**Possible Causes**:

1. Zoom API credentials invalid
2. Zoom account doesn't have API access
3. Network connectivity issue

**Solutions**:

1. **Verify Zoom Credentials**

```bash
# Check .env.local
grep ZOOM .env.local
# Should show:
# ZOOM_API_KEY=xxx
# ZOOM_API_SECRET=yyy
# ZOOM_ACCOUNT_ID=zzz
```

2. **Test Zoom API Connection**
   - Go to [https://marketplace.zoom.us](https://marketplace.zoom.us)
   - Click "Sign in"
   - Navigate to Applications
   - Find your JWT application
   - Check if it's activated
   - Verify API key and secret match `.env.local`

3. **Check API Key Expiration**
   - In Zoom Marketplace, click on your app
   - Check "App Credentials" section
   - Regenerate if needed
   - Update `.env.local`
   - Restart server

4. **Verify Account Type**
   - Zoom API requires Pro or Business account minimum
   - Contact Zoom sales if on Basic plan
   - Check account status here: https://zoom.us/account

5. **Check Network/Firewall**
   - Ensure outbound HTTPS to zoom.us is allowed
   - Test: `curl -v https://zoom.us`

6. **Review Server Logs**
   ```bash
   # When creating meeting, check terminal output
   npm run dev
   # Look for error messages about Zoom API
   ```

---

### Issue: Teams meeting link fails to generate

**Symptoms**:

- Platform is Teams
- Trying to auto-generate link
- Error: 403 Forbidden or similar

**Possible Causes**:

1. Missing `OnlineMeetings.ReadWrite` permission
2. User account doesn't have Teams license
3. Token doesn't have Teams scope

**Solutions** (try in order):

1. **Grant Permission in Azure Portal**
   - Go to Azure Portal → App Registrations
   - Select your app
   - Click "API Permissions"
   - Check for `OnlineMeetings.ReadWrite`
   - If missing: "Add a permission" → "Microsoft Graph" → look for it
   - Click "Grant admin consent"
   - Wait for green checkmark

2. **Check Azure AD Scope**
   - Verify [src/app/api/auth/[...nextauth]/route.js](src/app/api/auth/[...nextauth]/route.js)
   - Azure provider should have:

   ```javascript
   authorization: {
   	params: {
   		scope: "openid profile email https://graph.microsoft.com/.default";
   	}
   }
   ```

3. **Sign Out and Back In**
   - Sign out: http://localhost:3001/api/auth/signout
   - Sign in again to refresh tokens
   - Try creating Teams meeting

4. **Check User's Teams License**
   - Have user check: https://teams.microsoft.com
   - Ensure they can create meetings manually
   - If not, they need Teams license from admin

5. **Fallback**
   - If auto-generation fails, manually paste Teams link
   - The form allows manual entry
   - Meeting will still be created without auto-link

---

### Issue: "Request failed with status code 400"

**Symptoms**:

- Error when creating meeting
- Form shows validation error

**Possible Causes**:

1. Required field missing
2. Date is in the past
3. Invalid field format

**Solutions**:

1. **Check all required fields**:
   - ✓ Title (required)
   - ✓ Date/Time (required)
   - ✓ Platform (required)
   - Optional: Description, attendees, meeting link

2. **Verify date is in future**:
   - Current time: Check browser clock
   - Meeting time: Must be after current time
   - Example: If it's Feb 27 10:00 AM, meeting must be after that

3. **Valid platforms**:
   - "zoom" or "teams" (lowercase)

4. **Review browser console**:
   - Open DevTools (F12)
   - Go to Network tab
   - Click on failed request
   - Check Request/Response tab for details

---

### Issue: "Meeting created but Teams link is empty"

**Symptoms**:

- Form shows success
- Meeting created in list
- No Teams link (null or empty)

**This is expected behavior**:

- Teams auto-generation attempted but failed
- Graceful fallback allows meeting creation
- You can manually add Teams link by editing

**To fix**:

1. Create Teams meeting manually:
   - Open Teams
   - Calendar → New meeting
   - Copy join link
2. Edit meeting in portal:
   - Click meeting
   - Click "Edit"
   - Paste Teams link
   - Save

---

## Integration Issues

### Issue: Emails not being sent to attendees

**Symptoms**:

- Meeting created with attendees
- No email received by attendees
- No error message shown

**Possible Causes**:

1. SendGrid API key invalid
2. Sender email not authorized
3. Attendees list empty

**Solutions**:

1. **Verify SendGrid API Key**

```bash
grep SENDGRID .env.local
# Should show: SENDGRID_API_KEY=SG.xxx...
```

- Check [SendGrid Dashboard](https://app.sendgrid.com)
- Go to API Keys
- Verify key is active
- If revoked, create new one

2. **Authorize Sender Email**
   - SendGrid → Settings → Sender Verification
   - Verify "noreply@kemri.go.ke" (or your sender email)
   - May need domain verification for production

3. **Check Attendees List**
   - In meeting creation form
   - Is attendees field filled?
   - Must be valid email addresses
   - Must have checkmark next to each

4. **Enable Restricted Mode**
   - Must have `isRestrictive: true` to send invites
   - In form: Check "Restrict Access (Invite-only)"

5. **Check SendGrid Activity**
   - Go to SendGrid Dashboard → Mail Send
   - Look for failed sends
   - Check if messages queued or bounced
   - Review bounce reasons

6. **Test Direct API**

```javascript
// In browser console:
await fetch("/api/meetings", {
	method: "POST",
	credentials: "include",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		title: "Test",
		dateTime: new Date(Date.now() + 86400000).toISOString(),
		platform: "zoom",
		attendees: ["test@example.com"],
		isRestrictive: true,
	}),
})
	.then((r) => r.json())
	.then((d) => console.log(d));
```

---

## Database Issues

### Issue: "ENOENT: no such file or directory, open 'data/meetings.json'"

**Symptoms**:

- Creating first meeting fails
- Error mentions missing file
- File path: `data/meetings.json`

**Cause**: Directory doesn't exist for file-based storage

**Solutions**:

1. **Create directory manually**:

```bash
mkdir -p data
```

2. **Or use MongoDB** (recommended):
   - Install MongoDB locally or use cloud
   - Set `MONGODB_URI` in `.env.local`
   - MongoDB will auto-create database

3. **Verify write permissions**:

```bash
# Check if you can write to data folder
ls -la data/
touch data/test.txt
rm data/test.txt
```

---

### Issue: "Cannot connect to MongoDB"

**Symptoms**:

- Error about MongoDB connection
- App runs but meetings don't save
- Message: "MongooseError" or "ECONNREFUSED"

**Solutions**:

1. **For local MongoDB**:

```bash
# Start MongoDB server
# On Windows:
"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
# On Mac:
brew services start mongodb-community
# On Linux:
sudo systemctl start mongod
```

2. **For MongoDB Atlas** (cloud):
   - Go to [MongoDB Atlas](https://account.mongodb.com)
   - Create project (free)
   - Create cluster (M0 free tier)
   - Click "Connect"
   - Choose "Connect your application"
   - Copy URI
   - Update `.env.local`:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kemri?retryWrites=true&w=majority
   ```

   - Replace `username` and `password`

3. **Whitelist IP Address** (for Atlas):
   - In Atlas dashboard → Network Access
   - Add IP address (or 0.0.0.0 for anywhere)
   - Wait for whitelist to update

4. **Test connection**:

```bash
# In Node REPL
node
> const mongoose = require('mongoose');
> mongoose.connect(process.env.MONGODB_URI);
> console.log('Connected:', mongoose.connection.readyState);
```

---

### Issue: "Duplicate key error" when creating meetings

**Symptoms**:

- Occasionally get error when creating meeting
- Error mentions duplicate key

**Cause**: MongoDB index or race condition

**Solutions**:

1. Drop and recreate database:

```bash
# If using local MongoDB
mongo
> db.meetings.drop()
> exit
```

2. Check MongoDB indexes:

```bash
# In MongoDB shell
db.meetings.getIndexes()
# Should see: _id only
# If multiple, drop unwanted ones:
db.meetings.dropIndex("indexName")
```

---

## Deployment Issues

### Issue: "Port 3000 is already in use" during startup

**Symptoms**:

- `npm run dev` fails
- Message: "Port 3000 is in use"

**Solutions**:

1. **Use different port**:

```bash
# Set PORT environment variable
PORT=3001 npm run dev
```

2. **Kill process using port** (Windows):

```powershell
# Find what's using port 3000
netstat -ano | findstr :3000
# Kill it (replace PID):
taskkill /PID <PID> /F
# Then run:
npm run dev
```

3. **Kill process using port** (Mac/Linux):

```bash
# Find and kill
lsof -i :3000
kill -9 <PID>
npm run dev
```

---

### Issue: Vercel deployment fails

**Symptoms**:

- Build fails on Vercel
- Error in Vercel dashboard

**Solutions**:

1. **Build succeeds locally but fails on Vercel**:
   - Likely missing environment variables
   - Go to Vercel → Project Settings → Environment Variables
   - Add all variables from `.env.local`:
     - NEXTAUTH_SECRET
     - NEXTAUTH_URL
     - GOOGLE_ID / GOOGLE_SECRET
     - AZURE_AD_CLIENT_ID / SECRET / TENANT_ID
     - ZOOM_API_KEY / SECRET / ACCOUNT_ID
     - SENDGRID_API_KEY
     - MONGODB_URI

2. **Build times out**:
   - Check for infinite loops in build
   - Review build logs for hanging requests
   - May need to increase build time in vercel.json

3. **Databases not found**:
   - Ensure MongoDB Atlas connection string is set
   - Check IP whitelist includes Vercel servers (or use 0.0.0.0)

---

## Performance Issues

### Issue: Meeting creation takes >10 seconds

**Symptoms**:

- Form submission hangs
- Finally shows success after long wait

**Causes**:

- Teams API call is slow or timing out
- Network latency to Microsoft Graph

**Solutions**:

1. **Use Zoom instead**:
   - Zoom is faster and more reliable
   - Zoom typically <2 seconds
   - Teams may take 5-10 seconds

2. **Implement async sending** (technical):
   - Create meeting immediately
   - Send Team meeting generation in background
   - Return meeting without waiting for Teams link

3. **Check network**:
   - Opening DevTools → Network
   - Monitor what requests are slow
   - Check latency to graph.microsoft.com

---

### Issue: Dashboard/List meeting is slow

**Symptoms**:

- Dashboard takes a long time to load
- Lots of meetings in list

**Solutions**:

1. **Use pagination** (if implemented):

```javascript
// Get limited set of meetings
/api/meetings?limit=20&skip=0
```

2. **Reduce meetings** (if possible):
   - Delete old meetings
   - Archive meetings to separate collection

3. **Optimize database** (MongoDB):
   - Create index on `organizer`:
   ```javascript
   db.meetings.createIndex({ organizer: 1 });
   ```

---

## Browser Compatibility

### Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Known Issues

**Issue**: OAuth redirects don't work in private window

**Solution**: Use regular window for auth, not private/incognito

---

**Issue**: Calendar display is broken in Safari

**Solution**: May need CSS fix, report to development team

---

## Getting Help

### Steps Before Contacting Support

1. Check this troubleshooting guide
2. Review environment variables (.env.local)
3. Clear browser cookies and cache
4. Try private/incognito window
5. Restart development server
6. Check browser console for errors (F12)
7. Check terminal logs for backend errors

### Information to Include When Reporting

- Error message (complete)
- Browser and version
- What were you doing when error occurred
- Screenshots or screen recording
- Relevant log output
- `.env.local` (with secrets redacted)
- Browser console errors (F12)

### Support Channels

- Development team internal Slack
- Project repository issues
- Direct contact: [contact info]

---

Last Updated: February 27, 2026
