# Oakscale Broker Portal - Setup & Troubleshooting Guide

## What We Fixed

### ✅ Database Schema (Migration)
Created a robust database structure in `supabase/migrations/20260305_init_broker_portal.sql`:
- **profiles** table: Stores broker info (synced from auth)
- **leads** table: Stores candidate referrals
- **email_logs** table: Tracks email sending status
- **RLS Policies**: Secure data access patterns
- **Auth Trigger**: Auto-creates profile when user signs up
- **Email Log Trigger**: Tracks every email attempt

### ✅ Edge Function Improvements
Updated `supabase/functions/send-lead-notification/index.ts`:
- Better error handling and logging
- Validates required fields
- Updates email_logs table with success/failure status
- Returns detailed error messages for debugging

---

## Step 1: Deploy the Database Migration

### Option A: Using Supabase CLI (Recommended)
```bash
cd /Users/estebanbogoya/oakscale-portal

# Login to your Supabase project (if not already)
supabase login

# List your projects and select the right one
supabase projects list

# Link the project
supabase link --project-ref <your-project-ref>

# Push the migration
supabase db push
```

### Option B: Using Supabase Dashboard (Manual)
1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/20260305_init_broker_portal.sql`
4. Paste and click **Run**
5. Check for any errors

---

## Step 2: Set Up the Webhook Trigger

This is **critical** - the edge function won't fire without this webhook!

### In Supabase Dashboard:
1. Go to **Database** → **Webhooks**
2. Click **Create a new webhook**
3. Configure as follows:
   - **Name**: `send-lead-notification-webhook`
   - **Table**: `leads`
   - **Events**: Check **Insert**
   - **Function**: Select `send-lead-notification`
   - **Webhook type**: Database function

This webhook triggers your edge function every time a new lead is inserted.

### Verify the Webhook:
1. Go to **Functions** → `send-lead-notification`
2. Click the **Logs** tab
3. You should see logs appear when testing the lead submission

---

## Step 3: Test the Complete Flow

### Test Steps:
1. **Sign up a new broker** at `http://localhost:3000/login`
   - Email: `testbroker@example.com`
   - Password: `TestPassword123`
   - Name: John Doe
   - Network: FranServe

2. **Submit a test lead** at `/submit-lead`
   - Select "Sea Love" as brand
   - Fill in all required fields
   - Click "Submit Candidate Referral"

3. **Check the results**:
   - ✅ Go to Supabase **email_logs** table → should see a "sent" or "failed" status
   - ✅ Go to Supabase **leads** table → your lead should be there
   - ✅ Check Resend dashboard → email should appear (or check spam folder)
   - ✅ Check function logs for any errors

---

## Step 4: Troubleshooting

### Issue: Email shows "failed" in email_logs

**Check these in order:**

1. **Verify RESEND_API_KEY is set**
   ```bash
   # In Supabase Dashboard → Project Settings → Edge Functions
   # Make sure RESEND_API_KEY environment variable is set
   ```

2. **Check function logs for errors**
   - Dashboard → Functions → send-lead-notification → Logs
   - Look for error messages starting with "Error in send-lead-notification"

3. **Verify profile was created**
   ```sql
   SELECT * FROM profiles WHERE id = 'YOUR_USER_ID';
   ```

4. **Check email_logs table**
   ```sql
   SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT 5;
   ```

### Issue: Lead saved but webhook didn't fire

1. **Verify webhook exists** → Database → Webhooks
2. **Check it's linked to the `leads` table**
3. **Verify function is enabled** → Functions page
4. **Check function logs** for invocation errors

### Issue: "Service role doesn't have permission"

This means the RLS policy didn't apply correctly. Run this to verify:
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('profiles', 'leads');

-- Should return (t = true):
-- profiles | t
-- leads    | t
```

---

## Environment Variables Needed

Make sure these are set in Supabase:

| Variable | Where to Get | Notes |
|----------|-------------|-------|
| `RESEND_API_KEY` | resend.com dashboard | Your API key from Resend |
| `SUPABASE_URL` | Supabase Settings | Should already be set |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings | Should already be set |

---

## Next Steps (After Testing Works)

1. **Update the email sender**
   - Change `onboarding@resend.dev` to your verified Resend domain
   - In: `supabase/functions/send-lead-notification/index.ts` line 77

2. **Add actual brand email addresses**
   - Update the `BRAND_EMAILS` mapping with real brand manager emails
   - Test with each brand to ensure routing works

3. **Create an admin dashboard**
   - View all leads (across all brokers)
   - Track email delivery status
   - Update lead status (new → in_progress → placed)

4. **Add email notifications to brokers**
   - Let brokers know when their lead status changes
   - Send monthly referral summaries

---

## Database Schema Reference

### profiles table
```
- id (UUID, Primary Key)
- email (text)
- first_name (text)
- last_name (text)
- broker_network (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### leads table
```
- id (UUID, Primary Key)
- broker_id (UUID, Foreign Key to profiles)
- first_name (text)
- last_name (text)
- email (text)
- phone (text)
- brand_interest (text)
- state (text)
- city (text)
- broker_notes (text)
- attachment_url (text[])
- status (text: 'new', 'in_progress', 'placed', 'rejected')
- created_at (timestamp)
- updated_at (timestamp)
```

### email_logs table
```
- id (UUID, Primary Key)
- lead_id (UUID, Foreign Key to leads)
- recipient_email (text)
- subject (text)
- status (text: 'sent', 'failed', 'pending')
- error_message (text)
- sent_at (timestamp)
```

---

## Quick Commands

**Check if migration worked:**
```sql
SELECT * FROM profiles;
SELECT * FROM leads;
SELECT * FROM email_logs;
```

**Test the auth trigger (creates profile on signup):**
```sql
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 1;
```

**View recent email logs:**
```sql
SELECT lead_id, recipient_email, status, error_message 
FROM email_logs 
ORDER BY sent_at DESC 
LIMIT 10;
```

---

## Support

If issues persist:
1. Check `/supabase/functions/send-lead-notification/` logs
2. Verify RLS policies in Dashboard → Security → Policies
3. Ensure webhook is enabled and linked to `leads` table
4. Confirm RESEND_API_KEY is set correctly
