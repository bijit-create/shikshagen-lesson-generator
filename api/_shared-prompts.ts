/**
 * Shared prompt components for consistent math notation across all API endpoints
 */

export const MATH_NOTATION_RULES = `
**MATH NOTATION (CRITICAL - ALWAYS INCLUDE):**
- Do NOT use LaTeX or external scripts.
- For Fractions: Use this HTML structure:
  <span class="fraction"><span class="num">numerator</span><span class="den">denominator</span></span>
  Example: <span class="fraction"><span class="num">3</span><span class="den">4</span></span> for 3/4

- For Algebra/Variables: Use <em>x</em>, <em>y</em> or <var>x</var>
  Example: Solve for <var>x</var>: 2<var>x</var> + 5 = 15

- For Exponents/Superscripts: Use <sup>
  Example: <var>x</var><sup>2</sup> + 5 = 30

- For Subscripts: Use <sub>
  Example: H<sub>2</sub>O

- For Square Roots: Use √ symbol with CSS
  Example: <span class="sqrt">√<span class="radicand">16</span></span> = 4

- **VERTICAL MATH (ADDITION/SUBTRACTION/MULTIPLICATION):** 
  - NEVER use spaces or <pre> for vertical alignment. It causes misalignment.
  - ALWAYS use a table with class "vertical-math" for vertical arithmetic.
  - Example Structure:
    <table class="vertical-math">
      <thead><tr><th></th><th>H</th><th>T</th><th>O</th></tr></thead>
      <tbody>
        <tr><td></td><td>4</td><td>5</td><td>8</td></tr>
        <tr><td>-</td><td>1</td><td>2</td><td>3</td></tr>
        <tr class="result"><td></td><td>3</td><td>3</td><td>5</td></tr>
      </tbody>
    </table>

- For Inline Math Expressions: Use <span class="expression">
  Example: <span class="expression">2 + 3 = 5</span>

- For Geometry Symbols:
  - Angle: ∠ (unicode)
  - Degrees: ° (unicode)
  - Example: ∠ABC = 90°

- For Comparison Operators:
  - Greater than or equal: ≥
  - Less than or equal: ≤
  - Not equal: ≠
  - Approximately equal: ≈
`;

export const MANDATORY_CSS = `
**MANDATORY CSS (MUST BE INCLUDED IN EVERY HTML PAGE):**

Include this in your <style> block for EVERY page:

body { 
  font-family: sans-serif; 
  padding: 20px; 
  line-height: 1.6; 
  max-width: 800px; 
  margin: 0 auto; 
  background: #fff; 
  color: #333; 
}

/* Fraction Styles */
.fraction { 
  display: inline-block; 
  text-align: center; 
  vertical-align: middle; 
  margin: 0 5px; 
  font-size: 0.9em; 
}
.fraction .num { 
  display: block; 
  border-bottom: 1px solid currentColor; 
  padding: 0 2px; 
}
.fraction .den { 
  display: block; 
  padding: 0 2px; 
}

/* Inline Math Expression */
.expression { 
  background: #f3f4f6; 
  padding: 2px 6px; 
  border-radius: 4px; 
  font-family: 'Courier New', monospace; 
}

/* Square Root */
.sqrt {
  font-size: 1.2em;
  font-weight: bold;
}
.radicand {
  border-top: 1px solid currentColor;
  padding: 0 4px;
}

/* Vertical Math Table Styles */
.vertical-math { 
  border-collapse: collapse; 
  margin: 1em auto; 
  font-family: 'Courier New', monospace; 
  font-size: 1.4rem; 
}
.vertical-math th { 
  text-align: center; 
  padding: 0 12px; 
  color: #666; 
  font-size: 0.7em; 
  font-family: sans-serif; 
  font-weight: normal; 
  vertical-align: bottom; 
}
.vertical-math td { 
  text-align: center; 
  padding: 4px 12px; 
  position: relative; 
}
.vertical-math tr.result td { 
  border-top: 2px solid #333; 
  font-weight: bold; 
  padding-top: 8px; 
}

/* Input Fields */
input { 
  border: 1px solid #ccc; 
  padding: 8px; 
  border-radius: 4px; 
  width: 100px; 
}

/* Collapsible Details */
details { 
  margin: 10px 0; 
  padding: 10px; 
  background: #f9fafb; 
  border-radius: 8px; 
  cursor: pointer; 
  border: 1px solid #e5e7eb; 
}
summary { 
  font-weight: bold; 
  color: #d97706; 
  outline: none; 
}

/* Section Icons */
.section-icon { 
  font-size: 1.5em; 
  margin-right: 8px; 
  vertical-align: middle; 
}

/* Headers */
h2 { 
  display: flex; 
  align-items: center; 
  color: #c2410c; 
}

/* Card Containers */
.card { 
  background: #fff7ed; 
  padding: 15px; 
  border-radius: 12px; 
  margin-bottom: 15px; 
  border: 1px solid #ffedd5; 
}

/* Responsive Design */
@media (max-width: 640px) {
  body { padding: 10px; }
  .vertical-math { font-size: 1.1rem; }
  .vertical-math td { padding: 3px 8px; }
}
`;

export const RESPONSIVE_DESIGN_RULES = `
**RESPONSIVE DESIGN (CRITICAL):**
- Use 100% width for containers
- Use max-width for content (typically 800px)
- Use flexbox for alignment
- Ensure it looks perfect on mobile (320px width) and desktop (1920px width)
- Use appropriate font sizes that scale well
- Add @media queries for mobile optimization
`;

export const FORMATTING_EXAMPLES = `
**EXAMPLES OF CORRECT MATH FORMATTING:**

1. Simple Fraction:
   <span class="fraction"><span class="num">3</span><span class="den">4</span></span>

2. Mixed Number:
   2 <span class="fraction"><span class="num">1</span><span class="den">2</span></span>

3. Algebraic Expression:
   <var>x</var><sup>2</sup> + 3<var>x</var> + 5 = 0

4. Vertical Addition:
   <table class="vertical-math">
     <thead><tr><th></th><th>Hundreds</th><th>Tens</th><th>Ones</th></tr></thead>
     <tbody>
       <tr><td></td><td>2</td><td>4</td><td>5</td></tr>
       <tr><td>+</td><td>1</td><td>3</td><td>7</td></tr>
       <tr class="result"><td></td><td>3</td><td>8</td><td>2</td></tr>
     </tbody>
   </table>

5. Square Root:
   <span class="sqrt">√<span class="radicand">25</span></span> = 5

6. Comparison:
   5 + 3 ≥ 7

7. Chemical Formula:
   2H<sub>2</sub>O → 2H<sub>2</sub> + O<sub>2</sub>
`;

