-- Add podcast/video links to Digital Footprint for selected brands.
-- This migration is idempotent: it removes any existing item with the same URL, then appends one canonical entry.

DO $$
DECLARE
  has_required_columns boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'franchises'
      AND column_name = 'slug'
  )
  AND EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'franchises'
      AND column_name = 'two_minute_drill'
  )
  INTO has_required_columns;

  IF NOT has_required_columns THEN
    RAISE NOTICE 'Skipping migration 20260318_add_digital_footprint_videos: public.franchises(slug, two_minute_drill) not found.';
    RETURN;
  END IF;

  WITH links(slug, platform, handle, url) AS (
    VALUES
      (
        'break-coffee',
        'Brand Video',
        'Break Coffee Brand Video',
        'https://vz-a39654c1-0ea.b-cdn.net/1e3512b6-d35d-4894-95c0-fa3e7f562022/play_720p.mp4'
      ),
      (
        'greenlight-mobility',
        'Podcast Interview',
        'GreenLight Mobility: Making Homes Accessible with Karen Frank',
        'https://youtu.be/eNBKDhON-Fs'
      ),
      (
        'payroll-vault',
        'Brand Story Video',
        'Franchise Ownership: Our Brand Story',
        'https://youtu.be/V7hIZ2bcC_U'
      )
  )
  UPDATE public.franchises AS f
  SET two_minute_drill = jsonb_set(
    COALESCE(f.two_minute_drill::jsonb, '{}'::jsonb),
    '{socialMedia}',
    COALESCE(
      (
        SELECT jsonb_agg(item)
        FROM jsonb_array_elements(COALESCE(f.two_minute_drill::jsonb -> 'socialMedia', '[]'::jsonb)) AS item
        WHERE item ->> 'url' IS DISTINCT FROM links.url
      ),
      '[]'::jsonb
    ) || jsonb_build_array(
      jsonb_build_object(
        'platform', links.platform,
        'handle', links.handle,
        'url', links.url
      )
    ),
    true
  )
  FROM links
  WHERE f.slug = links.slug;
END $$;
