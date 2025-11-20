<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ShikshaGen - NCERT Lesson Generator

An AI-powered educational content generator that creates Cognitive Load Theory (CLT) compliant HTML lessons for Indian students.

View your app in AI Studio: https://ai.studio/apps/drive/1SxVUe-IdNz8AKh2uVi1_qncFf-KMZVTh

## Features

- 🎯 **CLT-Based Content**: Generates lessons following Cognitive Load Theory principles
- 🌏 **Regional Language Support**: Create lessons in multiple Indian languages
- 📱 **Responsive Design**: Mobile-first, works perfectly on all devices
- ✏️ **Editable Content**: Edit and regenerate lessons on the fly
- 📥 **Downloadable**: Export lessons as standalone HTML files
- 🎨 **Math Notation Support**: Built-in support for fractions, algebra, and vertical math

## Run Locally

**Prerequisites:** Node.js (v18 or higher)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd shikshagen---ncert-lesson-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Edit `.env.local` file in the root directory:
   ```bash
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   
   **Important**: Replace `PLACEHOLDER_API_KEY` with your real key!
   
   Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:3000`

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Quick Deployment Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variable: `GEMINI_API_KEY`
   - Click "Deploy"

📖 **Detailed deployment instructions**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## Environment Variables

| Variable | Description | Environment | Required |
|----------|-------------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key | Local Development | Yes |
| `GEMINI_API_KEY` | Your Google Gemini API key | Vercel Production | Yes |

**Note**: The app automatically uses the correct variable based on the environment.

## Project Structure

```
├── api/                      # Vercel serverless functions
│   └── generate-lesson.ts    # API endpoint for Gemini
├── components/               # React components
│   ├── EditableView.tsx
│   ├── HtmlPreview.tsx
│   └── InputForm.tsx
├── services/                 # Service layer
│   └── geminiService.ts      # API client
├── App.tsx                   # Main app component
├── types.ts                  # TypeScript types
├── vercel.json               # Vercel configuration
└── vite.config.ts            # Vite configuration
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (via inline styles)
- **AI**: Google Gemini 2.5 Flash
- **Icons**: Lucide React
- **Deployment**: Vercel

## Security

🔒 The Gemini API key is stored securely as a server-side environment variable and is never exposed to the client. All API calls are proxied through Vercel serverless functions.

## Troubleshooting

**API Key Error**: Make sure `GEMINI_API_KEY` is set in your environment variables (`.env` for local, Vercel dashboard for production).

**Build Failed**: Run `npm install` to ensure all dependencies are installed.

**CORS Issues**: The API routes are already configured with CORS headers. Check the browser console for specific errors.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
