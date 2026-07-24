# Customization Guide

This guide covers how to personalize the SaaS boilerplate to match your brand, optimize SEO, and manage content.

## Custom Branding

Most branding configurations are centralized in the `config/` directory.

### 1. Site Identity (`config/site.ts`)
Open `config/site.ts` to update your company details:
- `name`: Your company or product name.
- `description`: A short description of your product.
- `url`: The production URL of your app.
- `company`: Legal name and founding date.
- `contact`: Contact email address.
- `authorBio`: Default author details used for blog posts.

### 2. Branding Colors and Fonts (`config/branding.ts`)
Open `config/branding.ts` to modify theme colors and font families. The boilerplate is configured to use Tailwind CSS, and these settings help define the visual language.

### 3. Logo
Replace the `public/logo.svg` file with your own vector logo. The layout components (like Header and Footer) will automatically use this file.

### 4. Social Links (`config/social.ts`)
Update your social media handles in `config/social.ts`. These links populate the footer and author bios automatically.

## SEO Configuration

Search Engine Optimization settings are handled in `config/seo.ts`.

- `defaultTitle` and `titleTemplate`: Controls how page titles appear in browser tabs and search results.
- `description`: The default meta description.
- `ogImage`: The default OpenGraph image used when links are shared on social media. Replace `public/dummy.jpg` with your actual OG image (e.g., `og-default.jpg`) and update the reference in this file.

## Adding Posts

### Via the Admin Panel
1. Authenticate as an admin user (create an account in Supabase Authentication and assign appropriate roles).
2. Navigate to `/admin` in your application.
3. Use the integrated WYSIWYG editor or Markdown editor to draft your post.
4. Set the Title, Slug, Category, and Tags.
5. Upload a featured image.
6. Publish!

### Via Supabase Dashboard (Directly)
You can also add posts directly in the Supabase **Table Editor**:
1. Open the `posts` table.
2. Insert a new row.
3. Provide the `title`, `slug`, `content`, `status` (e.g., `'published'`), and `category_id`.
4. Ensure the `author_name` is set correctly.

## Customizing UI Components

The UI is built using React components and Tailwind CSS.
- **Layouts**: Check `app/layout.tsx` and `app/blog/layout.tsx`.
- **Reusable Components**: Check the `components/` directory.
- **Global Styles**: Global CSS is located at `app/globals.css`.

