# ⚡ Quick Start - Get Your App Running NOW!

## 🔴 You Need to Do This First!

Your `.env.local` file currently has a placeholder. **You MUST replace it with your real Gemini API key!**

### Step 1: Get Your API Key
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

### Step 2: Update .env.local

Open `.env.local` and replace the placeholder:

**BEFORE:**
```bash
VITE_GEMINI_API_KEY=PLACEHOLDER_API_KEY
```

**AFTER:**
```bash
VITE_GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
*(use your actual key)*

### Step 3: Run the App
```bash
npm run dev
```

Visit: **http://localhost:3000**

## ✅ How to Test

1. Fill out the form
2. Click "Generate Lesson"
3. Check browser console (F12) - you should see:
   ```
   🔧 Development mode: Using direct Gemini API call
   ```

## 🚨 Common Issues

### Issue: "API Key not found"
**Fix**: Your `.env.local` must have `VITE_GEMINI_API_KEY` (not just `GEMINI_API_KEY`)

### Issue: Still using PLACEHOLDER_API_KEY?
**Fix**: You need to replace it with your REAL key from Google AI Studio

### Issue: Changes not working?
**Fix**: Restart dev server after editing `.env.local`:
```bash
# Press Ctrl+C to stop
# Then run again:
npm run dev
```

## 📁 Your Current Setup

```
.env.local  ← Edit this file with your REAL API key
```

**Current content:**
```
VITE_GEMINI_API_KEY=PLACEHOLDER_API_KEY  ← CHANGE THIS!
```

---

**That's it!** Once you add your real API key, the app will work perfectly. 🎉


