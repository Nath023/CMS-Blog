CREATE OR REPLACE FUNCTION increment_download_count(row_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE lead_magnets
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
