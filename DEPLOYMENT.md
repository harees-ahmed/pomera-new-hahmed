# GitHub Pages Deployment Guide

This guide will walk you through deploying your Pomera Care application to GitHub Pages.

## Prerequisites

- A GitHub account
- Your project pushed to a GitHub repository
- GitHub Pages enabled on your repository

## Step 1: Enable GitHub Pages

1. Go to your GitHub repository
2. Click on "Settings" tab
3. Scroll down to "Pages" section in the left sidebar
4. Under "Source", select "GitHub Actions"
5. Click "Save"

## Step 2: Configure Repository Secrets (Optional)

If you need environment variables for your application:

1. Go to "Settings" → "Secrets and variables" → "Actions"
2. Add the following secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Step 3: Push to Main Branch

The GitHub Actions workflow will automatically trigger when you push to the main branch:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

## Step 4: Monitor Deployment

1. Go to "Actions" tab in your repository
2. You should see a workflow running called "Deploy to GitHub Pages"
3. Wait for it to complete (usually takes 2-5 minutes)
4. Check the "Deploy" step for the deployment URL

## Step 5: Access Your Site

Your site will be available at:
```
https://yourusername.github.io/pomera-new-hahmed/
```

## Manual Deployment (Alternative)

If you prefer manual deployment:

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Deploy using GitHub CLI**:
   ```bash
   npm install -g gh
   gh auth login
   gh pages --dist out
   ```

3. **Or manually upload**:
   - Go to your repository settings → Pages
   - Set source to a specific branch
   - Upload the contents of the `out/` directory to that branch

## Troubleshooting

### Common Issues

1. **404 Errors**: 
   - Ensure `basePath` in `next.config.ts` matches your repository name
   - Check that the GitHub Actions workflow completed successfully

2. **Build Failures**:
   - Check the Actions tab for error details
   - Verify all dependencies are properly installed
   - Ensure TypeScript compilation passes locally

3. **Environment Variables**:
   - Add required secrets in repository settings
   - Verify the workflow can access them

### Workflow Failures

If the GitHub Actions workflow fails:

1. Check the Actions tab for detailed error logs
2. Verify the workflow file (`.github/workflows/deploy.yml`) is correct
3. Ensure the repository has proper permissions for GitHub Actions

## Updating Your Site

To update your deployed site:

1. Make your changes locally
2. Test with `npm run build`
3. Commit and push to main branch
4. The workflow will automatically redeploy

## Performance Optimization

- The static export is optimized for GitHub Pages
- Images are unoptimized for compatibility
- Consider using a CDN for better performance
- Monitor Core Web Vitals in GitHub Pages analytics

## Security Notes

- Environment variables in GitHub Pages are public
- Only use `NEXT_PUBLIC_` prefixed variables
- Sensitive data should be handled server-side
- Consider using environment-specific configurations

## Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Verify your Next.js configuration
3. Test the build locally first
4. Create an issue in the repository

## Next Steps

After successful deployment:

1. Set up a custom domain (optional)
2. Configure analytics
3. Set up monitoring
4. Plan for scaling
## Step 4: Monitor Deployment

The GitHub Actions workflow will:
1. Build your Next.js application
2. Export static files
3. Deploy to GitHub Pages

You can monitor the progress in the Actions tab of your repository.

## Step 5: Access Your Site

Once deployment is complete, your site will be available at:
https://[username].github.io/pomera-new-hahmed

## Configuration Details

### Next.js Configuration
The project is configured for static export in 
ext.config.ts:
- output: 'export' - Enables static export
- 	railingSlash: true - Required for GitHub Pages
- asePath: '/pomera-new-hahmed' - Matches repository name
- images: { unoptimized: true } - Required for static export

### Build Process
The build process creates a static out/ directory containing:
- HTML files for each page
- JavaScript bundles
- CSS files
- Static assets

### GitHub Actions Workflow
Located at .github/workflows/deploy.yml, this workflow:
- Triggers on push to main branch
- Sets up Node.js 18 environment
- Installs dependencies
- Builds the project
- Deploys to GitHub Pages

## Troubleshooting

### Common Issues
1. **Build fails**: Check GitHub Actions logs for errors
2. **Site not accessible**: Ensure GitHub Pages is enabled
3. **Missing assets**: Verify base path configuration
4. **Environment variables**: Check if secrets are properly configured

### Local Testing
Test your build locally before pushing:
`ash
npm run build
npx serve out
`

## Notes

- This is a static export deployment, so server-side features won't work
- All Supabase interactions must be client-side only
- API routes are not available in static export
- The site will be served from a subdirectory matching your repository name
