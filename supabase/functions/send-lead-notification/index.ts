import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// 1. Brand Routing Map
const BRAND_EMAILS: Record<string, string> = {
  "Payroll Vault": "payrollvault@oakscale.com",
  "Sea Love": "sealove@oakscale.com",
  "Greenlight Mobility": "greenlight@oakscale.com",
  "Break Coffee Co.": "breakcoffee@oakscale.com"
};

serve(async (req) => {
  console.log('send-lead-notification called')
  try {
    const body = await req.json()
    console.log('payload body', body)
    const { record } = body

    // Validate required fields
    if (!record?.id || !record?.broker_id) {
      throw new Error('Missing lead id or broker_id in webhook payload')
    }

    // 2. Initialize Supabase Client to fetch Broker info
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    console.log('initialized supabase client')

    // 3. Fetch the Broker's Name and Network from the profiles table
    console.log('querying profiles for broker', record.broker_id)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, broker_network')
      .eq('id', record.broker_id)
      .single()

    console.log('profile result', profile, profileError)
    if (profileError) {
      console.error('Profile fetch error:', profileError)
      throw new Error(`Failed to fetch broker profile: ${profileError.message}`)
    }

    const brokerName = profile ? `${profile.first_name} ${profile.last_name}` : "Unknown Broker"
    const brokerNetwork = profile?.broker_network || "Independent"

    // 4. Determine destination email
    // TODO: Once Resend domain is verified, uncomment this line:
    // const targetEmail = BRAND_EMAILS[record.brand_interest] || "caleb@oakscale.com"
    // For now, testing with verified email only:
    const targetEmail = "caleb@oakscale.com"

    // 5. Format document links
    const docLinks = record.attachment_url && Array.isArray(record.attachment_url) 
      ? record.attachment_url.map((url: string, i: number) => `<a href="${url}">Document ${i + 1}</a>`).join(', ')
      : 'No documents attached'

    // 6. Send email via Resend
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Oakscale Portal <onboarding@resend.dev>', 
        to: [targetEmail], 
        subject: `New ${record.brand_interest} Referral from ${brokerName}`,
        html: `
          <h2 style="color: #004236;">New Lead for ${record.brand_interest}</h2>
          <p><strong>Broker:</strong> ${brokerName} (${brokerNetwork})</p>
          <hr />
          <p><strong>Candidate:</strong> ${record.first_name} ${record.last_name}</p>
          <p><strong>Email:</strong> ${record.email}</p>
          <p><strong>Phone:</strong> ${record.phone}</p>
          <p><strong>Location:</strong> ${record.city}, ${record.state}</p>
          <p style="background: #f8fafc; padding: 15px; border-radius: 8px;">
            <strong>Broker Notes:</strong><br/>
            <em>"${record.broker_notes || 'No notes provided'}"</em>
          </p>
          <p><strong>Attached Documents:</strong> ${docLinks}</p>
          <hr />
          <p><small>Sent via Oakscale Broker Portal Automation</small></p>
        `,
      }),
    })

    const emailResponseData = await emailRes.json()
    console.log('Resend response status', emailRes.status, emailResponseData)
    console.log('about to update log status')

    if (!emailRes.ok) {
      console.error('Resend API error:', emailResponseData)
      throw new Error(`Email sending failed: ${emailResponseData.message || emailRes.statusText}`)
    }

    // 7. Log successful email send by updating any matching log row(s)
    const { error: updateError } = await supabase
      .from('email_logs')
      .update({ status: 'sent' })
      .eq('lead_id', record.id)

    if (updateError) {
      console.warn('Failed to update email log to sent:', updateError)
    } else {
      console.log('log update succeeded')
    }

    console.log(`✅ Email sent successfully for lead ${record.id} to ${targetEmail}`)

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email sent successfully',
      lead_id: record.id,
      recipient: targetEmail
    }), { 
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error: any) {
    console.error('Error in send-lead-notification:', error.message)
    
    // Try to log the error to email_logs for debugging
    try {
      const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
      const recordJson = await req.json()
      
      if (recordJson?.record?.id) {
        await supabase
          .from('email_logs')
          .update({ 
            status: 'failed',
            error_message: error.message 
          })
          .eq('lead_id', recordJson.record.id)
      }
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { 
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})