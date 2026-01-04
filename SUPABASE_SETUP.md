# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name, database password, and region
3. Wait for the project to be provisioned

## 2. Get Your API Keys

1. Go to Project Settings > API
2. Copy the following values:
   - `Project URL` → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Configure Environment Variables

1. Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## 4. Run Database Migrations

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/migrations/00001_initial_schema.sql`
3. Paste and run the SQL in the editor
4. Verify all tables were created successfully

## 5. Configure Google OAuth

1. Go to Authentication > Providers in Supabase
2. Enable Google provider
3. Follow the instructions to create OAuth credentials in Google Cloud Console:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to Credentials > Create Credentials > OAuth client ID
   - Choose Web application
   - Add authorized redirect URIs:
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret
4. Paste them into Supabase Google provider settings
5. Save the configuration

## 6. Verify Setup

Run your Next.js app and test:
```bash
npm run dev
```

You should be able to:
- Sign in with Google
- Have a profile automatically created
- Access protected routes when authenticated
