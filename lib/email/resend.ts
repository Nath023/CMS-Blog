import { Resend } from 'resend';
import { siteConfig } from '@/config/site';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = siteConfig.contact.email;

export async function sendWelcomeEmail(to: string, firstName?: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log('No RESEND_API_KEY found, skipping welcome email.');
    return;
  }
  
  const name = firstName || 'there';
  
  try {
    await resend.emails.send({
      from: `${siteConfig.company.name} <${FROM_EMAIL}>`,
      to,
      subject: 'Welcome to our Newsletter!',
      html: `
        <div style="font-family: sans-serif; max-w-2xl; margin: 0 auto; padding: 20px;">
          <h2>Welcome aboard, ${name}!</h2>
          <p>Thanks for subscribing to the ${siteConfig.name} newsletter.</p>
          <p>We'll be sharing the latest insights on web design, SEO, and digital growth to help you scale your business.</p>
          <p>Best regards,<br>The ${siteConfig.company.name} Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

export async function sendLeadMagnetEmail(to: string, magnetTitle: string, fileUrl: string, firstName?: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log('No RESEND_API_KEY found, skipping lead magnet email.');
    return;
  }
  
  const name = firstName || 'there';
  
  try {
    await resend.emails.send({
      from: `${siteConfig.company.name} <${FROM_EMAIL}>`,
      to,
      subject: `Here is your resource: ${magnetTitle}`,
      html: `
        <div style="font-family: sans-serif; max-w-2xl; margin: 0 auto; padding: 20px;">
          <h2>Hi ${name},</h2>
          <p>Welcome to the ${siteConfig.name} newsletter! We're excited to have you on board.</p>
          <p>Thank you for your interest! Here is the link to download your free resource: <strong>${magnetTitle}</strong>.</p>
          <div style="margin: 30px 0;">
            <a href="${fileUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Download Now</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p><a href="${fileUrl}">${fileUrl}</a></p>
          <p>We'll be sharing the latest insights on web design, SEO, and digital growth with you soon.</p>
          <p>Best regards,<br>The ${siteConfig.company.name} Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send lead magnet email:', error);
  }
}

export async function sendBlogPostEmail(to: string[], postTitle: string, postExcerpt: string, postSlug: string, postImageUrl: string | null) {
  if (!process.env.RESEND_API_KEY || to.length === 0) {
    console.log('No RESEND_API_KEY found or empty subscriber list, skipping blog post email.');
    return;
  }
  
  const postUrl = `${siteConfig.url}/blog/${postSlug}`;
  
  try {
    // Resend supports up to 50 recipients per request
    const chunkSize = 50;
    for (let i = 0; i < to.length; i += chunkSize) {
      const chunk = to.slice(i, i + chunkSize);
      await resend.emails.send({
        from: `${siteConfig.company.name} <${FROM_EMAIL}>`,
        to: FROM_EMAIL, // Send to self
        bcc: chunk, // BCC the subscribers
        subject: `New Post: ${postTitle}`,
        html: `
          <div style="font-family: sans-serif; max-w-2xl; margin: 0 auto; padding: 20px;">
            ${postImageUrl ? `<img src="${postImageUrl}" alt="${postTitle}" style="width: 100%; max-width: 600px; border-radius: 8px; margin-bottom: 20px;" />` : ''}
            <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 16px;">${postTitle}</h2>
            <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 24px;">${postExcerpt}</p>
            <div style="margin: 30px 0;">
              <a href="${postUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Read More</a>
            </div>
            <p style="font-size: 14px; color: #64748b; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
              You are receiving this because you subscribed to the ${siteConfig.name} newsletter.
            </p>
          </div>
        `,
      });
    }
  } catch (error) {
    console.error('Failed to send blog post email:', error);
  }
}
