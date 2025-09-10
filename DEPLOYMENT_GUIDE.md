# Pomera CRM - Deployment Guide

## Overview
This guide explains how to deploy the Pomera CRM application to GitHub Pages and run a development server on GitHub.

## Prerequisites
- GitHub repository with the code
- Supabase project with database configured
- GitHub Pages enabled in repository settings

## Quick Start

### 1. Set Up Environment Variables
Before deploying, you need to configure your Supabase credentials:

1. **Get Supabase Credentials:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Navigate to Settings > API
   - Copy the Project URL and anon/public key

2. **Add GitHub Secrets:**
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add these repository secrets:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Enable GitHub Pages
1. Go to your repository Settings
2. Scroll down to "Pages" section
3. Under "Source", select "GitHub Actions"
4. Save the settings

### 3. Deploy to GitHub Pages
The deployment happens automatically when you push to the main branch. The workflow will:
- Install dependencies
- Build the application
- Deploy to GitHub Pages

Your application will be available at:
`https://yourusername.github.io/pomera-new-hahmed`

## Development Server Options

### Option 1: GitHub Codespaces (Recommended)
1. Open your repository in GitHub
2. Click the "Code" button
3. Select "Codespaces" tab
4. Click "Create codespace on main"
5. Once the codespace is ready, run:
   ```bash
   npm install
   npm run dev
   ```
6. The development server will start on port 3000

### Option 2: Manual Workflow Trigger
1. Go to the Actions tab in your repository
2. Select "Development Server" workflow
3. Click "Run workflow"
4. The server will start and run in the background

## Project Structure

```
pomera-new-hahmed/
├── .github/workflows/          # GitHub Actions workflows
│   ├── deploy.yml              # GitHub Pages deployment
│   ├── dev-server.yml          # Development server
│   └── codespace-dev.yml       # Codespace setup
├── app/                        # Next.js app directory
├── components/                 # React components
├── lib/                        # Utilities and configurations
├── database/                   # Database schema
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
└── ENVIRONMENT_SETUP.md        # Environment setup guide
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run export` - Build and export static files
- `npm run deploy` - Build and prepare for GitHub Pages

## Configuration Details

### Next.js Configuration
The application is configured for static export to work with GitHub Pages:
- `output: 'export'` - Enables static export
- `trailingSlash: true` - Adds trailing slashes to URLs
- `basePath` and `assetPrefix` - Configured for GitHub Pages subdirectory

### GitHub Actions Workflows

#### Deploy Workflow (`deploy.yml`)
- Triggers on push to main branch
- Builds the application with production environment
- Deploys to GitHub Pages using `peaceiris/actions-gh-pages`

#### Development Server Workflow (`dev-server.yml`)
- Can be triggered manually or on code changes
- Starts the development server
- Keeps the server running for testing

#### Codespace Development Workflow (`codespace-dev.yml`)
- Sets up development environment in GitHub Codespaces
- Creates devcontainer configuration
- Provides startup scripts and documentation

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check that environment variables are set in GitHub Secrets
   - Verify Supabase credentials are correct
   - Check the Actions logs for detailed error messages

2. **GitHub Pages Not Updating**
   - Ensure GitHub Pages is enabled and set to "GitHub Actions"
   - Check that the workflow completed successfully
   - Wait a few minutes for the changes to propagate

3. **Supabase Connection Issues**
   - Verify your Supabase project is active
   - Check that the URL and key are correct
   - Ensure your Supabase project allows the GitHub Pages domain

4. **Static Export Issues**
   - Some Next.js features don't work with static export
   - Check the console for any dynamic import errors
   - Ensure all API routes are properly configured

### Getting Help
- Check the GitHub Actions logs for detailed error messages
- Review the Supabase dashboard for connection issues
- Verify all environment variables are properly set
- Check the Next.js documentation for static export limitations

## Security Notes

- Environment variables are securely stored in GitHub Secrets
- Supabase credentials are not exposed in the client-side code
- The application uses Supabase's built-in security features
- All database operations go through Supabase's secure API

## Maintenance

### Regular Updates
- Keep dependencies updated with `npm update`
- Monitor GitHub Actions for any workflow failures
- Check Supabase for any service updates or changes

### Monitoring
- GitHub Actions provides logs for all deployments
- Supabase dashboard shows database usage and performance
- GitHub Pages provides basic analytics for your site

## Support

For issues specific to:
- **Next.js**: Check the [Next.js documentation](https://nextjs.org/docs)
- **Supabase**: Check the [Supabase documentation](https://supabase.com/docs)
- **GitHub Actions**: Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
- **GitHub Pages**: Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
