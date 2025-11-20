# 🚀 Deploy ShikshaGen to Vercel - Complete Guide

Follow these steps to get your app live on the internet!

---

## Prerequisites

Before you start, make sure you have:
- ✅ A GitHub account (create one at https://github.com if you don't have)
- ✅ A Vercel account (create one at https://vercel.com - you can sign in with GitHub)
- ✅ Your Gemini API key ready

---

## Step 1: Initialize Git Repository

Open your terminal in the project folder and run these commands:

```bash
# Initialize git
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit - ShikshaGen lesson generator"
```

**What this does:** Creates a local git repository with all your code.

---

## Step 2: Create GitHub Repository

### Option A: Using GitHub Website (Easier)

1. Go to https://github.com
2. Click the **"+"** button (top-right) → **"New repository"**
3. Fill in:
   - **Repository name:** `shikshagen-lesson-generator` (or any name you like)
   - **Description:** "AI-powered NCERT lesson generator"
   - **Visibility:** Choose Public or Private
   - ⚠️ **DO NOT** check "Add README" or "Add .gitignore" (we already have these)
4. Click **"Create repository"**

5. You'll see instructions. Copy the commands under **"push an existing repository"**

It will look something like:

```bash
git remote add origin https://github.com/YOUR_USERNAME/shikshagen-lesson-generator.git
git branch -M main
git push -u origin main
```

### Option B: Using GitHub CLI (If you have it)

```bash
gh repo create shikshagen-lesson-generator --public --source=. --remote=origin --push
```

---

## Step 3: Push Code to GitHub

Run the commands GitHub gave you (from Step 2):

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/shikshagen-lesson-generator.git

# Rename branch to main
git branch -M main

# Push code to GitHub
git push -u origin main
```

Enter your GitHub credentials if asked.

**Verify:** Go to your GitHub repository URL - you should see all your files there!

---

## Step 4: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended - Super Easy!)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click **"Sign Up"** or **"Login"**
   - Choose **"Continue with GitHub"**

2. **Import Your Repository**
   - Click **"Add New..."** → **"Project"**
   - You'll see a list of your GitHub repositories
   - Find **"shikshagen-lesson-generator"** and click **"Import"**

3. **Configure Project**
   
   Vercel will auto-detect it's a Vite project. You should see:
   
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
   
   These should all be correct by default!

4. **Add Environment Variable** ⚠️ IMPORTANT!
   
   Before deploying, click **"Environment Variables"** section:
   
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your actual Gemini API key (starts with `AIza...`)
   - **Environment:** Check all three: Production, Preview, Development
   
   Click **"Add"**

5. **Deploy**
   
   Click the big **"Deploy"** button!
   
   Wait 2-3 minutes. You'll see:
   - Installing dependencies...
   - Building project...
   - Deploying...
   - ✅ Success!

6. **Get Your URL**
   
   Once done, you'll see:
   
   ```
   🎉 Congratulations!
   Your project is live at: https://shikshagen-lesson-generator-xxxxx.vercel.app
   ```
   
   Click the URL to see your live app!

### Option B: Using Vercel CLI (For Advanced Users)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (choose your account)
# - Link to existing project? No
# - What's your project's name? shikshagen-lesson-generator
# - In which directory is your code located? ./
# - Want to override settings? No

# Add environment variable
vercel env add GEMINI_API_KEY

# Paste your API key when prompted
# Select all environments (Production, Preview, Development)

# Deploy to production
vercel --prod
```

---

## Step 5: Verify Deployment

### Test Your Live App

1. **Open the Vercel URL** in your browser
2. **Fill out the form** with test data:
   - Grade: 3
   - Subject: Mathematics
   - LO Code: M3L1
   - Learning Objective: "Understanding addition"
   - Regional Language: Hindi
3. **Click "Generate Lesson"**
4. **Wait** 15-30 seconds
5. **Check if lesson appears!**

### If It Works:
✅ Congratulations! Your app is live!

### If It Doesn't Work:
Go to **Step 6 (Troubleshooting)** below.

---

## Step 6: Troubleshooting

### Error: "API Key not configured"

**Problem:** Environment variable not set properly.

**Fix:**
1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Environment Variables"**
3. Check if `GEMINI_API_KEY` exists
4. If not, add it:
   - Name: `GEMINI_API_KEY`
   - Value: Your actual API key
   - Environments: All three
5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click **"..."** on latest deployment → **"Redeploy"**

### Error: "Build Failed"

**Problem:** Missing dependencies or build error.

**Fix:**
1. Go to Vercel Dashboard → Your Project → Latest Deployment
2. Click **"View Build Logs"**
3. Look for red error messages
4. Common fixes:
   - Make sure `package.json` has all dependencies
   - Check if build works locally: `npm run build`
   - If build works locally but fails on Vercel, try redeploying

### Error: 404 on API routes

**Problem:** API routes not found.

**Fix:**
1. Make sure you have `api/generate-lesson.ts` file
2. Make sure `vercel.json` exists in root folder
3. Redeploy the project

### Lesson Generates Locally but Not on Vercel

**Problem:** Environment variable issue.

**Fix:**
1. Double-check `GEMINI_API_KEY` in Vercel settings
2. Make sure it's the same key that works locally
3. Try deleting and re-adding the environment variable
4. Redeploy

---

## Step 7: Update Your App Later

When you make changes to your code:

```bash
# Make your changes in code...

# Commit changes
git add .
git commit -m "Description of what you changed"

# Push to GitHub
git push

# Vercel automatically deploys! 🎉
```

Vercel watches your GitHub repository. Every time you push, it automatically:
1. Detects the change
2. Builds your project
3. Deploys the new version
4. Gives you a preview URL

**No manual redeployment needed!**

---

## Important Notes

### About Environment Variables

**Local Development (.env.local):**
- Variable name: `VITE_GEMINI_API_KEY`
- Used by your computer when running `npm run dev`

**Production on Vercel:**
- Variable name: `GEMINI_API_KEY`
- Used by Vercel serverless functions
- Set in Vercel Dashboard

**Both need the same API key value, but different names!**

### About the API Routes

Your app uses serverless functions for security:
- Local: Direct API calls from browser
- Vercel: API calls go through `/api/generate-lesson` route
- This keeps your API key hidden from users!

### About Free Tier Limits

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth per month
- ✅ Serverless functions included
- ✅ Automatic HTTPS
- ✅ Good for testing and small projects

**Gemini Free Tier:**
- Check your quota at: https://makersuite.google.com
- Free tier has rate limits
- Consider upgrading for production use

---

## Your Deployment Checklist

- [ ] Git initialized (`git init`)
- [ ] Code committed (`git commit`)
- [ ] GitHub repository created
- [ ] Code pushed to GitHub (`git push`)
- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] `GEMINI_API_KEY` environment variable added
- [ ] Deployment successful
- [ ] Test lesson generated on live URL
- [ ] Bookmark your Vercel URL

---

## Your Live URLs

After deployment, save these:

**Live App:**
```
https://your-app-name-xxxxx.vercel.app
```

**Vercel Dashboard:**
```
https://vercel.com/your-username/shikshagen-lesson-generator
```

**GitHub Repository:**
```
https://github.com/your-username/shikshagen-lesson-generator
```

---

## What's Next?

### Share Your App
- Send the Vercel URL to colleagues
- Share on social media
- Add to your portfolio

### Monitor Usage
- Check Vercel Dashboard for visitor analytics
- Monitor API usage on Google AI Studio
- Review build logs if issues arise

### Improve Your App
- Make changes locally
- Test with `npm run dev`
- Commit and push to GitHub
- Vercel auto-deploys!

### Scale Up
- Add custom domain (Vercel Settings)
- Upgrade to paid plan if needed
- Add more features
- Optimize performance

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production (test locally)
npm run build
npm run preview

# Git workflow
git add .
git commit -m "Your message"
git push

# Vercel CLI commands
vercel                    # Deploy
vercel --prod            # Deploy to production
vercel env ls            # List environment variables
vercel logs              # View logs
vercel domains           # Manage domains
```

---

## Getting Help

### Vercel Issues
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support
- Community: https://github.com/vercel/vercel/discussions

### Gemini API Issues
- Documentation: https://ai.google.dev/docs
- Get API Key: https://makersuite.google.com/app/apikey

### GitHub Issues
- Help: https://docs.github.com
- Support: https://support.github.com

---

**You're all set! Your app is now live on the internet!** 🎉🚀

Share your Vercel URL with the world!

