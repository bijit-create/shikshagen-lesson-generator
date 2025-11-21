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

    const { currentBlocks, userPrompt, params } = req.body;
    
    if (!currentBlocks || !userPrompt || !params) {
      return res.status(400).json({ 
        error: 'Missing required parameters: currentBlocks, userPrompt, params' 
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
You are modifying an existing lesson's editable blocks based on user feedback.

Current Blocks:
${JSON.stringify(currentBlocks, null, 2)}

User Request: "${userPrompt}"

Context:
- Grade: ${params.grade}
- Subject: ${params.subject}
- Language: ${params.regionalLanguage}

Task: Apply the user's requested changes to the blocks and return the COMPLETE updated blocks structure.
Maintain all fields, only modify what the user asked for.

Return ONLY valid JSON in this exact structure:
{
  "title": "...",
  "objective": "...",
  "intro_text": "...",
  "worked_example_steps": ["..."],
  "practice_questions": [{"question": "...", "answer": "..."}],
  "word_problem": {"question": "...", "steps": ["..."], "answer": "..."},
  "reflection_question": "..."
}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      return res.status(200).json(result);
    }
    
    throw new Error("No content generated");
    
  } catch (error: any) {
    console.error("Modify Blocks Error:", error);
    return res.status(500).json({ 
      error: 'Failed to modify blocks', 
      details: error.message 
    });
  }
}

