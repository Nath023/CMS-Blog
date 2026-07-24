# SaaS Boilerplate

A modern, high-performance SaaS boilerplate built with Next.js, Supabase, Tailwind CSS, and TypeScript. This repository is designed to help forward-thinking businesses build faster and scale better.

## Features

- **Modern Stack**: Next.js App Router, React, TypeScript, Tailwind CSS.
- **Database & Auth**: Powered by Supabase (PostgreSQL).
- **Email integration**: Configured for Resend.
- **Blog Engine**: Full-featured CMS for publishing SEO-optimized articles, managing categories and tags, and tracking views.
- **Lead Magnets**: Built-in support for lead magnets and subscriber acquisition.

## Documentation Overview

We have split the documentation into several guides to help you get started:

- [Installation Guide](INSTALLATION.md) - Learn how to set up the project locally, configure environment variables, set up Supabase and Resend, and handle storage & authentication.
- [Customization Guide](CUSTOMIZATION.md) - Learn how to customize branding, optimize SEO, and manage content (like adding posts).
- [Deployment Guide](DEPLOYMENT.md) - Learn how to deploy the boilerplate to Vercel for production.

## Adding Posts

Posts can be added directly via the built-in Admin dashboard or managed directly in your Supabase database. You can organize posts using Tags and Categories, assign lead magnets to capture emails, and track views automatically.

See the [Customization Guide](CUSTOMIZATION.md) for more details.

## Troubleshooting

- **Database Errors**: Ensure you have run the full `supabase/setup.sql` script in your Supabase SQL Editor.
- **Missing Images**: Ensure you have created the required storage buckets (`blog-images`, `lead-magnets`) and configured their public access policies.
- **Emails not sending**: Check your Resend API Key and ensure your sender email domain is verified.
- **Deployment Failures**: Make sure all environment variables are correctly copied to your Vercel project settings and that `NEXT_PUBLIC_APP_URL` is set to your production domain.

---
Built with Next.js & Supabase.
