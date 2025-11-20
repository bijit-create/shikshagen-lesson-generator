# ShikshaGen - Your AI Lesson Creator

Hey there! Welcome to ShikshaGen. This guide will help you understand what this app does and how to use it. Don't worry, we'll keep it simple!

---

## What Does This App Do?

Think of ShikshaGen as your personal lesson-writing assistant. You tell it what lesson you need, and it creates beautiful, ready-to-use educational content for you. 

**What you get:**
- Complete lessons in both a regional language (like Hindi, Tamil, etc.) AND English
- Works on phones, tablets, and computers
- Includes math notation (fractions, equations - all properly formatted)
- Ready to download and use immediately
- Can be edited and improved with AI help

**Who is it for?**
- Teachers creating content for Indian students
- Education companies
- Content reviewers (SMEs)
- Anyone who needs to quickly create educational material

---

## How Does It Work? (The Simple Version)

1. **You fill out a form** - Tell the app what lesson you need (grade level, subject, topic, etc.)
2. **AI creates the lesson** - Takes about 15-30 seconds
3. **You review it** - See it in different views, check if it looks good
4. **You improve it** (optional) - Use AI chat to make changes or add more pages
5. **You download it** - Get a complete HTML file that works anywhere

That's it! Five simple steps.

---

## Setting Up (First Time Only)

Before you can start creating lessons, you need to set things up:

### Step 1: Get Your API Key

You need a special key from Google to use their AI. Here's how:

1. Go to this website: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (it starts with `AIza...`)
5. Save it somewhere safe

### Step 2: Put the Key in Your App

Find a file called `.env.local` in your project folder. Open it and you'll see:

```
VITE_GEMINI_API_KEY=PLACEHOLDER_API_KEY
```

Replace `PLACEHOLDER_API_KEY` with the key you just got:

```
VITE_GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

(Use your actual key, not this example!)

### Step 3: Start the App

Open your terminal/command prompt and type:

```bash
npm run dev
```

Wait a few seconds, then open your browser and go to:

```
http://localhost:3000
```

You should see the ShikshaGen homepage!

---

## Creating Your First Lesson

Okay, now let's make a lesson!

### The Form Fields Explained

When you first open the app, you'll see a form. Here's what each field means:

**Grade** - Which class is this for? (e.g., 3, 5, 8)

**Subject** - What's the topic? (e.g., Mathematics, Science, English)

**LO Code** - A short code for this lesson (e.g., M3L1 for Math Grade 3 Lesson 1). Just make one up if you don't have a system.

**Learning Objective** - What should students learn? 
Example: "Understanding addition of 2-digit numbers"

**Topic Outcome** - What should students be able to do after this lesson?
Example: "Students can add any two numbers up to 99"

**Regional Language** - Which language do your students speak?
Example: Hindi, Tamil, Telugu, Marathi, etc.

**NCERT Context** (Optional) - Any extra notes or instructions
Example: "Use examples from daily life like shopping and travel"

**Upload PDF** (Optional) - If you have an NCERT chapter, you can upload it and the AI will match its style

**Custom Icon** (Optional) - A URL for a custom icon if you want one

### Let's Try an Example

Here's what you might fill in for a Grade 3 Math lesson:

- Grade: **3**
- Subject: **Mathematics**
- LO Code: **M3L1**
- Learning Objective: **Understanding addition with carrying**
- Topic Outcome: **Students can add 2-digit numbers with carrying**
- Regional Language: **Hindi**
- NCERT Context: **Use examples with rupees and common items like pencils, notebooks**

Now click the **"Generate Lesson"** button!

Wait about 15-30 seconds. You'll see a loading animation. Once it's done, boom! Your lesson appears.

---

## Understanding the Screen After Generation

After your lesson is created, you'll see a new layout. Let me explain what's where:

### Top of the Screen
- **ShikshaGen logo** (top-left)
- **"Download Playable Lesson"** button (green button, top-right) - Downloads everything in one file
- **"New Lesson"** button (top-right) - Start over with a new lesson

### Left Side (Sidebar)

This is where you choose how to VIEW your lesson. You have 4 options:

1. **Parallel** - Shows regional language AND English side-by-side
2. **Student** - Shows ONLY the regional language (what students will see)
3. **Review** - Shows ONLY English (for teachers/reviewers)
4. **Source** - Shows the editable text (not pretty HTML, just the content)

### Middle (Main Area)

This is where your lesson appears. You'll see:
- The lesson pages (formatted nicely)
- Navigation arrows (Previous/Next)
- Page counter (tells you which page you're on)
- Download button for individual pages

### Bottom-Right Corner

There's an orange round button - that's your **AI Chat Assistant**! We'll talk about this soon.

---

## The 4 View Modes Explained

### Parallel View (Side-by-Side)

This shows both versions at once - regional language on the left, English on the right.

**When to use this:**
- When you're creating content and want to check both languages
- When a reviewer needs to see both versions
- When comparing translations

**What you can do:**
- Navigate pages (both sides move together)
- Download either version
- See exactly how the translation compares

### Student View (Regional Language Only)

This shows only the regional language version in full screen.

**When to use this:**
- When you want to see exactly what students will see
- When previewing on a tablet or phone
- When you're satisfied with the content and want to check the final look

**What you can do:**
- Download individual pages
- See full-screen preview
- Navigate between pages

### Review View (English Only)

This shows only the English version in full screen.

**When to use this:**
- When sending to SMEs (Subject Matter Experts) for review
- When you only need the English version
- When checking content accuracy

**What you can do:**
- Download individual pages
- See full-screen preview
- Navigate between pages

### Source View (Editable Text)

This shows the raw content in text boxes - not the pretty HTML.

**When to use this:**
- When you need to make precise edits to the content
- When you want to change the structure
- Before regenerating the lesson with updates

**What you can do:**
- Edit every piece of text
- Change examples
- Modify questions
- Click "Regenerate" to create new HTML from your edits

---

## Using AI Chat to Improve Your Lesson

This is the coolest feature! Instead of manually editing, you can just tell the AI what you want.

### Opening the Chat

See that orange round button at the bottom-right? Click it!

A chat window pops up. You have two modes:

### Mode 1: Modify Content

Use this when you want to CHANGE something in your existing lesson.

**How to use it:**
1. Click the chat button
2. Make sure "Modify Content" is selected at the top
3. Type what you want to change
4. Click Send (or press Enter)
5. Wait while AI processes (10-20 seconds)
6. Your lesson updates automatically!

**Real examples you can try:**

> "Make the examples more difficult for advanced students"

This will upgrade the difficulty level of all examples.

> "Add 3 more practice questions about money and shopping"

This will add extra practice questions with rupees and shopping context.

> "Change all student names to common Tamil names"

This will replace names like "Raj" with Tamil names.

> "Simplify the language for younger children"

This will make everything easier to understand.

> "Add examples about Diwali and festival shopping"

This will include cultural context.

**Tips for good results:**
- Be specific about what you want
- Mention how many items if you want additions
- Say which part of the lesson you're talking about
- One change at a time works better than multiple changes

### Mode 2: Add Page

Use this when you want to ADD a completely new page to your lesson.

**How to use it:**
1. Click the chat button
2. Select "Add Page" at the top
3. Describe what kind of page you want
4. Click Send
5. Wait while AI creates it (15-25 seconds)
6. You're automatically taken to the new page!

**Real examples you can try:**

> "Create a quiz page with 5 multiple choice questions"

You'll get a new quiz page with 5 questions and options.

> "Add a summary page with all the key points"

You'll get a revision page listing important concepts.

> "Make a practice page with 10 word problems about trains and distances"

You'll get word problems with Indian context (trains!).

> "Create a challenge page for fast learners with harder problems"

You'll get a bonus/challenge page.

> "Add a visual page explaining the concept with diagrams"

You'll get a more visual explanation page.

**Tips for good results:**
- Clearly state it's a new page
- Mention the type (quiz, summary, practice, etc.)
- Say how many items you want
- Describe the theme or context

---

## Working with Pages

### Navigating Between Pages

Every lesson starts with 3 pages:
- **Page 1:** Title, Learning Objective, Introduction
- **Page 2:** Worked Examples (step-by-step)
- **Page 3:** Practice Questions and Reflection

You can add more pages using AI Chat!

**To move between pages:**
- Click the **◀ Prev** button to go back
- Click the **Next ▶** button to go forward
- Look at the center to see which page you're on (e.g., "Page 2 of 3")

### Deleting a Page

See that small trash icon (🗑️) next to the page number? That's the delete button.

**To delete a page:**
1. Navigate to the page you want to remove
2. Click the trash icon
3. Confirm when asked
4. The page disappears immediately

**Important notes:**
- You can't delete the last page (you need at least one!)
- Deletion is permanent (can't undo)
- Page numbers adjust automatically

**When to delete:**
- You accidentally added a duplicate page
- AI created something you don't need
- You're experimenting and want to clean up

---

## Editing Content Manually

Sometimes you just want to edit text yourself without AI help. Here's how:

### Using Source View

1. Click **"Source"** in the left sidebar
2. You'll see text boxes with all your content
3. Click in any box and type your changes
4. When done, click **"Regenerate Lesson"** at the top

This creates fresh HTML pages with your edits.

### What You Can Edit

**Simple stuff:**
- Title
- Learning Objective
- Introduction text
- Each step of examples
- Questions

**Complex stuff:**
- Practice questions (shows as JSON - a bit technical)
- Word problems (also JSON)

Don't worry if JSON looks confusing - just use AI Chat instead!

### When to Edit Manually vs Use AI Chat

**Edit manually when:**
- Fixing a small typo
- Changing one specific word
- You know exactly what you want

**Use AI Chat when:**
- Making multiple changes
- Not sure about the exact wording
- Want to maintain the lesson's style
- Adding new content

---

## Downloading Your Lesson

You have two download options:

### Option 1: Download Individual Pages

See those download icons on each preview panel? Click one to download just that page.

**You get:**
- One HTML file for that page
- Just the regional OR English version (depends which you clicked)
- Good for sharing one page at a time

**Files are named like:**
- `lesson-regional-page-1.html`
- `lesson-english-page-2.html`

### Option 2: Download Complete Playable Lesson (Recommended!)

See the green **"Download Playable Lesson"** button at the top-right? Click it!

**You get:**
- One HTML file with ALL pages
- Built-in navigation (Previous/Next buttons)
- Progress indicator
- Looks like a real app!
- Works on ANY device (phone, tablet, computer)
- Works OFFLINE (no internet needed after download)

**The file is named:**
- `Full_Lesson_M3L1.html` (or whatever your LO Code was)

**What's inside:**
- A nice header showing subject and lesson info
- Page counter ("Page 2 of 5")
- Previous/Next buttons
- All your lesson pages embedded
- Everything styled and ready to use

**Just open the file in any browser and it works!**

---

## Real-World Example: Creating a Math Lesson

Let me walk you through a complete example:

### Scenario
You need a Hindi lesson for Grade 4 students about multiplication.

### Step 1: Fill the Form
- Grade: **4**
- Subject: **Mathematics**
- LO Code: **M4L5**
- Learning Objective: **Understanding multiplication tables 2 to 5**
- Topic Outcome: **Students can multiply numbers from 2 to 5 tables**
- Regional Language: **Hindi**
- NCERT Context: **Use examples like buying fruits, sharing chocolates**

Click **"Generate Lesson"** → Wait 20 seconds

### Step 2: Review in Parallel View

Look at both versions side by side. 

Oh, you notice:
- Examples are a bit too easy
- Only 2 practice questions (you want more)
- Missing real-world context

### Step 3: Improve with AI Chat

Click the orange chat button.

**First improvement:**
- Select "Modify Content"
- Type: "Make examples use 3-digit numbers for challenge"
- Send → Wait → Lesson updates!

**Second improvement:**
- Type: "Add 5 more word problems about buying fruits and vegetables with prices"
- Send → Wait → Lesson updates!

**Third improvement:**
- Select "Add Page"
- Type: "Create a fun quiz page with 8 questions about the multiplication tables"
- Send → Wait → New page appears!

### Step 4: Check Student View

Click "Student" in the sidebar. See how it looks. Perfect!

### Step 5: Download

Click **"Download Playable Lesson"**

You get: `Full_Lesson_M4L5.html`

### Step 6: Use It

Send this file to teachers, upload to your platform, or open on tablets. Students can now learn!

---

## Understanding How Everything Connects

Here's the big picture of what happens behind the scenes:

### You Create the Blueprint
When you fill out the form, you're giving the AI instructions. Like telling a chef what dish you want.

### AI Generates Content Blocks
The AI creates "blocks" of content:
- A title
- An objective
- Introduction text
- Step-by-step examples
- Practice questions
- Word problems

These blocks are the "source" (what you see in Source View).

### Blocks Become HTML Pages
The AI takes those blocks and wraps them in beautiful HTML with:
- Pretty styling
- Proper formatting
- Math notation
- Responsive design
- Both languages

### You Can Modify Either Level

**Option A: Edit blocks (Source View)**
- Change the raw content
- Click "Regenerate"
- New HTML is created

**Option B: Use AI Chat**
- Tell AI what to change
- AI updates the blocks
- AI regenerates HTML automatically

Both do the same thing, AI Chat is just faster!

---

## Tips for Getting Great Results

### For Better AI Generation

**Be detailed in your Learning Objective:**
- ❌ "Addition"
- ✅ "Understanding addition of 2-digit numbers with carrying"

**Use the NCERT Context field:**
- Add specific instructions
- Mention difficulty level
- Request specific types of examples
- Include cultural context

**Upload PDFs when you have them:**
- Helps AI match NCERT style
- Better terminology matching
- More authentic examples

### For Better AI Chat Results

**Be specific:**
- ❌ "Make it better"
- ✅ "Add 3 more examples using money calculations with rupees"

**One thing at a time:**
- Don't ask for 5 changes in one prompt
- Review each change before the next
- Easier to undo if something goes wrong

**Use context words:**
- Mention the grade level
- Reference the subject
- Say which part of the lesson

### For Better Workflow

**Always check both languages:**
Use Parallel View to make sure translations make sense.

**Test on different devices:**
Download and open on your phone to see how it looks.

**Save versions:**
Download after major changes. Name them clearly (v1, v2, final).

**Start simple, then enhance:**
Generate basic lesson first, THEN improve with AI Chat.

---

## Common Questions

**Q: How long does it take to create a lesson?**
A: First generation takes 15-30 seconds. AI Chat improvements take 10-20 seconds each.

**Q: Can I use this offline?**
A: You need internet to CREATE lessons. But downloaded lessons work offline!

**Q: What if I don't like what the AI generated?**
A: Use AI Chat to fix it! Or click "New Lesson" to start fresh.

**Q: Can I save my work?**
A: Download your lesson (it's saved as HTML). You can always create variations later.

**Q: How many pages can I have?**
A: As many as you want! Use AI Chat's "Add Page" feature.

**Q: What if AI makes a mistake?**
A: Go to Source View, fix the text manually, then click "Regenerate".

**Q: Can I edit the HTML directly?**
A: Yes! In Student View, there's an edit option (advanced users only).

**Q: Does this work on phones?**
A: The creator works best on computers. But the DOWNLOADED lessons work perfectly on phones!

**Q: What formats are supported?**
A: Only HTML for now. But HTML works everywhere!

**Q: Can I use my own branding?**
A: Yes! Use the "Custom Icon" field to add your logo URL.

---

## Troubleshooting Common Issues

### "API Key not found" Error

**What happened:** The app can't find your Google API key.

**Fix:**
1. Check if `.env.local` file exists
2. Open it and make sure it says: `VITE_GEMINI_API_KEY=AIza...`
3. Make sure you replaced the placeholder with your REAL key
4. Stop the server (Ctrl+C) and start again: `npm run dev`

### Lesson Not Generating

**What happened:** You click "Generate" but nothing happens or you get an error.

**Possible reasons:**
- API key is wrong or expired
- You've used up your free API quota
- Internet connection issue
- Form fields incomplete

**Fix:**
- Check browser console (press F12, click "Console" tab)
- Look for red error messages
- Try a simpler prompt first
- Check if API key still works (test on Google's website)

### AI Chat Not Responding

**What happened:** You send a message but nothing happens.

**Fix:**
- Make sure dev server is running
- Check browser console for errors
- Try a simpler prompt
- Refresh the browser page

### Download Not Working

**What happened:** You click download but no file appears.

**Fix:**
- Check your browser's download settings
- Look in your Downloads folder (it might have saved)
- Try a different browser
- Check if popup blocker is interfering

### Translation Looks Wrong

**What happened:** The regional language version doesn't make sense.

**Fix:**
- Use AI Chat: "Improve the Hindi translation to sound more natural"
- Or go to Source View and edit manually
- Or start fresh with better context in NCERT Context field

---

## Best Practices

### Before You Start
- Have your lesson plan ready
- Know the key concepts you want to teach
- Think about your students' level
- Gather any reference materials (NCERT chapters, etc.)

### While Creating
- Start with a good Learning Objective
- Use Parallel View to check both languages
- Make small improvements with AI Chat
- Test each change before making more

### Before Downloading
- Review all pages once
- Check for typos or errors
- Test navigation (Previous/Next)
- View in Student mode for final check

### After Downloading
- Open the file on different devices
- Check that everything displays correctly
- Share with colleagues for feedback
- Save the file with a clear name

---

## Quick Reference Card

**Essential Actions:**

| I want to... | I should... |
|-------------|-------------|
| Create a new lesson | Fill form → Click "Generate Lesson" |
| See both languages | Click "Parallel" in sidebar |
| See student version only | Click "Student" in sidebar |
| Make changes | Click orange chat button |
| Add new pages | Chat → "Add Page" mode |
| Fix specific text | "Source" view → Edit → "Regenerate" |
| Delete a page | Click 🗑️ icon next to page counter |
| Download everything | Click "Download Playable Lesson" (green button) |
| Download one page | Click download icon on that page |
| Start over | Click "New Lesson" at top |

---

## Getting Help

If something's not working:

1. **Check browser console:** Press F12, click "Console" tab, look for errors
2. **Check terminal:** Look at the window where `npm run dev` is running
3. **Read error messages:** They usually tell you what's wrong
4. **Try simple first:** Generate a simple lesson first, then try fancy features
5. **Restart:** When in doubt, stop (`Ctrl+C`) and run `npm run dev` again

---

## Final Tips

**Start simple:** Create your first lesson with basic settings. Get comfortable.

**Experiment freely:** You can always click "New Lesson" to start over.

**Use AI Chat:** It's faster than manual editing for most changes.

**Save often:** Download after major milestones.

**Share and get feedback:** Show to colleagues, get their input.

**Have fun:** This tool is here to make your life easier. Enjoy creating!

---

That's it! You now know everything you need to create amazing lessons with ShikshaGen.

Remember: Start with a simple lesson, experiment with AI Chat, and download when you're happy with the result.

Happy teaching! 🎓

---

*Need more help? Check out the other guide files: QUICK_START.md and LOCAL_DEV_SETUP.md*
