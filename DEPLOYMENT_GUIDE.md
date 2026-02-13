# Deployment Guide - VoiceShop AI Pro

## Quick Deployment (5 Minutes)

This guide will help you deploy VoiceShop AI Pro to production in under 5 minutes.

---

## Prerequisites

- ✅ Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))
- ✅ Git repository (GitHub, GitLab, or Bitbucket)
- ✅ Account on deployment platform (Vercel, Netlify, or Firebase)

---

## Option 1: Vercel (Recommended) ⚡

### Why Vercel?
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Instant rollbacks
- Free tier available

### Steps

1. **Install Vercel CLI** (optional)
```bash
npm install -g vercel
```

2. **Deploy via CLI**
```bash
vercel
```

3. **Or Deploy via Dashboard**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your Git repository
- Vercel auto-detects Vite configuration

4. **Add Environment Variable**
- Go to your project in Vercel Dashboard
- Navigate to: Settings → Environment Variables
- Click "Add New"
- Key: `API_KEY`
- Value: `your_gemini_api_key_here`
- Select all environments (Production, Preview, Development)
- Click "Save"
- Go to Deployments tab and click "Redeploy" on the latest deployment

5. **Done!** 🎉
Your app is live at `https://your-project.vercel.app`

---

## Option 2: Netlify 🌐

### Why Netlify?
- Git-based deployment
- Automatic builds
- Form handling
- Serverless functions
- Free tier available

### Steps

1. **Install Netlify CLI** (optional)
```bash
npm install -g netlify-cli
```

2. **Deploy via CLI**
```bash
netlify deploy --prod
```

3. **Or Deploy via Dashboard**
- Go to [netlify.com](https://netlify.com)
- Click "Add new site" → "Import an existing project"
- Connect your Git repository
- Build settings are auto-detected from `netlify.toml`

4. **Add Environment Variable**
- Go to Site settings → Environment variables
- Add: `API_KEY` = `your_gemini_api_key`
- Trigger redeploy

5. **Done!** 🎉
Your app is live at `https://your-project.netlify.app`

---

## Option 3: Firebase Hosting 🔥

### Why Firebase?
- Google Cloud integration
- Global CDN
- Custom domains
- SSL certificates
- Free tier available

### Steps

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**
```bash
firebase login
```

3. **Initialize Firebase**
```bash
firebase init hosting
```
- Select "Use an existing project" or create new
- Set public directory to: `dist`
- Configure as single-page app: `Yes`
- Don't overwrite index.html: `No`

4. **Build the App**
```bash
npm run build
```

5. **Deploy**
```bash
firebase deploy
```

6. **Add Environment Variable**
- Go to Firebase Console → Project Settings
- Add `API_KEY` to environment config
- Rebuild and redeploy

7. **Done!** 🎉
Your app is live at `https://your-project.web.app`

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `API_KEY` | Gemini API Key | `AIzaSyC...` |

### How to Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Add to your deployment platform

---

## Post-Deployment Checklist

After deploying, verify these items:

### Functionality
- [ ] App loads without errors
- [ ] Voice button appears and is clickable
- [ ] Microphone permission prompt works
- [ ] Voice commands add items to list
- [ ] Camera scanner opens and captures
- [ ] Language selector works
- [ ] Search modal opens and filters work
- [ ] Recipe Scout generates suggestions
- [ ] Toast notifications appear
- [ ] Items persist after page refresh

### Performance
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] HTTPS is enabled
- [ ] Mobile responsive design works
- [ ] Voice recognition works on mobile

### Security
- [ ] API key is not exposed in client code
- [ ] HTTPS is enforced
- [ ] No security warnings in browser

---

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-generated

### Netlify
1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records
4. SSL certificate auto-generated

### Firebase
1. Go to Hosting → Add custom domain
2. Follow verification steps
3. Update DNS records
4. SSL certificate auto-generated

---

## Troubleshooting

### Build Fails

**Error**: `Module not found`
```bash
# Solution: Install dependencies
npm install
```

**Error**: `API_KEY is not defined`
```bash
# Solution: Add environment variable in platform dashboard
```

### Voice Not Working

**Issue**: Microphone permission denied
- **Solution**: Ensure HTTPS is enabled (required for mic access)
- Check browser permissions in settings

**Issue**: Voice recognition not supported
- **Solution**: Use Chrome or Edge browser
- Safari requires iOS 14.5+

### Camera Not Working

**Issue**: Camera permission denied
- **Solution**: Grant camera permissions in browser settings
- Ensure HTTPS is enabled

**Issue**: Black screen in camera
- **Solution**: Check if another app is using camera
- Reload page and try again

### API Errors

**Error**: `API key not valid`
- **Solution**: Verify API key is correct
- Check API key has Gemini API enabled
- Ensure no extra spaces in environment variable

**Error**: `Quota exceeded`
- **Solution**: Check API usage in [Google AI Studio](https://aistudio.google.com)
- Upgrade to paid tier if needed

---

## Monitoring & Analytics

### Recommended Tools

1. **Error Tracking**
   - [Sentry](https://sentry.io) - Real-time error monitoring
   - [LogRocket](https://logrocket.com) - Session replay

2. **Analytics**
   - [Google Analytics](https://analytics.google.com) - User behavior
   - [Mixpanel](https://mixpanel.com) - Event tracking

3. **Performance**
   - [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audits
   - [Web Vitals](https://web.dev/vitals/) - Core metrics

### Integration Example (Google Analytics)

Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## Scaling Considerations

### Current Architecture
- Client-side only (no backend)
- localStorage for persistence
- Direct API calls to Gemini

### For Production Scale

1. **Add Backend API**
   - Proxy Gemini API calls
   - Implement rate limiting
   - Add user authentication

2. **Database Integration**
   - Replace localStorage with cloud database
   - Enable cross-device sync
   - Implement shared lists

3. **Caching Strategy**
   - Cache AI responses
   - Implement service workers
   - Add offline support

4. **CDN Optimization**
   - Serve static assets from CDN
   - Implement image optimization
   - Enable compression

---

## Continuous Deployment

### GitHub Actions (Vercel)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### GitHub Actions (Netlify)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install && npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Rollback Strategy

### Vercel
- Go to Deployments tab
- Click on previous deployment
- Click "Promote to Production"

### Netlify
- Go to Deploys tab
- Find previous deploy
- Click "Publish deploy"

### Firebase
```bash
firebase hosting:rollback
```

---

## Cost Estimation

### Free Tier Limits

**Vercel Free**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

**Netlify Free**
- 100 GB bandwidth/month
- 300 build minutes/month
- Automatic HTTPS

**Firebase Free (Spark Plan)**
- 10 GB storage
- 360 MB/day downloads
- Custom domain

**Gemini API Free Tier**
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per month

### Estimated Monthly Costs (Paid Tier)

- **Hosting**: $0-20 (depending on traffic)
- **Gemini API**: $0-50 (depending on usage)
- **Total**: $0-70/month for moderate usage

---

## Support & Resources

### Documentation
- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [Gemini API Docs](https://ai.google.dev/docs)

### Community
- [Vercel Discord](https://vercel.com/discord)
- [Netlify Community](https://answers.netlify.com)
- [Firebase Community](https://firebase.google.com/community)

### Issues
- GitHub Issues: [Your Repository]/issues
- Email: [Your Email]

---

## Success Metrics

Track these KPIs after deployment:

1. **Performance**
   - Page load time < 3s
   - Time to interactive < 5s
   - Lighthouse score > 90

2. **Engagement**
   - Average session duration
   - Items added per session
   - Feature adoption rates

3. **Technical**
   - Error rate < 1%
   - API success rate > 99%
   - Uptime > 99.9%

---

## Next Steps After Deployment

1. ✅ Share live URL with stakeholders
2. ✅ Monitor error logs for first 24 hours
3. ✅ Gather user feedback
4. ✅ Set up analytics and monitoring
5. ✅ Plan feature iterations
6. ✅ Document any production issues
7. ✅ Optimize based on real usage data

---

## 🎉 Congratulations!

Your VoiceShop AI Pro is now live and accessible to users worldwide!

**Live URL**: `https://your-project.[platform].app`

**Next**: Share your deployment URL and GitHub repository as part of your technical assessment submission.

---

## Quick Reference

### Deployment Commands

```bash
# Vercel
vercel

# Netlify
netlify deploy --prod

# Firebase
npm run build && firebase deploy
```

### Environment Variables

```env
API_KEY=your_gemini_api_key_here
```

### Build Command

```bash
npm run build
```

### Output Directory

```
dist/
```

---

**Need Help?** Check the troubleshooting section or open an issue on GitHub.

Happy deploying! 🚀
