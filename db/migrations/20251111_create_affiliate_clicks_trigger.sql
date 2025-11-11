-- Migration: Create affiliate clicks trigger
-- Date: 2025-11-11
-- Description: Creates function and trigger to auto-increment affiliate clicks

-- Create function to increment affiliate clicks
CREATE OR REPLACE FUNCTION increment_affiliate_clicks()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE affiliates 
    SET clicks = clicks + 1 
    WHERE id = NEW.affiliate_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-increment affiliate clicks
CREATE TRIGGER auto_increment_affiliate_clicks
    AFTER INSERT ON affiliate_clicks
    FOR EACH ROW
    EXECUTE FUNCTION increment_affiliate_clicks();