# Alpha Link Digital Solutions (SaaS) - Complete Project Documentation

This handbook serves as the official developer and maintainer guide for the SaaS Next.js Blog & CMS platform.

---

## SECTION 1: Executive Summary

**What this project is**: A production-grade, full-stack Content Management System (CMS) and Blog tailored for a digital agency.
**Purpose**: To provide a platform for publishing SEO-optimized content, capturing leads via lead magnets, and managing a newsletter.
**Business Goals**: Increase organic traffic, build an email list, demonstrate agency expertise, and generate leads for SaaS services.
**Target Audience**: Prospective agency clients, developers, and businesses looking for digital solutions and marketing insights.
**Main User Journey**: Visitor lands on an SEO-optimized blog post -> Reads content (tracks views) -> Downloads a lead magnet or subscribes to the newsletter -> Receives automated emails -> Converts to a paying agency client.
**Problems it solves**: Eliminates the need for bloated WordPress setups by providing a blazing-fast, custom Next.js frontend with a secure, highly scalable Supabase PostgreSQL backend.

---

## SECTION 2: Technology Stack

* **Next.js 14 (App Router)**: React framework for SSR/SSG. Chosen for superior SEO, Core Web Vitals, and API routes.
* **React 18**: UI library.
* **TypeScript**: For type safety and better developer experience (DX).
* **Tailwind CSS**: Utility-first CSS framework for rapid, responsive UI development.
* **Supabase (PostgreSQL)**: Open-source Firebase alternative. Chosen for its robust relational database, Row Level Security (RLS), and easy auth.
* **Resend**: Email API for sending newsletters and lead magnets. Chosen for high deliverability and simple React Email integration.
* **Framer Motion (`motion`)**: For smooth page transitions and scroll animations.
* **Lucide React**: Clean, consistent SVG icons.
* **React Markdown & Remark/Rehype**: For rendering blog post content safely with support for GitHub Flavored Markdown (GFM) and slug generation for TOCs.
* **Recharts**: For admin dashboard analytics charts.
* **Vercel / Hostinger / Cloudflare**: Deployment targets (Node.js environment).

**Dependency Tree (Key Packages)**:
```
alds-blog
├── next@14.2.15
├── react@18.2.0
├── @supabase/supabase-js@2.45.0
├── @supabase/ssr@0.5.1
├── resend@6.17.2
├── tailwindcss@4.1.14
├── motion@12.42.2
├── react-markdown@10.1.0
└── recharts@3.9.2
```

---

## SECTION 3: Folder Structure

```text
/app                # Next.js App Router (Pages & Layouts)
  /admin            # Secure Admin Dashboard & CMS features
  /api              # Server-side API endpoints (upload, views, cron)
  /blog             # Public blog pages (index, slug, category, tag)
  /guides           # Specialized long-form content/guides
/components         # Reusable React components
  /admin            # Dashboard components (PostForm, MediaLibrary, Charts)
  /blog             # Blog UI (PostCard, ShareButtons, NewsletterForm)
  /layout           # Global layout components (Footer)
  /ui               # Base UI elements (Button, Input, Select)
/lib                # Utility functions and core logic
  /blog             # Blog DB queries and server actions
  /email            # Resend email logic
  /newsletter       # Subscriber and lead magnet actions
  /supabase         # Supabase client/server instantiation
/public             # Static assets (images, icons)
/supabase           # Database schema, migrations, and seed files
```

---

## SECTION 4: Features Currently Implemented

| Feature | Purpose | Status | Files Involved | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **Blog System** | Publish/read articles | ✅ Active | `app/blog/*`, `lib/blog/*` | Next.js, Supabase |
| **Admin Dashboard** | Manage content | ✅ Active | `app/admin/*` | Recharts, Tailwind |
| **Markdown Editor** | Write rich text | ✅ Active | `components/admin/MarkdownEditor` | react-markdown |
| **Categories & Tags** | Organize content | ✅ Active | `lib/blog/actions.ts` | Supabase |
| **Newsletter** | Capture emails | ✅ Active | `lib/newsletter/*` | Resend |
| **Lead Magnets** | Offer files for emails | ✅ Active | `components/blog/LeadMagnetForm` | Resend, Supabase Storage |
| **View Tracking** | Analytics per post | ✅ Active | `components/blog/ViewTracker` | Supabase |
| **Media Library** | Upload/manage images| ✅ Active | `components/admin/MediaLibrary` | Supabase Storage |
| **Dark Mode** | Theme toggling | ✅ Active | `components/theme-provider.tsx` | next-themes |
| **SEO Assistant** | Meta tag generation | ✅ Active | `components/admin/SEOAssistant` | none |
| **Related Posts** | Keep users reading | ✅ Active | `components/blog/RelatedPosts` | Supabase |

---

## SECTION 5: Hidden Features

* **Draft & Scheduled Posts**: Posts can be saved as 'draft' and won't appear on the live site. (Foundation for scheduled publishing is laid out).
* **Automated Table of Contents**: `rehype-slug` automatically adds IDs to markdown headings, allowing the `TableOfContents` component to generate dynamic links.
* **View Debouncing**: The `ViewTracker` uses `sessionStorage` to prevent refreshing the page from artificially inflating view counts.
* **RSS Feed generation**: Dynamically outputs `feed.xml` based on published posts (`app/feed.xml/route.ts`).
* **Author Config Override**: Centralized author config in `lib/blog/author.ts` that can be overridden globally in the DB settings or per-post.

---

## SECTION 6: Missing Features

**Critical**
* Robust Admin Authentication UI (Currently relies on manual DB creation/middleware).
* Pagination Edge Cases (handling empty pages gracefully).

**Recommended**
* Image Optimization pipeline (connecting Next.js `<Image>` to Supabase loader).
* Comments system (e.g., Giscus or custom Supabase table).
* Automated daily database backups setup.

**Optional**
* AI Content Generation directly in the markdown editor.
* Social media auto-posting via webhooks when a post is published.

---

## SECTION 7: Future Roadmap

* **Phase 1 (Current)**: Core CMS, Blog, Lead Magnets, Newsletter.
* **Phase 2 (Next 30 Days)**: Client Portal & Service Bookings. (High Priority - High Business Impact).
* **Phase 3 (Next 60 Days)**: AI SEO Audits & Automated Proposals generation for prospects. (Medium Priority).
* **Phase 4 (Next 90 Days)**: Full Agency CRM integration, Invoice tracking, and Support Tickets. (High Priority).

---

## SECTION 8: SaaS Business Features (Agency Specific)

To transition from just a "Blog" to an "Agency Operating System", consider adding:
1. **Client Portal (`/client`)**: Secure area for clients to view project tracking, SEO reports, and invoices.
2. **Free SEO Audit Tool**: A lead magnet where users enter a URL, and it generates a basic report in exchange for their email.
3. **Quotation/Proposal Generator**: Admin tool to quickly draft and email quotes.
4. **Maintenance Plan Subscriptions**: Stripe integration for recurring client billing.
5. **WhatsApp Floating Widget**: For immediate prospect communication.

---

## SECTION 9: SEO Audit

* **Strengths**: Next.js App Router provides excellent SSR. `generateMetadata` dynamically creates Title, Description, Open Graph, and Twitter cards per post. Canonical URLs are implemented. `robots.ts` and `sitemap.ts` are dynamic.
* **Weaknesses**: Images from Supabase storage might not be fully optimized by Next.js depending on Hostinger/cPanel memory limits.
* **Technical SEO**: Fully compliant. JSON-LD Schema is injected in `app/blog/[slug]/page.tsx`.
* **Recommendations**: Ensure the `NEXT_PUBLIC_SITE_URL` is perfectly set to avoid canonical mismatch. Add FAQ Schema to relevant guides.

---

## SECTION 10: Security Audit

* **Authentication**: Supabase Auth/Service Roles. Ensure Admin dashboard is protected by Middleware.
* **SQL Injection**: Handled safely by Supabase's parameter binding (`supabase-js` SDK).
* **XSS**: React Markdown escapes HTML by default.
* **Rate Limiting**: Recommended to add rate limiting on the `/api/views` and newsletter subscription endpoints to prevent spam.
* **Secrets**: Never expose `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` to the browser.
* **RLS**: Row Level Security is heavily utilized. `supabase/rls.sql` ensures public cannot alter posts or subscribers.

---

## SECTION 11: Database Documentation

* **`posts`**: Stores blog entries. Related to `categories`.
* **`categories` & `tags`**: Taxonomy tables.
* **`post_tags`**: Many-to-many join table.
* **`subscribers`**: Email list.
* **`lead_magnets`**: Downloadable assets offered for emails.
* **`lead_magnet_downloads`**: Tracks who downloaded what.
* **`post_views`**: Analytics tracking table.
* **`settings`**: Key-value JSONB store for global site config (e.g., default author).

---

## SECTION 12: API Documentation

* **`POST /api/upload`**
  * Input: `FormData` with a `file` blob.
  * Output: `{ url: string }`
  * Auth: Currently open (relies on internal secret). *Recommendation: Add Admin token check.*
* **`POST /api/views`**
  * Input: `{ postId: string }`
  * Output: `{ success: true, count: number }`
  * Action: Increments the view counter safely using an RPC call.
* **`POST /api/cron`**
  * Action: Can be used to publish scheduled posts.

---

## SECTION 13: Environment Variables

| Variable | Purpose | Where to obtain |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Connects frontend to DB | Supabase Project Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public access to DB (safe for browser) | Supabase Project Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin bypass for DB (KEEP SECRET) | Supabase Project Settings > API |
| `RESEND_API_KEY` | Sends emails | Resend.com > API Keys |
| `NEXT_PUBLIC_SITE_URL` | Base URL for SEO canonicals | Your actual live domain (e.g., `https://blog.mydomain.com`) |

---

## SECTION 14: Installation Guide (Beginner)

1. **Install Node.js**: Go to nodejs.org, download the LTS version, and install it.
2. **Install VS Code**: Go to code.visualstudio.com.
3. **Open Terminal**: In VS Code, go to Terminal > New Terminal.
4. **Install Dependencies**: Run `npm install`.
5. **Environment Setup**: Copy `.env.example` and rename it to `.env.local`. Fill in the Supabase and Resend keys.
6. **Run Locally**: Type `npm run dev`. Open `http://localhost:3000` in your browser.

---

## SECTION 15: Hostinger Deployment Guide (cPanel/hPanel)

1. **Build Locally**: In VS Code terminal, run `npm run build`.
2. **Zip Files**: Zip the following items from your project folder:
   * `.next` (entire folder)
   * `public` (entire folder)
   * `package.json`
   * `next.config.mjs`
3. **Upload**: Open Hostinger File Manager. Navigate to your domain's folder (e.g., `public_html`). Upload the Zip file and extract it.
4. **Setup Node.js App (cPanel)**:
   * Go to "Setup Node.js App".
   * Create Application.
   * Application Root: Select the folder where you extracted the files.
   * Application URL: Select your domain.
   * Application Startup File: (Leave blank, or set to `node_modules/next/dist/bin/next`)
   * IMPORTANT: Add all Environment Variables (from your `.env` file) in this interface.
5. **Install Packages**: Click "Run NPM Install" inside the Setup Node.js App UI.
6. **Start Command**: Ensure the script runs `npm start` (which translates to `next start`).
7. **Restart**: Click "Restart" on the application to apply changes.

---

## SECTION 16: Deploying to a Subdomain (blog.domain.com)

1. **Create Subdomain**: In Hostinger, go to Domains > Subdomains. Create `blog.example.com`.
2. **Document Root**: This will automatically create a folder like `public_html/blog`.
3. **Follow Section 15**: Upload your zipped build files specifically into this new `public_html/blog` folder.
4. **Node.js Setup**: When creating the Node.js app, ensure the Application Root points to this subfolder, and the Application URL is set to the subdomain.
5. **Reverse Proxy / .htaccess**: Sometimes cPanel needs an `.htaccess` rule to route port 80/443 traffic to the internal Node.js port (typically handled automatically by the "Setup Node.js App" tool).

---

## SECTION 17: ChatGPT Workflow

**PROMPT TO PASTE TO CHATGPT FOR DEPLOYMENT HELP**:
> "I have a Next.js 14 project using App Router. I need to deploy it to Hostinger cPanel on a subdomain (e.g., blog.mydomain.com). I will edit the code in VS Code. Please give me a step-by-step, beginner-friendly guide on how to build the project locally (`npm run build`), exactly which files/folders I need to zip (like `.next`, `public`, `package.json`), how to upload them via Hostinger File Manager, and how to configure the 'Setup Node.js App' section in cPanel (including Environment Variables, NPM Install, and the correct startup command for Next.js)."

**General Workflow**:
* **Adding Features**: "I have a Next.js 14 App router project with Supabase. Write the code to add a 'Comment' section to my blog posts."
* **SEO**: "Here is my `page.tsx` code. How can I improve the JSON-LD schema for better SEO?"

---

## SECTION 18: Google AI Studio Workflow

* Use AI Studio to quickly spin up massive architecture changes or debug deep trace errors.
* **Refactoring**: Highlight a complex component, ask AI Studio: "Refactor this into smaller Client and Server components."
* **Debugging**: Paste build errors directly: "I'm getting 'settings is not defined' in `app/blog/[slug]/page.tsx`. How do I fetch settings correctly?" (We resolved this exact issue by adding `getSettings()` to `Promise.all`).

---

## SECTION 19: Maintenance Guide

* **Weekly**: Check Resend dashboard for email bounce rates. Review Google Analytics for top performing posts.
* **Monthly**: Run `npm outdated` to check for security updates in dependencies. Backup the Supabase database via the Supabase dashboard (Database > Backups).
* **Quarterly**: Audit site performance (Lighthouse/Core Web Vitals). Check for broken internal links.

---

## SECTION 20: Monitoring

* **Analytics**: Google Analytics (GA4) / Google Search Console. (Add GA tracking code to `app/layout.tsx`).
* **Emails**: Resend provides a dashboard showing Delivered, Opened, Bounced, and Clicked metrics.
* **Database/Errors**: Supabase Dashboard > Logs. Look for API errors or slow queries.

---

## SECTION 21: Complete File-by-File Documentation (Key Files)

* `app/blog/[slug]/page.tsx`: The heart of the blog. Fetches post data via `getPostBySlug`, handles SEO via `generateMetadata`, and renders Markdown. Dependencies: Supabase, react-markdown.
* `components/admin/PostForm.tsx`: The CMS editor. Handles creation and updating of posts, image uploads, and SEO data.
* `lib/supabase/client.ts` & `server.ts`: Boilerplate to securely connect to Supabase depending on whether the code is running in the browser or on the server.
* `package.json`: Contains project metadata and build scripts (`dev`, `build`, `start`).

---

## SECTION 22: Beginner Guide (How It Works)

1. **How the project starts**: When a user goes to your URL, the Hostinger server routes the request to your Node.js application running Next.js.
2. **How pages render**: Next.js asks Supabase (the database) for the blog content. It stitches this content into HTML (Server-Side Rendering) and sends it to the user. This is incredibly fast and great for Google.
3. **How Supabase connects**: We use secret URLs and Keys (`.env` variables) so the app knows exactly which database to talk to.
4. **How Resend works**: When a user types their email into the Newsletter form, the app sends a request to Resend's servers with the API Key, and Resend delivers the welcome email to their inbox.

---

## SECTION 23: Project Improvement Report

* **Strengths**: Modern, lightning-fast stack. Excellent SEO foundation. No CMS bloat.
* **Weaknesses**: Admin authentication needs a dedicated UI rather than manual DB toggles.
* **Technical Debt**: Low. Code is relatively clean and heavily componentized.
* **Production Readiness Score**: 85/100 (Ready for content, needs monitoring).
* **Agency Readiness Score**: 70/100 (Great blog, needs more CRM/Portal features).
* **Overall Recommendations**: Proceed with launching the blog content to build domain authority. In parallel, start building the "Phase 2" features (Client Portal) to maximize business utility.

---
*End of Documentation*
