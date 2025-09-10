# Environment Setup for Pomera CRM

## Required Environment Variables

This application requires the following environment variables to be set:

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### How to Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy the Project URL and anon/public key

### Setting Environment Variables

#### For Local Development
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

#### For GitHub Actions
1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following repository secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### For GitHub Codespaces
1. Open your repository in Codespaces
2. Go to Settings > Secrets and variables > Codespaces
3. Add the environment variables there

## Deployment Instructions

### GitHub Pages Deployment
1. Push your code to the main branch
2. The GitHub Actions workflow will automatically build and deploy to GitHub Pages
3. Your site will be available at: `https://yourusername.github.io/pomera-new-hahmed`

### Development Server on GitHub
1. Use GitHub Codespaces for the best development experience
2. Or manually trigger the development workflow from the Actions tab
3. The development server will run on port 3000

## Troubleshooting

### Common Issues
1. **Build fails**: Check that all environment variables are set correctly
2. **Supabase connection issues**: Verify your Supabase URL and key are correct
3. **Static export issues**: Ensure all dynamic features are properly configured for static export

### Getting Help
- Check the GitHub Actions logs for detailed error messages
- Verify your Supabase project is active and accessible
- Ensure all dependencies are properly installed
