# Deployment Guide for KEMRI Meeting Portal on Vercel

This guide explains how to deploy the KEMRI Meeting Portal application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Git repository with your project (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy using Vercel Dashboard

1. Log in to your Vercel account
2. Click "Add New..." and select "Project"
3. Import the Git repository containing your KEMRI Meeting Portal project
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
5. Add Environment Variables:
   ```
   NEXTAUTH_URL=https://your-vercel-domain.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret
   GOOGLE_ID=your-production-google-client-id
   GOOGLE_SECRET=your-production-google-client-secret
   AZURE_AD_CLIENT_ID=your-production-microsoft-client-id
   AZURE_AD_CLIENT_SECRET=your-production-microsoft-client-secret
   AZURE_AD_TENANT_ID=your-production-microsoft-tenant-id
   ZOOM_API_KEY=your-production-zoom-api-key
   ZOOM_API_SECRET=your-production-zoom-api-secret
   ZOOM_HOST_EMAIL=your-production-zoom-account-email
   SENDGRID_API_KEY=your-production-sendgrid-api-key
   EMAIL_FROM=your-production-sender-email
   ```
6. Click "Deploy"

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to preview environment:
   ```bash
   vercel
   ```

4. Add Environment Variables:
   ```bash
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add GOOGLE_ID
   vercel env add GOOGLE_SECRET
   vercel env add AZURE_AD_CLIENT_ID
   vercel env add AZURE_AD_CLIENT_SECRET
   vercel env add AZURE_AD_TENANT_ID
   vercel env add ZOOM_API_KEY
   vercel env add ZOOM_API_SECRET
   vercel env add ZOOM_HOST_EMAIL
   vercel env add SENDGRID_API_KEY
   vercel env add EMAIL_FROM
   ```

5. Deploy to production:
   ```bash
   vercel --prod
   ```

## Post-Deployment

After deployment, make sure to:

1. Update the `NEXTAUTH_URL` environment variable to match your deployment URL
2. Test authentication flows
3. Test the Zoom meeting creation
4. Test email notifications
5. Monitor your application using Vercel Analytics

## Database Migration

The current implementation uses JSON file storage. For production, consider migrating to a database solution:

1. Create a MongoDB Atlas account or other database service
2. Update the connection strings in your environment variables
3. Update the storage implementation in your application

## Troubleshooting

If you encounter deployment issues:

1. Check Vercel build logs for errors
2. Verify all environment variables are correctly set
3. Ensure your repository is using the correct Next.js version
4. Check that all dependencies are properly installed

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
