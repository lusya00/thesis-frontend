# Production Setup Guide

## 🚀 Production Deployment Configuration

### Environment Variables

Create a `.env.production` file for production builds:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.untungjawa.com/api

# Debug Settings - DISABLE for production
VITE_DEBUG_API=false

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id

# Payment Configuration  
VITE_XENDIT_PUBLIC_KEY=your_production_xendit_key
```

### Console Logging Removal

The app automatically removes console logs in production builds through:

1. **Vite Configuration** (`vite.config.ts`):
   - Esbuild drops `console` and `debugger` statements in production mode
   - Only applies when `mode === 'production'`

2. **API Debug Flag** (`src/services/apiConfig.ts`):
   - `DEBUG_API` is automatically disabled in production unless explicitly enabled
   - Set `VITE_DEBUG_API=false` to ensure no API logs

### Building for Production

```bash
# Install dependencies
npm install

# Build for production (automatically removes console logs)
npm run build

# Preview production build locally
npm run preview
```

### Production Checklist

- [ ] Set `VITE_DEBUG_API=false` in environment variables
- [ ] Update API URLs to production endpoints
- [ ] Configure production OAuth credentials
- [ ] Set production payment gateway keys
- [ ] Test build with `npm run build`
- [ ] Verify no console logs in browser developer tools

### Translation System

✅ **Fully Configured**
- English and Bahasa Indonesia support
- Homestay cards now use proper translations
- All UI components support language switching
- Persistent language selection in localStorage

### Performance Optimizations

- Code splitting with manual chunks
- Lazy loading for heavy components
- Optimized bundle sizes
- Source maps disabled in production
- Console logs removed automatically

### Deployment

The built files in `dist/` folder are ready for deployment to any static hosting service:
- Vercel
- Netlify  
- AWS S3 + CloudFront
- Traditional web servers

### Environment-Specific Builds

```bash
# Development build (keeps console logs)
npm run dev

# Production build (removes console logs)
npm run build

# Production preview
npm run preview
``` 