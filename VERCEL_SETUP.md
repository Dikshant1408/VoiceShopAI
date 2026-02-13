# Vercel Deployment - Step by Step Guide

## Quick Setup (3 Minutes)

This guide walks you through deploying VoiceShop AI Pro to Vercel with screenshots and detailed steps.

---

## Prerequisites

✅ Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))  
✅ GitHub account  
✅ Vercel account ([Sign up free](https://vercel.com/signup))

---

## Step 1: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: VoiceShop AI Pro"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/voiceshop-ai-pro.git
git branch -M main
git push -u origin main
```

---

## Step 2: Import Project to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Click "Import" next to your GitHub repository
4. Vercel will auto-detect the Vite framework
5. Click "Deploy"

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? **voiceshop-ai-pro** (or your choice)
- In which directory is your code located? **./** (press Enter)
- Want to override settings? **N**

---

## Step 3: Add Environment Variable (CRITICAL)

⚠️ **Your app won't work without this step!**

### Via Vercel Dashboard:

1. **Go to your project** at vercel.com
2. Click on your project name
3. Click **"Settings"** tab (top navigation)
4. Click **"Environment Variables"** in the left sidebar
5. Click **"Add New"** button
6. Fill in:
   - **Key**: `API_KEY`
   - **Value**: Paste your Gemini API key (starts with `AIza...`)
   - **Environments**: Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
7. Click **"Save"**

### Via Vercel CLI:

```bash
# Add environment variable
vercel env add API_KEY

# When prompted:
# - Enter value: [paste your Gemini API key]
# - Select environments: Use arrow keys and space to select all
```

---

## Step 4: Redeploy

After adding the environment variable, you need to redeploy:

### Via Dashboard:

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **three dots (...)** menu
4. Click **"Redeploy"**
5. Confirm by clicking **"Redeploy"** again

### Via CLI:

```bash
vercel --prod
```

---

## Step 5: Test Your Deployment

1. **Open your live URL**: `https://your-project.vercel.app`
2. **Grant permissions**: Allow microphone and camera when prompted
3. **Test voice command**: Click the voice orb and say "Add milk"
4. **Verify**: Item should appear in your list

---

## Troubleshooting

### Error: "API_KEY is not defined"

**Cause**: Environment variable not set or deployment not redeployed after adding it.

**Solution**:
1. Verify environment variable exists in Settings → Environment Variables
2. Ensure all three environments are checked (Production, Preview, Development)
3. Redeploy from Deployments tab

### Error: "Failed to fetch"

**Cause**: API key is invalid or has no quota.

**Solution**:
1. Verify your API key at [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Check API key has Gemini API enabled
3. Verify you haven't exceeded free tier limits

### Voice not working

**Cause**: HTTPS is required for microphone access.

**Solution**: Vercel automatically provides HTTPS, so this should work. If not:
1. Check browser permissions (click lock icon in address bar)
2. Try a different browser (Chrome or Edge recommended)
3. Clear browser cache and reload

### Build fails

**Cause**: Missing dependencies or TypeScript errors.

**Solution**:
```bash
# Test build locally first
npm install
npm run build

# If successful, commit and push
git add .
git commit -m "Fix build"
git push
```

---

## Verify Environment Variable

To check if your environment variable is properly set:

1. Go to Settings → Environment Variables
2. You should see:
   ```
   API_KEY
   Production, Preview, Development
   [Hidden value]
   ```

3. If you need to update it:
   - Click the three dots (...) next to the variable
   - Click "Edit"
   - Update the value
   - Save and redeploy

---

## Custom Domain (Optional)

To add a custom domain:

1. Go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `voiceshop.yourdomain.com`)
4. Follow DNS configuration instructions
5. Vercel will automatically provision SSL certificate

---

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main` branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with unique URL

---

## Monitoring

### View Logs

1. Go to **Deployments** tab
2. Click on a deployment
3. Click **"View Function Logs"** or **"Build Logs"**

### Analytics

1. Go to **Analytics** tab
2. View:
   - Page views
   - Unique visitors
   - Top pages
   - Performance metrics

---

## Cost

**Free Tier Includes:**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Preview deployments
- Analytics

**Paid Plans Start at $20/month** for:
- More bandwidth
- Team collaboration
- Advanced analytics
- Priority support

---

## Quick Commands Reference

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# Add environment variable
vercel env add API_KEY

# List environment variables
vercel env ls
```

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Discord**: https://vercel.com/discord
- **Status Page**: https://vercel-status.com

---

## Success Checklist

Before considering your deployment complete:

- [ ] App loads without errors
- [ ] Environment variable `API_KEY` is set
- [ ] Voice button works and adds items
- [ ] Camera scanner opens
- [ ] Language selector works
- [ ] No console errors in browser
- [ ] Mobile responsive design works
- [ ] HTTPS is enabled (automatic with Vercel)

---

## Next Steps

1. ✅ Share your live URL: `https://your-project.vercel.app`
2. ✅ Test all features in production
3. ✅ Monitor deployment logs for errors
4. ✅ Set up custom domain (optional)
5. ✅ Enable analytics to track usage

---

## 🎉 Congratulations!

Your VoiceShop AI Pro is now live on Vercel!

**Live URL**: `https://your-project.vercel.app`

Share this URL as part of your technical assessment submission.

---

**Need more help?** Check the main [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) or open an issue on GitHub.
