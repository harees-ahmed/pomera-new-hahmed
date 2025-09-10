@echo off
REM Pomera CRM - GitHub Pages Setup Script for Windows
REM This script helps set up the repository for GitHub Pages deployment

echo 🚀 Setting up Pomera CRM for GitHub Pages deployment...

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Error: Not in a git repository. Please run this script from the project root.
    pause
    exit /b 1
)

REM Check if GitHub remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: No GitHub remote found. Please add your GitHub repository as origin.
    echo    Run: git remote add origin https://github.com/yourusername/pomera-new-hahmed.git
    pause
    exit /b 1
)

echo ✅ Git repository detected

REM Build the application
echo 🔨 Building application...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed. Please check your environment variables and dependencies.
    pause
    exit /b 1
)

echo ✅ Build successful

REM Create .nojekyll file
echo 📄 Creating .nojekyll file...
echo. > out\.nojekyll
echo ✅ .nojekyll file created

REM Check if environment variables are set
echo 🔍 Checking environment variables...
if "%NEXT_PUBLIC_SUPABASE_URL%"=="" (
    echo ⚠️  Warning: NEXT_PUBLIC_SUPABASE_URL not set locally.
) else (
    echo ✅ NEXT_PUBLIC_SUPABASE_URL detected
)

if "%NEXT_PUBLIC_SUPABASE_ANON_KEY%"=="" (
    echo ⚠️  Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY not set locally.
) else (
    echo ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY detected
)

echo.
echo 🎉 Setup complete! Next steps:
echo.
echo 1. Push your changes to GitHub:
echo    git add .
echo    git commit -m "Configure for GitHub Pages deployment"
echo    git push origin main
echo.
echo 2. Enable GitHub Pages in your repository settings:
echo    - Go to Settings ^> Pages
echo    - Set Source to 'GitHub Actions'
echo    - Save the settings
echo.
echo 3. Add environment variables to GitHub Secrets:
echo    - Go to Settings ^> Secrets and variables ^> Actions
echo    - Add NEXT_PUBLIC_SUPABASE_URL
echo    - Add NEXT_PUBLIC_SUPABASE_ANON_KEY
echo.
echo 4. Your site will be available at:
echo    https://yourusername.github.io/pomera-new-hahmed
echo.
echo 5. For development, use GitHub Codespaces:
echo    - Open your repository in GitHub
echo    - Click 'Code' ^> 'Codespaces' ^> 'Create codespace'
echo    - Run: npm run dev
echo.
echo 📚 For more details, see DEPLOYMENT_GUIDE.md
pause
