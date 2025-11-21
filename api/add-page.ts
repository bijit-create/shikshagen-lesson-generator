import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API Key not configured. Please set GEMINI_API_KEY environment variable.' 
      });
    }

    const { params, userPrompt } = req.body;
    
    if (!params || !userPrompt) {
      return res.status(400).json({ 
        error: 'Missing required parameters: params, userPrompt' 
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
You are adding a NEW page to an existing lesson.

Lesson Context:
- Grade: ${params.grade}
- Subject: ${params.subject}
- LO Code: ${params.loCode}
- Learning Objective: ${params.learningObjective}
- Regional Language: ${params.regionalLanguage}

New Page Request: "${userPrompt}"

Task: Create a COMPLETE, STANDALONE HTML page for this new content.
- Apply the same styling (Cognitive Load Theory, responsive design, icons)
- Include full <style> block with all CSS (including vertical-math, fractions, etc.)
- Use appropriate emojis/icons for sections
- Make it engaging and educational
- Ensure it's responsive for mobile (320px) and desktop

MANDATORY CSS to include:
body { font-family: sans-serif; padding: 20px; line-height: 1.6; max-width: 800px; margin: 0 auto; background: #fff; color: #333; }
.fraction { display: inline-block; text-align: center; vertical-align: middle; margin: 0 5px; font-size: 0.9em; }
.fraction .num { display: block; border-bottom: 1px solid currentColor; padding: 0 2px; }
.fraction .den { display: block; padding: 0 2px; }
.vertical-math { border-collapse: collapse; margin: 1em auto; font-family: 'Courier New', monospace; font-size: 1.4rem; }
.vertical-math th { text-align: center; padding: 0 12px; color: #666; font-size: 0.7em; font-family: sans-serif; font-weight: normal; vertical-align: bottom; }
.vertical-math td { text-align: center; padding: 4px 12px; position: relative; }
.vertical-math tr.result td { border-top: 2px solid #333; font-weight: bold; padding-top: 8px; }
.card { background: #fff7ed; padding: 15px; border-radius: 12px; margin-bottom: 15px; border: 1px solid #ffedd5; }
h2 { display: flex; align-items: center; color: #c2410c; }

Return ONLY valid JSON:
{
  "regional": "<html>...complete page in ${params.regionalLanguage}...</html>",
  "english": "<html>...complete page in English...</html>"
}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      return res.status(200).json(result);
    }
    
    throw new Error("No content generated");
    
  } catch (error: any) {
    console.error("Add Page Error:", error);
    return res.status(500).json({ 
      error: 'Failed to add page', 
      details: error.message 
    });
  }
}

