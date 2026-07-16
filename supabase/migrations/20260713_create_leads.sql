-- Create enum types
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'lost');
CREATE TYPE admin_role AS ENUM ('admin', 'manager');

-- Create admin_users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role admin_role DEFAULT 'manager'::admin_role,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  status lead_status DEFAULT 'new'::lead_status,
  assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
