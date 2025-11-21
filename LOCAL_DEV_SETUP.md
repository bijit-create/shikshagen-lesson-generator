# 🛠️ Local Development Setup

Your app now works seamlessly in both local development and production on Vercel!

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Your Gemini API Key

**IMPORTANT**: Replace `PLACEHOLDER_API_KEY` with your actual API key!

Edit `.env.local` and add your real API key:
```bash
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Get your API key**: https://makersuite.google.com/app/apikey

### 3. Run the Development Server
```bash
npm run dev
```

Your app will be available at: **http://localhost:3000**

## How It Works

The app automatically detects the environment:

### 🔧 Local Development (npm run dev)
- Uses **direct Gemini API calls** from the browser
- API key: `VITE_GEMINI_API_KEY` from `.env.local`
- ✅ Works with standard Vite dev server
- ✅ No need for Vercel CLI

### 🚀 Production (Vercel)
- Uses **secure serverless API route** (`/api/generate-lesson`)
- API key: `GEMINI_API_KEY` from Vercel environment variables
- ✅ API key is hidden from the client
- ✅ More secure for production

## Environment Variables

| Environment | Variable | Location |
|-------------|----------|----------|
| **Local Dev** | `VITE_GEMINI_API_KEY` | `.env.local` file |
| **Production** | `GEMINI_API_KEY` | Vercel Dashboard |

## Important Notes

### ⚠️ Security
- In **local development**, the API key is exposed in the browser (only for testing)
- In **production on Vercel**, the API key is safely stored server-side
- **Never commit** `.env.local` to Git (it's already in `.gitignore`)

### 📝 File Structure
```
.env.local          ← Your local API key (not in Git)
.env.example        ← Template (committed to Git)
```

## Troubleshooting

### Problem: "API Key not found" error

**Solution**: Check that your `.env.local` file has the correct format:
```bash
VITE_GEMINI_API_KEY=AIza...your_actual_key
```

- No quotes around the key
- No spaces before or after the `=`
- Replace `PLACEHOLDER_API_KEY` with your real key

### Problem: App shows blank screen

**Solution**: Open browser console (F12) to see the error. Common issues:
- Invalid API key
- Missing `.env.local` file
- Typo in environment variable name

### Problem: Changes not reflecting

**Solution**: Restart the dev server after editing `.env.local`:
```bash
# Stop with Ctrl+C, then:
npm run dev
```

### Problem: Still not working?

Check the browser console (F12 → Console tab) for detailed error messages.

## Testing the App

1. Fill out the form with:
   - Grade: 3
   - Subject: Mathematics
   - LO Code: M3L1
   - Learning Objective: "Understanding addition"
   - Regional Language: Hindi
   - (Fill other fields as needed)

2. Click "Generate Lesson"

3. You should see:
   - Console log: "🔧 Development mode: Using direct Gemini API call"
   - Lesson pages appear after a few seconds

## Next Steps

Once local development is working:
1. Test thoroughly
2. Deploy to Vercel (see `VERCEL_DEPLOYMENT.md`)
3. Set `GEMINI_API_KEY` in Vercel dashboard
4. Your production app will automatically use the secure API route!

## Commands Reference

```bash
# Install dependencies
npm install

# Run dev server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

**Need help?** Check the error message in the browser console or terminal output.


