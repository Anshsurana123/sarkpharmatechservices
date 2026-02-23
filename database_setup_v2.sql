-- Copy and run this entire file in your Supabase SQL Editor

-- 1. Add new columns to the existing sops table
ALTER TABLE sops ADD COLUMN content text;
ALTER TABLE sops ADD COLUMN file_url text;

-- 2. Create the Storage Bucket for the SOP word documents
INSERT INTO storage.buckets (id, name, public) VALUES ('sops', 'sops', true);

-- 3. Set up Storage Security Policies for the 'sops' bucket
-- Allow public access to read the files
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'sops' );

-- Allow public access to insert files (Normally, restrict to authenticated users)
CREATE POLICY "Anon Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'sops' );
