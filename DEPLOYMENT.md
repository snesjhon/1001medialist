# Deployment Guide

This guide will help you deploy your 1001 Movies & Albums app.

## Prerequisites

Before deploying, ensure you have:

1. **Supabase project set up:**
   - Run the migration SQL (see SUPABASE_SETUP.md)
   - Configure Google OAuth
   - Note your project URL and keys

2. **API keys obtained:**
   - TMDB API key (for movies metadata)
   - Spotify Client ID and Secret (for albums metadata)

3. **Database populated:**
   - Complete the data seeding process (see scripts/README.md)
   - Ensure both albums and movies tables have data

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Site URL (update after deployment)
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key

# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

## Deploying to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the repository for this project

3. **Configure Environment Variables:**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add all variables from your `.env.local`
   - Make sure to set the correct `NEXT_PUBLIC_SITE_URL` to your Vercel domain

4. **Deploy:**
   ```bash
   vercel --prod
   ```
   Or simply push to your main branch (if auto-deploy is enabled)

5. **Update Supabase Redirect URL:**
   - Go to Supabase Dashboard > Authentication > URL Configuration
   - Add your Vercel URL to the redirect URLs:
     ```
     https://your-domain.vercel.app/auth/callback
     ```

6. **Update Google OAuth:**
   - Go to Google Cloud Console
   - Update authorized redirect URIs to include:
     ```
     https://<your-supabase-ref>.supabase.co/auth/v1/callback
     ```

## Post-Deployment Checklist

- [ ] Test sign in with Google
- [ ] Verify profile is created automatically
- [ ] Check if current pair loads correctly
- [ ] Test completing/skipping items
- [ ] Verify stats page displays correctly
- [ ] Test history page with filters
- [ ] Check mobile responsiveness
- [ ] Test all navigation links

## Troubleshooting

### Authentication Issues
- Verify redirect URLs match in Google OAuth and Supabase
- Check that `NEXT_PUBLIC_SITE_URL` is set correctly
- Ensure Google OAuth is enabled in Supabase

### Database Issues
- Verify the migration SQL was run successfully
- Check RLS policies are enabled
- Ensure service role key has proper permissions

### Data Not Loading
- Verify database has been seeded with movies and albums
- Check Supabase connection in server logs
- Ensure environment variables are set correctly

## Monitoring

After deployment:
- Monitor Vercel deployment logs for errors
- Check Supabase logs for database issues
- Set up error tracking (optional: Sentry, LogRocket)

## Custom Domain (Optional)

1. Go to Vercel project settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` environment variable
5. Update redirect URLs in Supabase and Google OAuth

## Scaling Considerations

The free tiers should handle moderate traffic:
- Vercel: Unlimited bandwidth for personal projects
- Supabase: 500MB database, 50K monthly active users
- TMDB: Rate limits apply
- Spotify: Rate limits apply

For higher traffic, consider upgrading Supabase and Vercel plans.
