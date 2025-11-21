import { GoogleGenAI, Type, Schema, Part } from "@google/genai";
import { GeneratedLesson, LessonParams } from "../types";

// Math notation rules for consistent formatting
const MATH_NOTATION_RULES = `
**MATH NOTATION (CRITICAL - ALWAYS INCLUDE):**
- Do NOT use LaTeX or external scripts.
- For Fractions: <span class="fraction"><span class="num">3</span><span class="den">4</span></span>
- For Algebra: Use <em>x</em>, <var>x</var>
- For Exponents: Use <sup> (e.g., <var>x</var><sup>2</sup>)
- For Subscripts: Use <sub> (e.g., H<sub>2</sub>O)
- For Square Roots: √ with <span class="sqrt">√<span class="radicand">25</span></span>
- **VERTICAL MATH:** ALWAYS use <table class="vertical-math"> for vertical arithmetic
- For Inline Math: <span class="expression">2 + 3 = 5</span>
- Geometry: ∠ (angle), ° (degrees)
- Comparison: ≥, ≤, ≠, ≈
`;

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

// Detect if running in development mode
const isDevelopment = import.meta.env.DEV;

// Direct Gemini call for local development
const generateLessonDirect = async (params: LessonParams): Promise<GeneratedLesson> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key not found. Please set VITE_GEMINI_API_KEY in .env.local");

  const ai = new GoogleGenAI({ apiKey });

  let textPrompt = "";

  if (params.refinedBlocks) {
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

  const parts: Part[] = [{ text: textPrompt }];

  if (params.ncertPdf && !params.refinedBlocks) {
    parts.push({
      inlineData: {
        mimeType: params.ncertPdf.mimeType,
        data: params.ncertPdf.data
      }
    });
  }

  try {
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
      return JSON.parse(response.text) as GeneratedLesson;
    }
    throw new Error("No content generated");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

// API route call for production
const generateLessonViaAPI = async (params: LessonParams): Promise<GeneratedLesson> => {
  try {
    const response = await fetch('/api/generate-lesson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: 'Unknown error',
        details: `HTTP ${response.status}: ${response.statusText}`
      }));
      
      // Provide more helpful error messages
      let errorMessage = errorData.error || `API request failed with status ${response.status}`;
      
      if (response.status === 413) {
        errorMessage = 'File too large. PDF files must be under 4 MB. Please compress your PDF or use a smaller file.';
      } else if (response.status === 500 && errorData.error?.includes('API Key')) {
        errorMessage = 'API Key not configured. Please set GEMINI_API_KEY in Vercel Environment Variables.';
      } else if (errorData.details) {
        errorMessage += ` - ${errorData.details}`;
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result as GeneratedLesson;
  } catch (error) {
    console.error("API Generation Error:", error);
    throw error;
  }
};

// Export unified function that works in both environments
export const generateLesson = async (params: LessonParams): Promise<GeneratedLesson> => {
  if (isDevelopment) {
    console.log("🔧 Development mode: Using direct Gemini API call");
    return generateLessonDirect(params);
  } else {
    console.log("🚀 Production mode: Using Vercel API route");
    return generateLessonViaAPI(params);
  }
};

// Helper function to get AI instance
const getAI = () => {
  if (isDevelopment) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key not found");
    return new GoogleGenAI({ apiKey });
  }
  throw new Error("AI instance only available in development mode");
};

// Modify existing lesson blocks based on user prompt (Development)
const modifyLessonBlocksDirect = async (
  currentBlocks: any,
  userPrompt: string,
  params: LessonParams
): Promise<any> => {
  const ai = getAI();
  
  const prompt = `
You are modifying an existing lesson's editable blocks based on user feedback.

Current Blocks:
${JSON.stringify(currentBlocks, null, 2)}

User Request: "${userPrompt}"

Context:
- Grade: ${params.grade}
- Subject: ${params.subject}
- Language: ${params.regionalLanguage}

${MATH_NOTATION_RULES}

**IMPORTANT:** If the content contains any mathematical expressions, fractions, or equations, 
ensure they are formatted using the proper HTML structures defined above.

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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response generated");
  } catch (error) {
    console.error("Modify Blocks Error:", error);
    throw error;
  }
};

// Modify existing lesson blocks based on user prompt (Production)
const modifyLessonBlocksViaAPI = async (
  currentBlocks: any,
  userPrompt: string,
  params: LessonParams
): Promise<any> => {
  try {
    const response = await fetch('/api/modify-blocks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentBlocks, userPrompt, params }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API Modify Blocks Error:", error);
    throw error;
  }
};

// Export unified function
export const modifyLessonBlocks = async (
  currentBlocks: any,
  userPrompt: string,
  params: LessonParams
): Promise<any> => {
  if (isDevelopment) {
    console.log("🔧 Development mode: Using direct Gemini API call for modify blocks");
    return modifyLessonBlocksDirect(currentBlocks, userPrompt, params);
  } else {
    console.log("🚀 Production mode: Using API route for modify blocks");
    return modifyLessonBlocksViaAPI(currentBlocks, userPrompt, params);
  }
};

// Generate a new page based on user prompt (Development)
const generateNewPageDirect = async (
  params: LessonParams,
  userPrompt: string
): Promise<{ regional: string; english: string }> => {
  const ai = getAI();
  
  const prompt = `
You are adding a NEW page to an existing lesson.

Lesson Context:
- Grade: ${params.grade}
- Subject: ${params.subject}
- LO Code: ${params.loCode}
- Learning Objective: ${params.learningObjective}
- Regional Language: ${params.regionalLanguage}

New Page Request: "${userPrompt}"

${MATH_NOTATION_RULES}

Task: Create a COMPLETE, STANDALONE HTML page for this new content.
- Apply Cognitive Load Theory principles
- Include full <style> block with ALL CSS (fractions, vertical-math, expressions, cards, etc.)
- Use appropriate emojis/icons for sections (🎯, 💡, 📝, etc.)
- Make it engaging and educational for Grade ${params.grade}
- Ensure responsive design (mobile 320px to desktop 1920px)
- If content has math, use proper HTML formatting structures

Return ONLY valid JSON:
{
  "regional": "<html>...complete page in ${params.regionalLanguage}...</html>",
  "english": "<html>...complete page in English...</html>"
}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response generated");
  } catch (error) {
    console.error("Generate New Page Error:", error);
    throw error;
  }
};

// Generate a new page based on user prompt (Production)
const generateNewPageViaAPI = async (
  params: LessonParams,
  userPrompt: string
): Promise<{ regional: string; english: string }> => {
  try {
    const response = await fetch('/api/add-page', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ params, userPrompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API Add Page Error:", error);
    throw error;
  }
};

// Export unified function
export const generateNewPage = async (
  params: LessonParams,
  userPrompt: string
): Promise<{ regional: string; english: string }> => {
  if (isDevelopment) {
    console.log("🔧 Development mode: Using direct Gemini API call for new page");
    return generateNewPageDirect(params, userPrompt);
  } else {
    console.log("🚀 Production mode: Using API route for new page");
    return generateNewPageViaAPI(params, userPrompt);
  }
};

// Rewrite a specific block with AI assistance (Development)
const rewriteSpecificBlockDirect = async (
  blockKey: string,
  currentText: string,
  instruction: string,
  params: LessonParams
): Promise<string> => {
  const ai = getAI();
  
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

Task: Rewrite ONLY this specific text based on the instruction.
- Keep it appropriate for Grade ${params.grade} and subject ${params.subject}
- If the content contains math, use proper HTML formatting (fractions, vertical math, etc.)
- Maintain the same language (${params.regionalLanguage})
- Return ONLY the new text, no JSON structure, no extra formatting
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        temperature: 0.6,
      },
    });

    if (response.text) {
      return response.text.trim();
    }
    throw new Error("No response generated");
  } catch (error) {
    console.error("Rewrite Block Error:", error);
    throw error;
  }
};

// Rewrite a specific block with AI assistance (Production)
const rewriteSpecificBlockViaAPI = async (
  blockKey: string,
  currentText: string,
  instruction: string,
  params: LessonParams
): Promise<string> => {
  try {
    const response = await fetch('/api/rewrite-block', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blockKey, currentText, instruction, params }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.text;
  } catch (error) {
    console.error("API Rewrite Block Error:", error);
    throw error;
  }
};

// Export unified function
export const rewriteSpecificBlock = async (
  blockKey: string,
  currentText: string,
  instruction: string,
  params: LessonParams
): Promise<string> => {
  if (isDevelopment) {
    console.log("🔧 Development mode: Using direct Gemini API call for block rewrite");
    return rewriteSpecificBlockDirect(blockKey, currentText, instruction, params);
  } else {
    console.log("🚀 Production mode: Using API route for block rewrite");
    return rewriteSpecificBlockViaAPI(blockKey, currentText, instruction, params);
  }
};
