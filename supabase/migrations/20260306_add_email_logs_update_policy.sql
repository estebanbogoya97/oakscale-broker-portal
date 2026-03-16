-- Add update policy for email_logs so service role can mark status

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_update_logs" ON email_logs
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
