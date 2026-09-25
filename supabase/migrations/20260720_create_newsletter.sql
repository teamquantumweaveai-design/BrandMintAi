-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'website_footer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for website subscribers
CREATE POLICY "Allow anonymous newsletter subscription" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Allow admins to view subscribers
CREATE POLICY "Allow authenticated read on newsletter_subscribers" ON newsletter_subscribers
  FOR SELECT USING (auth.role() = 'authenticated');
