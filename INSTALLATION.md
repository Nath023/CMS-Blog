# Installation Guide

Follow these steps to set up the SaaS boilerplate on your local machine.

## Prerequisites

- Node.js (v18 or newer)
- npm, yarn, pnpm, or bun
- A Supabase account (https://supabase.com)
- A Resend account (https://resend.com)

## Step 1: Clone and Install Dependencies

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

## Step 2: Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the required environment variables:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Resend
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=hello@yourdomain.com

# Cron & Webhook (Generate secure random strings for these)
CRON_SECRET=your-cron-secret
WEBHOOK_SECRET=your-webhook-secret
```

## Step 3: Supabase Setup

This project uses Supabase for Authentication, Database, and Storage.

1. Create a new project on [Supabase](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Open the `supabase/setup.sql` file from this repository.
4. Copy the entire contents of `setup.sql` and paste it into the Supabase SQL Editor.
5. Click **Run** to execute the script.

This script will automatically create:
- All required tables (`posts`, `categories`, `tags`, `subscribers`, etc.)
- Indexes for performance optimization
- Triggers and Functions (like automatically updating timestamps)
- Row Level Security (RLS) policies
- Storage Buckets (`blog-images`, `lead-magnets`)
- Seed data to get you started

## Step 4: Storage

The `setup.sql` script creates two public storage buckets:
- `blog-images`
- `lead-magnets`

If you need to recreate these manually, go to the **Storage** section in your Supabase dashboard and create two new public buckets with these exact names.

## Step 5: Authentication

Supabase Authentication handles user sign-ins (used for the Admin panel).

1. Go to the **Authentication** section in your Supabase dashboard.
2. Under **Providers**, ensure **Email** is enabled.
3. You can manually create your admin user directly in the Supabase dashboard to gain access to the `/admin` route in the application.

## Step 6: Resend Setup (Emails)

1. Create a [Resend](https://resend.com) account.
2. Verify your domain in the Resend dashboard.
3. Generate an API Key and add it to your `.env.local` as `RESEND_API_KEY`.
4. Set your verified sender email as `EMAIL_FROM`.

## Step 7: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application running.
