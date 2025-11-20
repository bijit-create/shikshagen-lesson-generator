# Vercel Deployment Guide

## Prerequisites
- A [Vercel](https://vercel.com) account
- A [Google Gemini API key](https://makersuite.google.com/app/apikey)

## Deployment Steps

### 1. Push to GitHub (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - Click "Environment Variables"
   - Add: `GEMINI_API_KEY` = `your_actual_gemini_api_key`
   - Make sure it's available for Production, Preview, and Development

6. Click "Deploy"

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts and set up environment variables:
# When asked, add GEMINI_API_KEY as an environment variable
```

### 3. Configure Environment Variables in Vercel

After deployment:
1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key from Google AI Studio
   - **Environments**: Select all (Production, Preview, Development)

4. Click "Save"
5. Redeploy if necessary

### 4. Verify Deployment

Once deployed:
1. Open your Vercel deployment URL
2. Try creating a lesson
3. Check if the API is working correctly

## Project Structure

```
├── api/
│   └── generate-lesson.ts    # Vercel Serverless Function
├── components/
├── services/
│   └── geminiService.ts       # Updated to use API route
├── vercel.json                # Vercel configuration
└── .env.example               # Environment variable template
```

## Important Notes

✅ **Security**: The Gemini API key is now stored as a server-side environment variable and never exposed to the client.

✅ **API Route**: The app uses `/api/generate-lesson` endpoint which runs on Vercel's serverless functions.

✅ **CORS**: Configured to allow cross-origin requests for the API.

## Troubleshooting

### Issue: API Key Error
**Solution**: Make sure `GEMINI_API_KEY` is set in Vercel Environment Variables and redeploy.

### Issue: 404 on API Route
**Solution**: Ensure `vercel.json` is in the root directory and redeploy.

### Issue: Build Failed
**Solution**: 
- Check that all dependencies are in `package.json`
- Run `npm install` locally to verify
- Check build logs in Vercel dashboard

### Issue: CORS Errors
**Solution**: The `vercel.json` and API handler already include CORS headers. If issues persist, check browser console for specific errors.

## Local Development

To test locally with the API route:
```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Add your GEMINI_API_KEY

# Run development server
npm run dev
```

For local API testing with Vercel functions:
```bash
# Install Vercel CLI
npm i -g vercel

# Run with Vercel dev server (includes serverless functions)
vercel dev
```

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to Vercel Environment Variables

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Google Gemini API Documentation](https://ai.google.dev/docs)

