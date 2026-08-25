-- ============================================================
-- VYBE — Migration 002
-- Utility functions
-- ============================================================

-- Increment response count safely
CREATE OR REPLACE FUNCTION increment_response_count(drop_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE drops SET response_count = response_count + 1 WHERE id = drop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
