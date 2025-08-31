# Pomera Care LLC - Medical Staffing Platform

A modern, responsive web application for medical staffing services built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Healthcare Professional Portal**: Job search and application system
- **Client Portal**: Healthcare facility management and staffing requests
- **CRM System**: Lead management and business development tools
- **Admin Dashboard**: Comprehensive system administration
- **Responsive Design**: Mobile-first approach with modern UI/UX

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **UI Components**: Radix UI, Lucide React Icons
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: GitHub Pages (Static Export)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pomera-new-hahmed.git
cd pomera-new-hahmed
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

### Local Build
```bash
npm run build
```

This creates a static export in the `out/` directory.

### Static Export (for GitHub Pages)
```bash
npm run build:static
```

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "GitHub Actions"

2. **Push to Main Branch**:
   The GitHub Actions workflow will automatically:
   - Build the project
   - Deploy to GitHub Pages
   - Update on every push to main branch

### Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   - The static files are in the `out/` directory
   - Upload these files to your GitHub Pages branch
   - Or use the GitHub CLI: `gh pages --dist out`

### GitHub Actions Workflow

The project includes a `.github/workflows/deploy.yml` file that:
- Triggers on pushes to main branch
- Builds the Next.js application
- Exports static files
- Deploys to GitHub Pages automatically

## Project Structure

```
pomera-new-hahmed/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── crm/               # CRM system
│   ├── portal/            # Client/Professional portals
│   └── page.tsx           # Home page
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components
│   └── ...                # Feature-specific components
├── lib/                    # Utility functions and configurations
├── database/               # Database schemas and migrations
├── public/                 # Static assets
└── out/                    # Static export (generated)
```

## Configuration

### Next.js Configuration

The project is configured for static export in `next.config.ts`:
- `output: 'export'` - Enables static export
- `trailingSlash: true` - Required for GitHub Pages
- `images: { unoptimized: true }` - Required for static export
- `basePath` - Set to repository name for GitHub Pages

### Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:static` - Build static export
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run deploy` - Build and prepare for deployment

## Troubleshooting

### Build Issues

1. **TypeScript Errors**: Ensure all dependencies are installed
2. **ESLint Errors**: Check the ESLint configuration
3. **Missing Components**: Verify all UI components are properly exported

### Deployment Issues

1. **404 Errors**: Ensure `basePath` is correctly set in `next.config.ts`
2. **Static Export Fails**: Check that all pages are compatible with static export
3. **GitHub Actions Fail**: Verify workflow file permissions and repository settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for Pomera Care LLC.

## Support

For support and questions, please contact the development team or create an issue in the repository.
