# Math Notation Guide for ShikshaGen

## Overview

ShikshaGen supports comprehensive mathematical notation in all generated HTML content using **pure HTML and CSS** - no LaTeX, MathJax, or external libraries required. This ensures:

- ✅ Fast loading times
- ✅ Works offline
- ✅ No external dependencies
- ✅ Mobile-friendly
- ✅ Accessible and SEO-friendly

## Supported Notation Types

### 1. Fractions

**Simple Fraction:**
```html
<span class="fraction">
  <span class="num">3</span>
  <span class="den">4</span>
</span>
```

**Result:** ¾ (displayed as a proper stacked fraction)

**Mixed Numbers:**
```html
2 <span class="fraction">
  <span class="num">1</span>
  <span class="den">2</span>
</span> hours
```

**Result:** 2½ hours

### 2. Algebra & Variables

**Variables:**
```html
<var>x</var> or <em>x</em>
```

**Exponents (Superscripts):**
```html
<var>x</var><sup>2</sup> + 5<var>x</var> + 6
```

**Result:** x² + 5x + 6

**Subscripts:**
```html
<var>a</var><sub>1</sub>, <var>a</var><sub>2</sub>
```

**Result:** a₁, a₂

### 3. Vertical Arithmetic (CRITICAL)

**⚠️ IMPORTANT:** Always use `<table class="vertical-math">` for vertical arithmetic. Never use spaces or `<pre>` tags.

**Vertical Addition:**
```html
<table class="vertical-math">
  <thead>
    <tr>
      <th></th>
      <th>H</th>
      <th>T</th>
      <th>O</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td></td>
      <td>2</td>
      <td>4</td>
      <td>5</td>
    </tr>
    <tr>
      <td>+</td>
      <td>1</td>
      <td>3</td>
      <td>7</td>
    </tr>
    <tr class="result">
      <td></td>
      <td>3</td>
      <td>8</td>
      <td>2</td>
    </tr>
  </tbody>
</table>
```

**Result:** Perfect vertical alignment for addition

**Vertical Subtraction:**
```html
<table class="vertical-math">
  <thead>
    <tr>
      <th></th>
      <th>Th</th>
      <th>H</th>
      <th>T</th>
      <th>O</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td></td>
      <td>5</td>
      <td>4</td>
      <td>3</td>
      <td>2</td>
    </tr>
    <tr>
      <td>-</td>
      <td>2</td>
      <td>1</td>
      <td>5</td>
      <td>8</td>
    </tr>
    <tr class="result">
      <td></td>
      <td>3</td>
      <td>2</td>
      <td>7</td>
      <td>4</td>
    </tr>
  </tbody>
</table>
```

### 4. Square Roots & Radicals

```html
<span class="sqrt">√<span class="radicand">25</span></span> = 5
```

**Complex Example:**
```html
<var>c</var> = <span class="sqrt">√<span class="radicand"><var>a</var><sup>2</sup> + <var>b</var><sup>2</sup></span></span>
```

### 5. Geometry Symbols

**Angles:**
```html
∠ABC = 90°
```

**Unicode Symbols:**
- Angle: `∠` (U+2220)
- Degrees: `°` (U+00B0)
- Pi: `π` (U+03C0)

### 6. Chemistry Notation

**Chemical Formulas:**
```html
H<sub>2</sub>O
CO<sub>2</sub>
C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>
```

**Chemical Equations:**
```html
2H<sub>2</sub>O → 2H<sub>2</sub> + O<sub>2</sub>
```

### 7. Comparison Operators

**Unicode Symbols:**
- Greater than or equal: `≥` (U+2265)
- Less than or equal: `≤` (U+2264)
- Not equal: `≠` (U+2260)
- Approximately equal: `≈` (U+2248)

**Examples:**
```html
<var>x</var> ≥ 5
<var>y</var> ≤ 10
<var>a</var> ≠ <var>b</var>
π ≈ 3.14
```

### 8. Inline Math Expressions

```html
<span class="expression">2 + 3 × 5 = 17</span>
```

**Result:** Displays with gray background and monospace font

## Required CSS

**Every HTML page must include this CSS:**

```css
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

/* Responsive Design */
@media (max-width: 640px) {
  .vertical-math {
    font-size: 1.1rem;
  }
  .vertical-math td {
    padding: 3px 8px;
  }
}
```

## AI Integration

The AI is trained to automatically use these HTML structures when generating content. You can:

### 1. Generate Math Content
Simply specify the math topic in the form:
- Subject: Mathematics
- Learning Objective: "Understand fractions"
- The AI will automatically use proper fraction formatting

### 2. Modify Math Content via Chat
Use the chat assistant to request:
- "Add more fraction examples"
- "Make the vertical addition more challenging"
- "Add algebraic equations"

The AI will maintain proper HTML formatting automatically.

### 3. Specific Block Editing
When editing individual blocks in the EditableView, the AI assistant will:
- Preserve existing math formatting
- Add new math content using proper HTML structures
- Maintain consistency across the lesson

## Testing Your Content

### Visual Check:
1. Open `MATH_NOTATION_DEMO.html` in a browser
2. Verify all notation types display correctly
3. Test on mobile (320px) and desktop (1920px) widths

### Generated Content Check:
1. Generate a math lesson
2. Inspect the HTML (right-click → View Source)
3. Verify proper class names are used
4. Check that CSS is included in `<style>` block

## Best Practices

### ✅ DO:
- Use `class="vertical-math"` for all vertical arithmetic
- Include complete CSS in every HTML page
- Use semantic HTML (`<var>`, `<sup>`, `<sub>`)
- Test on mobile and desktop screens
- Use Unicode symbols for geometry (∠, °, π)

### ❌ DON'T:
- Use spaces or `<pre>` for vertical alignment
- Use LaTeX or MathJax
- Use images for math symbols
- Forget to include the CSS
- Mix formatting styles

## Troubleshooting

### Fractions not displaying correctly:
- ✅ Ensure CSS is included
- ✅ Check HTML structure matches exactly
- ✅ Verify class names: `fraction`, `num`, `den`

### Vertical math misaligned:
- ✅ Use `<table class="vertical-math">` not spaces
- ✅ Include `<thead>` with column headers
- ✅ Use `<tr class="result">` for answer row
- ✅ Check CSS is included

### Content too small on mobile:
- ✅ Include responsive CSS
- ✅ Use relative units (rem, em)
- ✅ Add viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

## Examples by Grade Level

### Grade 3-4 (Basic)
- Simple fractions: ½, ¼, ¾
- Vertical addition/subtraction (3-digit)
- Basic geometry: ∠, °

### Grade 5-6 (Intermediate)
- Mixed numbers: 2½
- Vertical multiplication
- Simple algebra: 2x + 3 = 9
- Square roots: √25 = 5

### Grade 7-8 (Advanced)
- Complex fractions in equations
- Quadratic expressions: x² + 5x + 6
- Chemical formulas: H₂O, CO₂
- Inequalities: x ≥ 5, y ≤ 10

## Demo File

Open `MATH_NOTATION_DEMO.html` in your browser to see all notation types in action with:
- Live examples
- HTML code snippets
- Interactive details/summary sections
- Responsive design demonstration

## API Endpoints

All API endpoints automatically support math notation:

1. **`/api/generate-lesson`** - Initial lesson generation
2. **`/api/modify-blocks`** - Chat-based modifications
3. **`/api/add-page`** - Adding new pages
4. **`/api/rewrite-block`** - Rewriting specific blocks

The shared prompts in `api/_shared-prompts.ts` ensure consistency across all endpoints.

## Further Reading

- [HTML Mathematical Notation](https://developer.mozilla.org/en-US/docs/Web/MathML)
- [CSS Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Unicode Mathematical Symbols](https://en.wikipedia.org/wiki/Mathematical_operators_and_symbols_in_Unicode)

## Support

If you encounter any issues with math notation:
1. Check the `MATH_NOTATION_DEMO.html` file
2. Verify CSS is included in your HTML
3. Inspect the generated HTML source
4. Test on different screen sizes
5. Report issues with specific examples

---

**Last Updated:** November 2024  
**Version:** 1.0  
**Maintained by:** ShikshaGen Team

