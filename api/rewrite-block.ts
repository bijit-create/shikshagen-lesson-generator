import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";
import { MATH_NOTATION_RULES, FORMATTING_EXAMPLES } from './_shared-prompts';

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

    const { blockKey, currentText, instruction, params } = req.body;
    
    if (!blockKey || !currentText || !instruction || !params) {
      return res.status(400).json({ 
        error: 'Missing required parameters: blockKey, currentText, instruction, params' 
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
You are helping rewrite a specific part of a lesson.

Block: ${blockKey}
Current Text: "${currentText}"
User Instruction: "${instruction}"

Context:
- Grade: ${params.grade}
- Subject: ${params.subject}
- Language: ${params.regionalLanguage}

${MATH_NOTATION_RULES}

${FORMATTING_EXAMPLES}

Task: Rewrite ONLY this specific text based on the instruction.
- Keep it appropriate for Grade ${params.grade} and subject ${params.subject}
- If the content contains math, use proper HTML formatting (fractions, vertical math, etc.)
- Maintain the same language (${params.regionalLanguage})
- Return ONLY the new text, no JSON structure, no extra formatting
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        temperature: 0.6,
      },
    });

    if (response.text) {
      return res.status(200).json({ text: response.text.trim() });
    }
    
    throw new Error("No content generated");
    
  } catch (error: any) {
    console.error("Rewrite Block Error:", error);
    return res.status(500).json({ 
      error: 'Failed to rewrite block', 
      details: error.message 
    });
  }
}

