import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type, Schema } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an expert educational content generator for Indian schools. 
You create short, structured HTML lessons based on Cognitive Load Theory (CLT).
You must output JSON only.

RULES:
1. Use the requested Regional Language.
2. Reading Level: Grade - 1 (Simple words, short sentences).
3. Context: Use Indian names, currency (₹), and examples fitting rural/semi-urban India.
4. Structure: 
   - Page 1: Title, Objective, Short Concept Intro.
   - Page 2: Worked Example (Step-by-step).
   - Page 3: Practice Questions (2-3), Word Problem (1), Reflection (1).
5. HTML & STYLING:
   - Use inline <style> blocks in every page. 
   - **RESPONSIVE:** Use 100% width, max-width for containers, flexbox for alignment. Ensure it looks perfect on mobile (320px width) and desktop.
   - **ICONS:** Use visual cues. Start section headers with large styled emojis or unicode icons (e.g., 🎯 for Objective, 💡 for Example, 📝 for Practice).
   - **MATH NOTATION:** 
     - Do NOT use LaTeX or external scripts.
     - For Fractions: Use this HTML structure:
       <span class="fraction"><span class="num">numerator</span><span class="den">denominator</span></span>
     - For Algebra/Variables: Use <em>x</em>, <em>y</em> or <var>x</var>.
     - **VERTICAL MATH (CRITICAL):** 
       - NEVER use spaces or <pre> for vertical alignment. It causes misalignment.
       - ALWAYS use a table with class "vertical-math" for vertical addition/subtraction.
       - Example Structure:
         <table class="vertical-math">
           <thead><tr><th></th><th>H</th><th>T</th><th>O</th></tr></thead>
           <tbody>
             <tr><td></td><td>4</td><td>5</td><td>8</td></tr>
             <tr><td>-</td><td>1</td><td>2</td><td>3</td></tr>
             <tr class="result"><td></td><td>3</td><td>3</td><td>5</td></tr>
           </tbody>
         </table>
     - **MANDATORY CSS:** Include this in your <style> block for EVERY page:
       body { font-family: sans-serif; padding: 20px; line-height: 1.6; max-width: 800px; margin: 0 auto; background: #fff; color: #333; }
       .fraction { display: inline-block; text-align: center; vertical-align: middle; margin: 0 5px; font-size: 0.9em; }
       .fraction .num { display: block; border-bottom: 1px solid currentColor; padding: 0 2px; }
       .fraction .den { display: block; padding: 0 2px; }
       .expression { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace; }
       input { border: 1px solid #ccc; padding: 8px; border-radius: 4px; width: 100px; }
       details { margin: 10px 0; padding: 10px; background: #f9fafb; border-radius: 8px; cursor: pointer; border: 1px solid #e5e7eb; }
       summary { font-weight: bold; color: #d97706; outline: none; }
       .section-icon { font-size: 1.5em; margin-right: 8px; vertical-align: middle; }
       h2 { display: flex; align-items: center; color: #c2410c; }
       .card { background: #fff7ed; padding: 15px; border-radius: 12px; margin-bottom: 15px; border: 1px solid #ffedd5; }
       /* Vertical Math Table Styles */
       .vertical-math { border-collapse: collapse; margin: 1em auto; font-family: 'Courier New', monospace; font-size: 1.4rem; }
       .vertical-math th { text-align: center; padding: 0 12px; color: #666; font-size: 0.7em; font-family: sans-serif; font-weight: normal; vertical-align: bottom; }
       .vertical-math td { text-align: center; padding: 4px 12px; position: relative; }
       .vertical-math tr.result td { border-top: 2px solid #333; font-weight: bold; padding-top: 8px; }
6. Tone: Encouraging, simple, direct (NCERT style).

OUTPUT FORMAT (JSON):
{
  "regional_html_pages": ["<html>...page1...</html>", "<html>...page2...</html>", "<html>...page3...</html>"],
  "english_html_pages": ["<html>...page1...</html>", "<html>...page2...</html>", "<html>...page3...</html>"],
  "editable_blocks": {
    "title": "...",
    "objective": "...",
    "intro_text": "...",
    "worked_example_steps": ["Step 1...", "Step 2..."],
    "practice_questions": [{"question": "...", "answer": "..."}],
    "word_problem": {"question": "...", "steps": ["..."], "answer": "..."},
    "reflection_question": "..."
  }
}
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    regional_html_pages: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Array of complete HTML strings for the regional language lesson pages.",
    },
    english_html_pages: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Array of complete HTML strings for the English SME review version.",
    },
    editable_blocks: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        objective: { type: Type.STRING },
        intro_text: { type: Type.STRING },
        worked_example_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
        practice_questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
            },
          },
        },
        word_problem: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING },
          },
        },
        reflection_question: { type: Type.STRING },
      },
    },
  },
  required: ["regional_html_pages", "english_html_pages", "editable_blocks"],
};

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

  // Check request size (Vercel limit is ~4.5MB)
  const contentLength = req.headers['content-length'];
  if (contentLength && parseInt(contentLength) > 4.5 * 1024 * 1024) {
    return res.status(413).json({ 
      error: 'Payload too large',
      details: 'Request body exceeds 4.5 MB limit. PDF files must be under 4 MB (before base64 encoding).'
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API Key not configured. Please set GEMINI_API_KEY environment variable.' 
      });
    }

    const params = req.body;
    
    if (!params.grade || !params.subject || !params.loCode) {
      return res.status(400).json({ 
        error: 'Missing required parameters: grade, subject, loCode' 
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    let textPrompt = "";

    if (params.refinedBlocks) {
      // REGENERATION MODE
      textPrompt = `
        REGENERATE the lesson HTMLs based STRICTLY on the following Refined Content Blocks.
        
        User Updated Content (Refined Blocks):
        ${JSON.stringify(params.refinedBlocks, null, 2)}

        Input Details (Keep Context):
        - Grade: ${params.grade}
        - Subject: ${params.subject}
        - LO Code: ${params.loCode}
        - Language: ${params.regionalLanguage}
        
        INSTRUCTIONS:
        1. Use the "Refined Blocks" content exactly for the text logic.
        2. Re-wrap them into the 3 structured HTML pages (Regional & English).
        3. Apply all CSS/Styling rules (Cognitive Load Theory, Responsive, Icons).
        4. **CRITICAL:** Use <table class="vertical-math"> for any vertical arithmetic to ensure alignment.
        5. Output the exact same JSON structure with updated HTMLs and the editable blocks.
      `;
    } else {
      // INITIAL GENERATION MODE
      textPrompt = `
        Generate a Cognitive Load Theory based lesson.
        
        Input Details:
        - Grade: ${params.grade}
        - Subject: ${params.subject} (Support Fractions, Algebra, Geometry notations if needed)
        - LO Code: ${params.loCode}
        - Learning Objective: ${params.learningObjective}
        - Topic Outcome: ${params.topicOutcome}
        - Target Language: ${params.regionalLanguage}
        - NCERT/Context Text: ${params.ncertContext || "None provided, use standard NCERT math/science concepts for this grade."}
        ${params.ncertPdf ? "Note: An NCERT PDF chapter is attached. Use its vocabulary, examples, and style to generate the content." : ""}

        Strictly follow the JSON schema. Ensure HTML is valid, responsive, and self-contained.
        Ensure the CSS is perfectly responsive for both Mobile (320px) and Desktop.
        Add appropriate visual icons (emojis or unicode) for section headers to make it engaging.
        **CRITICAL:** Use <table class="vertical-math"> for any vertical arithmetic to ensure perfect alignment.
      `;
    }

    const parts: any[] = [{ text: textPrompt }];

    if (params.ncertPdf && !params.refinedBlocks) {
      parts.push({
        inlineData: {
          mimeType: params.ncertPdf.mimeType,
          data: params.ncertPdf.data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.4,
      },
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      return res.status(200).json(result);
    }
    
    throw new Error("No content generated");
    
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    
    // Provide more detailed error messages
    let errorMessage = 'Failed to generate lesson';
    let errorDetails = error.message || 'Unknown error';
    
    // Check for specific error types
    if (error.message?.includes('API_KEY')) {
      errorMessage = 'Invalid API Key. Please check your GEMINI_API_KEY in Vercel Environment Variables.';
      errorDetails = 'The API key may be incorrect or expired.';
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'API quota exceeded or rate limit reached.';
      errorDetails = 'Please try again later or check your Gemini API quota.';
    } else if (error.message?.includes('permission')) {
      errorMessage = 'API key does not have required permissions.';
      errorDetails = 'Please verify your Gemini API key has the correct permissions.';
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      details: errorDetails,
      fullError: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}


