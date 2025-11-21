# How to Set GEMINI_API_KEY in Vercel

## Quick Steps

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/bijits-projects-ec8c6e30/shikshagen-ncert-lesson-generator/settings/environment-variables

### 2. Add Environment Variable

**Option A: Via Dashboard (Recommended)**
1. Click **"Add New"** button
2. Fill in:
   - **Key:** `GEMINI_API_KEY` (exactly this, case-sensitive)
   - **Value:** Your Gemini API key (starts with `AIza...`)
   - **Environments:** Check ALL three boxes:
     - ☑️ Production
     - ☑️ Preview  
     - ☑️ Development
3. Click **"Save"**

**Option B: Via Vercel CLI**
```bash
vercel env add GEMINI_API_KEY production
# When prompted, paste your API key
# Repeat for preview and development:
vercel env add GEMINI_API_KEY preview
vercel env add GEMINI_API_KEY development
```

### 3. Get Your Gemini API Key

If you don't have one:
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click **"Create API Key"**
4. Copy the key (it will look like: `AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567`)

### 4. Redeploy (CRITICAL!)

After adding the environment variable, you **MUST redeploy**:

**Option A: Via Dashboard**
1. Go to: https://vercel.com/bijits-projects-ec8c6e30/shikshagen-ncert-lesson-generator/deployments
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

**Option B: Via CLI**
```bash
vercel --prod --yes
```

### 5. Verify It Works

After redeployment, check:
1. Visit: `https://your-app-url.vercel.app/api/check-config`
2. You should see:
   ```json
   {
     "status": "configured",
     "apiKeyExists": true,
     "apiKeyLength": 39,
     "message": "API key is configured correctly"
   }
   ```

## Common Issues

### ❌ Issue: "API key is missing" after setting it
**Solution:** You need to redeploy! Environment variables are only available to NEW deployments.

### ❌ Issue: "Invalid API Key"
**Solution:** 
- Check the key starts with `AIza`
- Make sure there are no extra spaces when copying
- Verify the key is active in Google AI Studio

### ❌ Issue: Key works locally but not in production
**Solution:** 
- Make sure you added it for "Production" environment
- Check the key name is exactly `GEMINI_API_KEY` (case-sensitive)
- Redeploy after adding

### ❌ Issue: Key only works sometimes
**Solution:**
- Check your API quota in Google AI Studio
- Verify you haven't exceeded rate limits
- Make sure the key has proper permissions

## Verification Checklist

- [ ] API key added in Vercel Dashboard
- [ ] Key name is exactly `GEMINI_API_KEY`
- [ ] All three environments checked (Production, Preview, Development)
- [ ] Redeployed after adding the key
- [ ] `/api/check-config` shows `"status": "configured"`
- [ ] Can generate lessons successfully

## Need Help?

If you're still having issues:
1. Check Vercel deployment logs: https://vercel.com/bijits-projects-ec8c6e30/shikshagen-ncert-lesson-generator/deployments
2. Look for errors in the Function Logs
3. Verify the API key format is correct
4. Make sure you've redeployed after adding the variable

