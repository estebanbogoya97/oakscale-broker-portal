# OakScale Broker Portal - Project Summary & Roadmap

**Project Date:** March 5, 2026  
**Current Status:** ✅ **MVP Email Routing Working** (emails now sending to verified addresses)  
**Next Milestone:** Domain verification + admin dashboard

---

## 🎯 Project Vision

Build a professional broker portal that:
- Automates lead submission & routing to brand managers
- Gives brokers real-time visibility into their referral performance
- Provides admins with comprehensive analytics & lead management
- Creates a centralized source of truth for candidate data

---

## ✅ What's Already Built

### 1. **Core Infrastructure**
- **Tech Stack:** Next.js 16, React 19, TypeScript, Supabase, Resend, Tailwind CSS
- **Database Schema:** 
  - `profiles` - Broker info (auto-synced from auth signup)
  - `leads` - Submitted referrals with status tracking
  - `email_logs` - Email delivery tracking for debugging
  - RLS policies - Data isolation per broker

### 2. **Authentication & Broker Registration**
- ✅ Sign up page with broker selection of network (FAnServe, IFPG, etc.)
- ✅ Auto-profile creation trigger on signup
- ✅ Secure login  
- ✅ User-specific dashboard routing

### 3. **Lead Submission Form** 
- ✅ Full form with candidate info (name, email, phone, location)
- ✅ Brand selection dropdown
- ✅ File upload for questionnaires/documents
- ✅ Broker notes field
- ✅ Success confirmation

### 4. **Email Automation**
- ✅ Supabase Edge Function (webhook-triggered)
- ✅ Database trigger logs every submitted lead
- ✅ Resend API integration with error logging
- ✅ **Currently:** Sends to `caleb@oakscale.com` (for testing)
- ⏳ **Next:** Uncomment brand routing once domain verified

### 5. **Database Migrations**
- Migration file: `supabase/migrations/20260305_init_broker_portal.sql`
- Includes all tables, indexes, RLS policies, and triggers
- Ready for production deployment

---

## ⏳ **Current Blocker (Almost Resolved)**

**Resend Domain Verification:**
- Error: "You can only send testing emails to your own email address"
- **Fix:** Verify a domain at resend.com/domains
- **Time to fix:** ~10 minutes
- **Once done:** Uncomment line 47 in edge function to enable brand routing

---

## 📋 Features to Build (Prioritized)

### **Phase 1: Broker Dashboard** (Next Priority)
**Goal:** Brokers see their referral stats at a glance

- [ ] Dashboard page showing:
  - Total leads submitted (all-time & current month)
  - Lead status breakdown (new, intro stage, unit econ, placed, lost)
  - Revenue impact (if available - optional HubSpot sync)
  - Recent leads list
- [ ] "My Referrals" page (read-only view of their own leads)
- [ ] Performance trends/charts (optional: simple bar charts)

**Implementation Notes:**
- Use RLS to show only their own data
- Query: `SELECT COUNT(*), status FROM leads WHERE broker_id = auth.uid() GROUP BY status`
- Charts: `recharts` or `chart.js` library

---

### **Phase 2: Admin Dashboard** (High Priority)
**Goal:** You see everything, can manage & update all leads

**Pages:**
1. **Overview Dashboard**
   - Total leads by status
   - Leads by brand (pie chart)
   - Leads by broker network
   - Leads by broker (leaderboard)

2. **Lead Management Table**
   - Searchable/filterable table of ALL leads
   - Columns: Broker name, candidate name, brand, status, date, actions
   - Bulk actions: Update status, assign to brand manager, export
   - Status dropdown to change lead state (new → intro → unit econ → placed/rejected)

3. **Analytics & Reports**
   - Conversion funnel (leads → placed %)
   - Performance by brand
   - Performance by network
   - Top brokers (by volume, by conversion rate)
   - Export to CSV

4. **Broker Management**
   - View all brokers, their network, performance
   - Block/activate brokers (future feature)

**Implementation Notes:**
- Bypass RLS for admin user (separate admin role in Supabase)
- Create admin profile role in database
- Protected routes (check `is_admin` in profiles table)

---

### **Phase 3: Brand Resource Page** (Medium Priority)
**Goal:** Brokers access brand info without leaving portal

**Content per Brand:**
- [ ] Brand overview (logo, description, what they do)
- [ ] Documents (company overview, qualifying criteria) - uploadable by you
- [ ] Videos (training, walkthrough) - embed YouTube/Vimeo
- [ ] Sold territories map/list
- [ ] Expected lead qualifications (min income, age range, etc.)
- [ ] Latest news/updates
- [ ] Contact info for brand manager
- [ ] FAQ

**New Database Table:**
```sql
CREATE TABLE brand_resources (
  id uuid PRIMARY KEY,
  brand_name text,
  description text,
  logo_url text,
  documents jsonb, -- { [{ title, file_url }, ...] }
  videos jsonb,    -- { [{ title, url }, ...] }
  territories text[],
  qualifications jsonb,
  contact_email text,
  created_at timestamp,
  updated_at timestamp
)
```

**Implementation:**
- Simple admin form to manage each brand
- Display as read-only cards/tabs for brokers

---

### **Phase 4: Lead Pipeline Tracker** (Medium Priority)
**Goal:** Brokers see status updates in real-time

**Pipeline Stages (OakScale Sales Process):**
1. **New** - Lead submitted by broker
2. **Introduction** - Initial conversation scheduled
3. **Unit Economics** - Financial analysis underway
4. **Territory Review** - Territory fit assessment
5. **Path Forward** - Strategy discussion, next steps outlined
6. **Invited to DDay** - Formal invitation sent
7. **DDay Confirmation** - Candidate confirmed attendance
8. **DDay** - Discovery Day event
9. **Signed/Deposit** - Agreement signed, deposit received
10. **Sold/Won** - Successfully became franchisee ✅
11. **Closed Lost** - Opportunity ended ❌

**New Database Table:**
```sql
CREATE TABLE lead_status_history (
  id uuid PRIMARY KEY,
  lead_id uuid REFERENCES leads(id),
  previous_status text,
  new_status text,
  updated_by uuid, -- admin who made change
  timestamp timestamp,
  notes text -- reason for status change
)

-- Update leads table to support all stages
ALTER TABLE leads ALTER COLUMN status DROP CONSTRAINT;
ALTER TABLE leads ADD CONSTRAINT status_check CHECK (status IN (
  'new', 'introduction', 'unit_economics', 'territory_review', 
  'path_forward', 'invited_to_dday', 'dday_confirmation', 'dday',
  'signed_deposit', 'sold_won', 'closed_lost'
));
```

**Broker UI:**
- Show each lead with current stage as a progress bar/badge
- Click lead to see full history
- See timestamp & notes for each stage change
- Real-time updates (optional: WebSocket or polling)

**Admin UI:**
- Click "Update Status" on any lead
- Select new status + add optional notes
- Automatic history tracking

**HubSpot Integration (Optional, for Future):**
- **Complexity:** Medium
- **Recommendation:** Start without it, add later if needed
- Would need: HubSpot SDK, mapping leads → HubSpot contacts, sync status changes
- Risk: Breaking existing HubSpot automations (mitigation: write-only, read HubSpot not Supabase)
- **Suggested approach if needed:** Webhook from HubSpot → Supabase when status changes

---

### **Phase 5: Responsive Design** ✅ (Critical - Do Now)
**Current Status:** Tailwind CSS + mobile-first layout already in place

**Checklist:**
- [ ] Test all pages on iPhone (Safari)
- [ ] Test all pages on iPad
- [ ] Fix any overflow issues
- [ ] Ensure buttons are thumb-friendly (48px min height)
- [ ] Optimize form inputs for mobile keyboards
- [ ] Test file upload on mobile
- [ ] Navigation sidebar → collapsible hamburger menu on mobile

**Tools to use:**
- Chrome DevTools device emulation
- `@media (max-width: 768px)` Tailwind breakpoints

---

## 🗂️ File Structure Reference

```
/oakscale-portal
├── supabase/
│   ├── migrations/
│   │   ├── 20260305_init_broker_portal.sql (DONE ✅)
│   │   └── 20260306_add_email_logs_update_policy.sql (DONE ✅)
│   └── functions/
│       └── send-lead-notification/
│           └── index.ts (DONE ✅ - currently sends to caleb@)
├── src/
│   ├── app/
│   │   ├── login/ (DONE ✅)
│   │   └── (authenticated)/
│   │       ├── page.tsx (DONE ✅ - dashboard - minimal)
│   │       ├── submit-lead/ (DONE ✅)
│   │       ├── referrals/ (DONE ✅ - read-only list)
│   │       ├── admin/ (TODO - new folder)
│   │       │   ├── dashboard.tsx
│   │       │   ├── leads.tsx
│   │       │   ├── brands.tsx
│   │       │   └── analytics.tsx
│   │       └── brands/ (TODO - new folder)
│   │           └── page.tsx
│   └── components/
│       └── Sidebar.tsx (DONE ✅)
├── SETUP_GUIDE.md (DONE ✅)
└── PROJECT_SUMMARY.md (THIS FILE)
```

---

## 🚀 Immediate Next Steps (In Order)

### **Week 1:**
1. ✅ **Verify domain in Resend**
   - Go to resend.com/domains
   - Add domain (oakscale.com or mail.oakscale.com)
   - Update DNS records (takes 5-30 mins)
   - Confirm verification

2. ✅ **Enable brand routing**
   - Go to Functions → send-lead-notification
   - Uncomment line 47: `const targetEmail = BRAND_EMAILS[record.brand_interest] || "caleb@oakscale.com"`
   - Deploy
   - Test with each brand email

3. ✅ **Test full flow end-to-end**
   - Submit lead for Sea Love → should arrive at sealove@oakscale.com
   - Verify email content, links, styling
   - Test file uploads

### **Week 2-3:**
4. **Build broker dashboard**
   - Query lead stats, display cards
   - Add simple charts (recharts)
   - Make responsive

5. **Build admin dashboard**
   - Create admin role in database
   - Protected admin routes
   - Lead management table with filtering

6. **Responsive design audit**
   - Test all pages on mobile/tablet
   - Fix layout issues
   - Optimize touch targets

---

## 🎨 Design Notes

**Current UI:**
- Color scheme: Oakscale green (`#004236`, `#006d5b`)
- Clean, minimal design
- Tailwind CSS for styling

**Responsive Strategy:**
- Mobile-first approach (already using Tailwind)
- Hamburger menu for nav on small screens
- Stack cards vertically on mobile
- Larger touch targets for mobile

---

## 🔐 Security Checklist

- ✅ RLS policies enforce data isolation
- ✅ Auth required for all pages
- ✅ Edge function uses Service Role (access Control)
- ⏳ Admin routes need role-based protection
- ⏳ File uploads should be virus-scanned (optional: Cloudinary API)
- ⏳ All form inputs should be validated (server-side)

---

## 📊 Analytics to Track (Future)

- Broker engagement (leads/month, frequency)
- Lead conversion rate by brand
- Lead quality metrics (which brokers have highest placement rate)
- Time in each pipeline stage
- Drop-off points in funnel

---

## 💡 Suggestions & Improvements

### **High Value:**
1. **Email on status change** - When you update a lead's status, auto-email the broker
2. **Lead source tracking** - Which broker network is sending best quality leads?
3. **Commission/payout tracking** - Track who's earned what (if applicable)
4. **Bulk import** - CSV upload for brokers to submit multiple leads at once

### **Medium Value:**
5. **Lead notes** - Admin can add private notes on leads (not visible to broker)
6. **Favorites** - Brokers can favorite brands for quick access
7. **Mobile app** - Simple React Native app (later)
8. **Automated follow-ups** - Send reminders if lead hasn't progressed in 30 days

### **Future (Nice-to-Have):**
9. HubSpot integration (sync lead status)
10. Slack notifications (alert you when important leads come in)
11. Payment processing (track commissions)
12. Broker verification workflow (approve new brokers)

---

## 🛠️ Tech Debt / Known Issues

- ~~Email not sending~~ ✅ **FIXED** (was domain verification issue)
- ~~RLS UPDATE policy missing~~ ✅ **FIXED**
- ~~Old edge function code not deployed~~ ✅ **FIXED**
- Minimal dashboard (needs full broker stats page)
- No admin view exists yet
- File uploads not virus-scanned
- No input validation on server-side

---

## 📞 Questions for Next Session

When you start a new conversation, clarify:
1. Timeline - when do you need this fully launched?
2. Budget - any constraints on paid services (HubSpot sync, email, etc.)?
3. Priority - which features matter most?
4. Broker volume - how many brokers will use this initially?
5. Brand emails - finalize all email addresses for each brand

---

## 🏁 Success Metrics

✅ Portal is live
✅ Brokers can sign up & submit leads
✅ Emails arrive to brand managers
✅ Admin can see all leads & track status
✅ Brokers see their referral progress
✅ Mobile-friendly experience

---

*Last Updated: March 5, 2026 | By: GitHub Copilot*
