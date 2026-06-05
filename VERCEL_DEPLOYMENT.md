# Plant Lab Deployment Guide for Vercel

## Prerequisites
- Neon PostgreSQL database set up
- Google OAuth credentials (Client ID & Secret)
- SMTP credentials (Gmail with App Password)

## Environment Variables to Set in Vercel

1. Go to **Settings → Environment Variables** in your Vercel project
2. Add these variables:

```
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]
GOOGLE_CLIENT_ID=[from Google Cloud Console]
GOOGLE_CLIENT_SECRET=[from Google Cloud Console]
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=[your-email@gmail.com]
SMTP_PASS=[Google App Password]
MAIL_FROM=Plant Lab <[your-email@gmail.com]>
NODE_ENV=production
```

## Generate NEXTAUTH_SECRET

Run this in your terminal:
```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in Vercel.

## Database Migration

Since you're switching from MySQL to PostgreSQL:

1. **Create a new Neon database** (if you haven't already)
2. **Run migrations on Neon:**
   ```bash
   npx prisma migrate deploy
   ```
   OR
   ```bash
   npx prisma db push
   ```

3. **Migrate your data** (if needed):
   - Export data from MySQL
   - Import into PostgreSQL
   - Or manually recreate key data

## Deployment Steps

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "chore: migrate database to PostgreSQL (Neon) for Vercel deployment"
   git push origin main
   ```

2. In Vercel Dashboard:
   - Connect your GitHub repository
   - Import your project
   - Add environment variables (see above)
   - Click "Deploy"

3. After deployment, verify:
   - Sign-in page loads
   - Google OAuth works
   - Database queries work properly

## Troubleshooting

**Connection issues?**
- Verify DATABASE_URL is correct in Vercel env vars
- Check Neon connection pooling settings
- Ensure Vercel IP is whitelisted in Neon

**Auth not working?**
- Verify NEXTAUTH_URL matches your Vercel domain
- Check NEXTAUTH_SECRET is set correctly
- Verify Google OAuth credentials

**Build fails?**
- Run `npm run build` locally to test
- Check build logs in Vercel dashboard
- Verify all env vars are set

## Key Changes Made

- ✅ Changed Prisma provider from MySQL to PostgreSQL
- ✅ Removed mysql2 dependency (PostgreSQL uses different driver)
- ✅ Created environment variable templates
- ✅ NextAuth configuration remains unchanged
