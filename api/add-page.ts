import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";
import { MATH_NOTATION_RULES, MANDATORY_CSS, RESPONSIVE_DESIGN_RULES, FORMATTING_EXAMPLES } from './_shared-prompts';

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
- Apply Cognitive Load Theory principles
- Use appropriate emojis/icons for sections (🎯, 💡, 📝, etc.)
- Make it engaging and educational for Grade ${params.grade}

${MATH_NOTATION_RULES}

${MANDATORY_CSS}

${RESPONSIVE_DESIGN_RULES}

${FORMATTING_EXAMPLES}

**Structure Guidelines:**
- Use semantic HTML5 elements
- Include visual section headers with emojis
- Use cards/containers for organizing content
- Add interactive elements where appropriate (details/summary for hints)

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

