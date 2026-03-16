# OakScale Resource Page - Project Plan v2.0

**Date Created:** March 16, 2026  
**Project Status:** New Direction - Resource Page Priority  
**Timeline:** 2 weeks to launch  
**Target Launch:** ~March 30, 2026

---

## 🎯 Project Overview

**Goal:** Build a public-facing Resource Page showcasing all 4 OakScale franchise brands (Sea Love, Payroll Vault, Break Coffee, GreenLight Mobility) with modern, responsive design.

**Key Differentiator:** 
- Landing page uses OakScale brand colors (green, white)
- Each franchise page dynamically switches to that franchise's brand colors
- No authentication required - completely public and shareable

**Future Integration:**
- Eventually add "Register as Broker" CTA
- Link to broker portal (already built in Phase 1-5)
- Serves as top-of-funnel for lead generation

---

## 📋 Resource Information Available

**Source:** Google Drive Presentation  
https://docs.google.com/presentation/d/1zmxn6QbUiJl8iJFNONW1y8g7choH5OQIlLGapcnnLHU/edit

**Assets per Franchise:**
- Videos
- PDFs (one-pagers, documentation)
- Images
- Slides
- Contact information
- Brand guidelines (colors, logos)

**Note:** User will provide specific color codes and asset inventory per franchise

---

## 🏗️ Technical Architecture

### Database Schema

```sql
-- Franchises Table
CREATE TABLE franchises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  about text,
  logo_url text,
  hero_image_url text,
  primary_color text, -- HEX code
  secondary_color text,
  accent_color text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Franchise Resources
CREATE TABLE franchise_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id uuid NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('video', 'pdf', 'image', 'faq')),
  title text NOT NULL,
  url text,
  description text,
  order_position int,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Franchise Contacts
CREATE TABLE franchise_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id uuid NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
  name text NOT NULL,
  title text,
  email text,
  phone text,
  linkedin_url text,
  created_at timestamp DEFAULT now()
);

-- FAQs
CREATE TABLE franchise_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id uuid NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  order_position int,
  created_at timestamp DEFAULT now()
);
```

**No RLS required** - All tables are public (no sensitive data, intentionally shareable)

---

## 🎨 Design System

### Color Scheme

**OakScale (Landing & Navbar):**
- Primary: `#004236` (dark green)
- Secondary: `#006d5b` (medium green)
- Accent: `#1da857` (lighter green)
- Background: white / off-white

**Per-Franchise Colors:**
- Sea Love: [Colors TBD - from Drive]
- Payroll Vault: [Colors TBD]
- Break Coffee: [Colors TBD]
- GreenLight Mobility: [Colors TBD]

### Theme Implementation

**Approach:**
1. Supabase stores brand colors per franchise
2. Next.js dynamic routes apply colors via CSS variables
3. Tailwind theme config switches based on route

**Example:**
```tsx
// /franchises/[slug]/page.tsx
export default function FranchisePage({ params }) {
  const franchise = fetchFranchise(params.slug);
  
  return (
    <div style={{
      '--primary-color': franchise.primary_color,
      '--secondary-color': franchise.secondary_color,
    } as React.CSSProperties}>
      {/* Content */}
    </div>
  );
}
```

---

## 📄 Page Structure

### 1. Landing Page (`/`)

**Layout:**
```
Header (Navbar)
├── OakScale Logo
├── Navigation (About, Franchises, Contact)
└── CTA "Explore Franchises"

Hero Section
├── Main headline: "Discover OakScale Franchise Opportunities"
├── Subheading: "Professional franchises vetted for sustainable growth"
└── Hero image (or gradient)

Franchise Cards Grid (4 columns, responsive)
├── Card 1: Sea Love
│   ├── Logo
│   ├── Brief description (2-3 lines)
│   └── "Learn More" button
├── Card 2: Payroll Vault
├── Card 3: Break Coffee
└── Card 4: GreenLight Mobility

Footer
├── Links (Privacy, Terms, Contact)
└── Copyright + Social (optional)
```

### 2. Franchise Detail Pages (`/franchises/[slug]`)

**Layout:**
```
Header (Same navbar, but brand color)

Hero Section (Brand-colored)
├── Brand logo (large)
├── Franchise name
└── Tagline / elevator pitch

Content Tabs / Sections:
├── About
│   ├── Full franchise description
│   ├── Key stats (units open, growth rate, etc)
│   └── Mission/vision
│
├── Resources / Explore
│   ├── Videos gallery
│   ├── PDFs / One-pagers (downloadable)
│   ├── Image gallery
│   └── Presentation slides
│
├── Key Contacts
│   ├── Contact cards (name, title, email, phone)
│   ├── LinkedIn links
│   └── "Contact Us" button
│
├── FAQs
│   ├── Accordion (Q&A pairs)
│   └── "Still have questions?" CTA
│
└── CTA Section
    └── "Interested? Register as a Broker" (future phase)

Footer (Brand colored)
```

---

## 🗂️ File Structure

```
/oakscale-portal
├── src/
│   ├── app/
│   │   ├── page.tsx (Landing page)
│   │   ├── franchises/
│   │   │   ├── page.tsx (Franchises overview - optional)
│   │   │   └── [slug]/
│   │   │       └── page.tsx (Individual franchise page)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx (Dynamic color switching)
│   │   ├── FranchiseCard.tsx
│   │   ├── VideoGallery.tsx
│   │   ├── ResourceGrid.tsx
│   │   ├── ContactCard.tsx
│   │   ├── FAQAccordion.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── supabase.ts (Already exists)
│   │   └── franchiseUtils.ts (Fetch, cache franchises)
│   └── styles/
│       └── brands.css (CSS variables per brand)
│
├── supabase/
│   └── migrations/
│       └── 20260316_resource_page_schema.sql (NEW)
│
└── public/
    └── franchises/ (Images, logos)
```

---

## 🚀 2-Week Sprint Breakdown

### **Week 1: Infrastructure & Setup**

**Day 1-2: Database & Migrations**
- [ ] Create migration file `20260316_resource_page_schema.sql`
- [ ] Define all 4 tables (franchises, resources, contacts, faqs)
- [ ] Seed initial franchise data (names, slugs, colors, descriptions)
- [ ] NO RLS needed (public data)

**Day 3: UI Component System**
- [ ] Create Navbar component (responsive, logo, nav links)
- [ ] Create FranchiseCard component
- [ ] Create Footer component
- [ ] Setup CSS variables system for brand colors
- [ ] Test color switching

**Day 4: Landing Page**
- [ ] Build hero section
- [ ] Build franchise cards grid
- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] Navigation between pages

**Day 5: Styling & Polish**
- [ ] Tailwind config optimization
- [ ] Responsive testing
- [ ] Dark mode check (if desired)

### **Week 2: Franchise Pages & Launch**

**Day 1-2: Individual Franchise Pages**
- [ ] Dynamic route `/franchises/[slug]`
- [ ] Fetch franchise data by slug
- [ ] Build About section
- [ ] Build Resources section (video/PDF grid)
- [ ] Build Contacts section
- [ ] Build FAQs accordion
- [ ] Apply dynamic theme colors

**Day 3: Media & Assets**
- [ ] Setup Supabase Storage for uploads (or link to Google Drive)
- [ ] Video embedding (YouTube/Vimeo or direct links)
- [ ] PDF viewer component
- [ ] Image gallery / lightbox

**Day 4: Testing & Optimization**
- [ ] Mobile responsiveness audit
- [ ] Performance check (Lighthouse)
- [ ] Image optimization
- [ ] Lazy loading for videos
- [ ] Link all franchise pages

**Day 5: Deployment & Handoff**
- [ ] Deploy to production
- [ ] Final QA
- [ ] Document CMS for future updates
- [ ] Create admin guide (how to update content)

---

## 📊 Next Steps Checklist

**Critical - Needed from User:**

- [ ] Franchise color codes (HEX or RGB, primary/secondary/accent per franchise)
- [ ] List of assets per franchise:
  - How many videos? (link format?)
  - How many PDFs? (available in Drive or need upload?)
  - Images? (logos, hero images)
  - Specific contacts for each franchise?
  - FAQ questions/answers?

**Technical Setup (I'll do):**

- [ ] Create migration SQL file
- [ ] Setup Next.js pages structure
- [ ] Build all components
- [ ] Implement theme switching
- [ ] Mobile responsive testing

**Before Launch:**

- [ ] Populate database with franchise data
- [ ] Upload/link all media assets
- [ ] Test all franchise pages
- [ ] SEO optimization (meta tags, titles)
- [ ] Performance optimization

---

## 🎯 Success Criteria

✅ Landing page is modern, responsive, brand-accurate  
✅ All 4 franchise pages load with correct brand colors  
✅ Videos/PDFs display correctly  
✅ Mobile experience is smooth (tested on iPhone, Android, iPad)  
✅ Contact information is accessible  
✅ FAQs are helpful and organized  
✅ Load time < 3 seconds  
✅ No authentication required - completely public  
✅ Links shareable (brokers can share with clients)  

---

## 🔄 Future Phases (After Resource Page Launch)

1. **Add "Register as Broker" CTA** → Links to broker portal
2. **Analytics** → Track which franchises get most traffic
3. **Email capture** → Newsletter signup for franchise updates
4. **Blog section** → News, success stories per franchise
5. **Admin panel** → Easy content editing (no coding needed)
6. **Chatbot** → Q&A bot for FAQs
7. **Lead form** → "Interested brokers" capture
8. **Integration** → Link to existing broker portal login

---

## 💬 Key Contacts & Info

**Franchises:**
1. Sea Love - [Info TBD from Drive]
2. Payroll Vault - [Info TBD]
3. Break Coffee - [Info TBD]
4. GreenLight Mobility - [Info TBD]

**OakScale Branding:**
- Primary Green: `#004236`
- Secondary Green: `#006d5b`
- Logo: [Available - check project]

---

## 📫 Communication Plan

**Weekly Check-ins:**
- Day 5 of each week: Status update, blockers, feedback

**Asset Delivery:**
- Ideally all assets uploaded to Supabase Storage by end of Day 2 (Week 1)
- Franchise data (colors, contacts, FAQs) by end of Day 1 (Week 1)

**Go-Live:**
- Soft launch (invite-only) - end of Week 2, Day 4
- Public launch - end of Week 2, Day 5

---

## 🔒 Important Notes

- **No authentication required** - This is critical for shareability
- **Fast load time** - Use Supabase caching where possible
- **Mobile first** - Over 50% of traffic likely via mobile
- **Brand consistency** - Each franchise page must feel premium and professional
- **Accessibility** - Color contrast, alt tags, keyboard navigation
- **SEO** - Each franchise page should rank for "[Franchise Name] opportunity"

---

*Document Version: 2.0 | Last Updated: March 16, 2026*  
*Next Update: When user provides franchise color codes and asset inventory*
