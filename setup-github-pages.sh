#!/bin/bash

# Pomera CRM - GitHub Pages Setup Script
# This script helps set up the repository for GitHub Pages deployment

echo "🚀 Setting up Pomera CRM for GitHub Pages deployment..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this script from the project root."
    exit 1
fi

# Check if GitHub remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Error: No GitHub remote found. Please add your GitHub repository as origin."
    echo "   Run: git remote add origin https://github.com/yourusername/pomera-new-hahmed.git"
    exit 1
fi

echo "✅ Git repository detected"

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please check your environment variables and dependencies."
    exit 1
fi

# Create .nojekyll file
echo "📄 Creating .nojekyll file..."
touch out/.nojekyll
echo "✅ .nojekyll file created"

# Check if environment variables are set
echo "🔍 Checking environment variables..."
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "⚠️  Warning: Environment variables not set locally."
    echo "   Make sure to set them in GitHub Secrets:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
else
    echo "✅ Environment variables detected"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Push your changes to GitHub:"
echo "   git add ."
echo "   git commit -m 'Configure for GitHub Pages deployment'"
echo "   git push origin main"
echo ""
echo "2. Enable GitHub Pages in your repository settings:"
echo "   - Go to Settings > Pages"
echo "   - Set Source to 'GitHub Actions'"
echo "   - Save the settings"
echo ""
echo "3. Add environment variables to GitHub Secrets:"
echo "   - Go to Settings > Secrets and variables > Actions"
echo "   - Add NEXT_PUBLIC_SUPABASE_URL"
echo "   - Add NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "4. Your site will be available at:"
echo "   https://yourusername.github.io/pomera-new-hahmed"
echo ""
echo "5. For development, use GitHub Codespaces:"
echo "   - Open your repository in GitHub"
echo "   - Click 'Code' > 'Codespaces' > 'Create codespace'"
echo "   - Run: npm run dev"
echo ""
echo "📚 For more details, see DEPLOYMENT_GUIDE.md"
