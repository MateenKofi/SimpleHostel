# Landing Page Implementation Plan

## Overview
This document outlines the plan for implementing and maintaining the landing page for SimpleHostel - a hostel management system frontend.

## Current Landing Page Structure

### Existing Public Routes
- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- `/find-hostel` - Find hostel page
- `/login` - Login page
- `/register` - Register page

### Component Location
- **Directory**: `src/pages/landing-page/`
- **Related components**: `src/components/` (shared components may be used)

---

## Design System & Guidelines

### Color Palette
The application uses a **sage-green centered** color scheme. See `CLAUDE.md` for full color specifications.

### Component Standards
- Use theme variables (never hardcode colors)
- Follow Shadcn UI + Tailwind CSS patterns
- Mobile-first responsive design
- Accessibility-first approach

---

## Implementation Rules

### DO:
- Use the approved tech stack (React, Tailwind, Shadcn UI)
- Follow the sage-green color scheme with theme variables
- Make all components mobile-responsive
- Use semantic HTML elements
- Follow accessibility best practices (ARIA labels, keyboard navigation)
- Reuse existing components from `src/components/ui/` where possible
- Use TypeScript for type safety
- Test on multiple screen sizes (mobile, tablet, desktop)

### DO NOT:
- Create duplicate components (check `src/components/` first)
- Hardcode colors (use `bg-primary`, `text-foreground`, etc.)
- Break existing functionality
- Add new dependencies without justification
- Skip mobile responsiveness
- Use inline styles (use Tailwind classes)

---

## Landing Page Sections

### 1. Hero Section
- Catchy headline and subheadline
- Call-to-action buttons (Find Hostel, Book Now)
- Hero image or illustration

### 2. Features Section
- Key features of the hostel management system
- Icons and brief descriptions
- Grid layout (responsive)

### 3. About Section
- Brief company/overview
- Mission statement
- Team or values

### 4. Amenities/Services Section
- List of hostel amenities
- Photos or icons
- Detailed descriptions

### 5. Testimonials/Social Proof
- User reviews
- Ratings
- Success stories

### 6. Pricing/Packages Section
- Room types and pricing
- Package deals
- Comparison table (optional)

### 7. Contact/CTA Section
- Contact form
- Address/map
- Social media links
- Final call-to-action

### 8. Footer
- Navigation links
- Legal links (Privacy, Terms)
- Contact information
- Social media icons

---

## Component Files to Modify/Create

### Existing Files (may need updates)
- `src/pages/landing-page/Home.tsx` (or similar)
- `src/pages/landing-page/About.tsx`
- `src/pages/landing-page/Contact.tsx`
- `src/pages/landing-page/FindHostel.tsx`

### New Components (if needed)
- Create in `src/components/` if reusable
- Create in `src/pages/landing-page/components/` if page-specific

---

## Development Workflow

1. **Planning**: Update this PLAN.md before starting new features
2. **Implementation**: Create/update components following the rules above
3. **Testing**: Test on mobile, tablet, and desktop viewports
4. **Build Check**: Run `npm run build` to ensure no TypeScript errors
5. **Linting**: Run `npm run lint` before committing

---

## Landing Page UX Rules

### 01. USER INTENT FIRST
Before design, do this:
- Write the top 1 problem your user wants solved
- Write the top 1 outcome they want
- Remove everything not serving that outcome
- One page, one goal (no exceptions)

### 02. ABOVE THE FOLD
Your first 5 seconds matter:
- One clear headline
- One supporting sentence
- One primary CTA
- No sliders
- No stock photos

### 03. HEADLINE FORMULA
Use this every time:
- State outcome, not features
- Mention who it is for
- Remove clever words
- Read it out loud
- If unclear, rewrite

### 04. SUBHEAD COPY
Support, do not repeat:
- Explain how the outcome happens
- Keep it under 2 lines
- Simple language only
- No buzzwords
- No company story here

### 05. PRIMARY CTA
Make the action obvious:
- One main CTA only
- Use action words
- Place it above the fold
- Repeat it consistently
- Same wording everywhere

### 06. SOCIAL PROOF
Reduce doubt fast:
- Add logos of real clients
- Add 1 short testimonial
- Use real names and roles
- Place near CTA
- No fake reviews

### 07. PAGE STRUCTURE
Use this order:
1. Problem
2. Solution
3. Proof
4. How it works
5. CTA
6. FAQ
7. Final CTA

### 08. VISUAL HIERARCHY
Guide the eye:
- One H1 only
- Clear spacing between sections
- Use bullet points
- Limit font sizes
- White space is your friend

### 09. COPY LENGTH
Short beats clever:
- 1 idea per section
- Max 3 lines per paragraph
- Bullets over paragraphs
- Cut 30% after writing
- Then cut again

### 10. IMAGES
Show, do not decorate:
- Use product screenshots
- Show real interfaces
- Avoid abstract illustrations
- One visual per section
- Compress for speed

### 11. MOBILE FIRST
Design here first:
- Check mobile layout first
- Stack content vertically
- Large tap targets
- No tiny text
- Test on real device

### 12. SPEED CHECK
Slow pages lose money:
- Compress images
- Remove heavy animations
- Limit fonts
- Test with PageSpeed
- Fix red flags only

### 13. FORMS
Less fields, more leads:
- Ask only what you need
- Name and email first
- No long forms
- Clear error messages
- Confirm submission clearly

### 14. TRUST SIGNALS
Make it safe to convert:
- Add privacy note near forms
- Show contact method
- Add company location
- Use HTTPS
- Avoid aggressive pop-ups

### 15. DIY USER TESTING
No tools needed:
- Ask 3 people to use the page
- Watch silently
- Note where they hesitate
- Focus on non-obvious issues
- Repeat once

### 16. FINAL CHECK
Before publishing:
- One goal per page
- One CTA
- Clear headline
- Fast load
- Mobile clean

---

## Notes
- This is a living document - update as requirements change
- Refer to `CLAUDE.md` for full project context and color scheme
- All public pages are under `src/pages/landing-page/`
