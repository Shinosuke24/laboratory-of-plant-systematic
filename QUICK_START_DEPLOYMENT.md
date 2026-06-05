# Deploy Plant Lab to Vercel - Quick Start

## What I've Done ✅

1. **Updated Prisma Configuration**
   - Changed database provider from MySQL to PostgreSQL
   - Now compatible with Neon (Vercel's recommended database)

2. **Updated Dependencies**
   - Removed `mysql2` package (no longer needed)
   - PostgreSQL driver is included in Prisma

3. **Created Setup Documentation**
   - `VERCEL_DEPLOYMENT.md` - Complete deployment guide
   - `.env.example` - Template for environment variables

## Next Steps to Deploy

### 1. Set Up Neon Database
- Go to [neon.tech](https://neon.tech)
- Create a new PostgreSQL database
- Copy your connection string (DATABASE_URL)

### 2. Get Your Secrets
You'll need these 5 things:
```
1. DATABASE_URL (from Neon)
2. NEXTAUTH_SECRET (generate: openssl rand -base64 32)
3. GOOGLE_CLIENT_ID (from Google Console)
4. GOOGLE_CLIENT_SECRET (from Google Console)
5. SMTP credentials (Gmail App Password)
```

### 3. Deploy to Vercel
```bash
# Option A: Via Vercel CLI
vercel

# Option B: Via GitHub
1. Push to GitHub
2. Go to vercel.com
3. Click "New Project"
4. Import your GitHub repo
5. Add environment variables
6. Deploy!
```

### 4. Set Environment Variables in Vercel
- Go to Settings → Environment Variables
- Add all 5 secrets from step 2
- Redeploy

### 5. Test Your App
- Visit your Vercel domain
- Try logging in with Google
- Test database operations

## Important Notes

⚠️ **Database Migration**
- Your old MySQL data won't automatically transfer
- You'll need to manually migrate key users/data if needed
- Or start fresh with a new database

✅ **NextAuth Remains the Same**
- Your authentication setup stays unchanged
- Google OAuth will work the same way
- Just pointing to a different database

## Need Help?

Check `VERCEL_DEPLOYMENT.md` in the project root for detailed troubleshooting and setup instructions.
