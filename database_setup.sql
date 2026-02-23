-- Copy and run this entire file in your Supabase SQL Editor

-- 1. Create departments table
CREATE TABLE departments (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    icon text NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create sops table
CREATE TABLE sops (
    id text PRIMARY KEY,
    title text NOT NULL,
    department text NOT NULL, -- references departments(title) informally in our UI
    "documentType" text NOT NULL,
    status text NOT NULL,
    date text NOT NULL,
    author text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Policies (for prototyping)
-- Allows any anon user to Read and Insert. 
-- In a real app, you would restrict INSERT to authenticated admin users only.
CREATE POLICY "Enable read access for all anon users" ON departments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all anon users" ON departments FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all anon users" ON sops FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all anon users" ON sops FOR INSERT WITH CHECK (true);
