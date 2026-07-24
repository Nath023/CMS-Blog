# Deployment Guide

This guide explains how to deploy your SaaS boilerplate to production using Vercel.

## 1. Preparing for Production

Before deploying, make sure you have:
- Verified that all local changes build successfully by running `npm run build`.
- Set up a production Supabase project (it is highly recommended to use a separate Supabase project for production and development).
- Configured your custom domain in Resend for sending emails.

## 2. Deployment to Vercel

Vercel provides the easiest deployment experience for Next.js applications.

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your repository.
4. In the **Configure Project** step, open the **Environment Variables** section.

## 3. Environment Variables

You must add the following environment variables to your Vercel project settings:

```env
NEXT_PUBLIC_APP_URL=https://your-production-domain.com

# Production Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=your-prod-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-supabase-service-role-key

# Resend Credentials
RESEND_API_KEY=your-prod-resend-key
EMAIL_FROM=hello@your-production-domain.com

# Security Secrets (Must be secure, random strings)
CRON_SECRET=your-secure-cron-secret
WEBHOOK_SECRET=your-secure-webhook-secret
```

5. Click **Deploy**.

## 4. Post-Deployment Steps

### Supabase Setup
If you created a new Supabase project for production, you must run the database setup script again:
1. Go to the SQL Editor in your production Supabase dashboard.
2. Run the full contents of `supabase/setup.sql` to generate your tables, policies, and storage buckets.

### Authentication Domains
In your production Supabase project:
1. Go to **Authentication > URL Configuration**.
2. Set your **Site URL** to your production domain (e.g., `https://your-domain.com`).
3. Add any necessary redirect URIs.

## 5. Troubleshooting Deployments

- **Application crashes on load**: Double-check that all environment variables are correctly typed and saved in Vercel.
- **Images are broken**: Ensure your production Supabase Storage buckets (`blog-images`, `lead-magnets`) are set to **Public**.
- **Build fails**: Check the Vercel build logs. Ensure there are no TypeScript errors by running `npx tsc --noEmit` locally before pushing.
