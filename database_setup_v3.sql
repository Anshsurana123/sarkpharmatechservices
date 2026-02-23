-- Copy and run this entire file in your Supabase SQL Editor

-- Give public or anonymous users permission to DELETE and UPDATE departments
CREATE POLICY "Allow public delete to departments" ON departments FOR DELETE USING (true);
CREATE POLICY "Allow public update to departments" ON departments FOR UPDATE USING (true);

-- Give public or anonymous users permission to DELETE and UPDATE sops
CREATE POLICY "Allow public delete to sops" ON sops FOR DELETE USING (true);
CREATE POLICY "Allow public update to sops" ON sops FOR UPDATE USING (true);
