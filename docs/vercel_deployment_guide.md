# Deployment Guide for KEMRI Meeting Portal on Vercel

This guide explains how to deploy the KEMRI Meeting Portal application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (you can sign up with GitHub)
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Required environment variables ready (see [Environment Variables Documentation](./environment_variables.md))

## Deployment Steps

### 1. Connect Your Repository to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your Git repository from GitHub, GitLab, or Bitbucket
4. Select the repository containing the KEMRI Meeting Portal

### 2. Configure Project Settings

1. **Framework Preset**: Select "Next.js"
2. **Root Directory**: Keep as default if your project is at the repository root
3. **Build Command**: Use default (`next build`)
4. **Install Command**: Use default (`npm install` or `yarn install`)
5. **Output Directory**: Keep as default
6. **Node.js Version**: Set to Node.js 18.x or higher (the default is usually fine)

### 3. Environment Variables

Add the following environment variables to your Vercel project:

| Variable Name     | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `NEXTAUTH_URL`    | Set to your Vercel deployment URL (e.g., `https://your-project.vercel.app`) |
| `NEXTAUTH_SECRET` | A strong random string for JWT encryption (at least 32 characters)          |

Add any other optional variables as needed for your specific deployment (see [Environment Variables Documentation](./environment_variables.md))

### 4. Deploy

1. Click "Deploy"
2. Wait for the build process to complete

### Alternative: Deploy using Vercel CLI

If you prefer using the command line:

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. Deploy from your project directory:

   ```bash
   vercel
   ```

4. Follow the interactive prompts to configure your project

5. To deploy to production:
   ```bash
   vercel --prod
   ```

### 5. Verify Deployment

1. Once deployment is complete, click on the generated URL to view your application
2. Test all major functionality:
   - User authentication
   - Meeting creation and management
   - Email notifications (if configured)
   - Integration with video conferencing platforms

### 6. Custom Domain (Optional)

To use a custom domain:

1. Go to your project in the Vercel dashboard
2. Click on "Settings" > "Domains"
3. Add your custom domain and follow the provided instructions to configure DNS records

## Troubleshooting

If you encounter issues during deployment:

1. **Build Failures**:

   - Check the build logs in the Vercel dashboard
   - Ensure all dependencies are correctly specified in `package.json`
   - Verify that your Next.js configuration is correct

2. **Runtime Errors**:

   - Check if all required environment variables are set correctly
   - Look for errors in the Function Logs in the Vercel dashboard

3. **Authentication Issues**:

   - Ensure `NEXTAUTH_URL` is set to your production URL
   - Verify that OAuth redirect URIs are configured correctly in Google/Microsoft developer consoles

4. **Database Connectivity**:
   - Verify your MongoDB connection string is correct (if using MongoDB)
   - Check network access settings in your database service

## Continuous Integration/Deployment

Vercel automatically sets up continuous deployment from your Git repository. Any push to the main/master branch will trigger a new deployment.

If you want to set up preview deployments for pull requests:

1. Go to your project settings in Vercel
2. Under "Git" section, enable "Preview Deployments" for pull requests

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/) (if using MongoDB)
- [NextAuth.js Documentation](https://next-auth.js.org/)
