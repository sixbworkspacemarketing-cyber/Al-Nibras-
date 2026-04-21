-- SIMPLE Supabase Setup - Just Copy & Run This!

-- 1. Create Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  parent_pin TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create Transactions Table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create CMS Tables
CREATE TABLE app_books (id SERIAL PRIMARY KEY, title TEXT, url TEXT, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE app_courses (id SERIAL PRIMARY KEY, title TEXT, description TEXT, thumbnail TEXT, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE app_badges (id SERIAL PRIMARY KEY, title TEXT, icon TEXT, description TEXT, created_at TIMESTAMP DEFAULT NOW());

-- 4. Enable Security (Copy this exactly)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_badges ENABLE ROW LEVEL SECURITY;

-- 5. Give everyone read access (for now)
CREATE POLICY "public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "public read" ON transactions FOR SELECT USING (true);
CREATE POLICY "public read" ON app_books FOR SELECT USING (true);
CREATE POLICY "public read" ON app_courses FOR SELECT USING (true);
CREATE POLICY "public read" ON app_badges FOR SELECT USING (true);

-- 6. Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN INSERT INTO profiles (id, email) VALUES (NEW.id, NEW.email); RETURN NEW; END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 7. Add sample data
INSERT INTO app_courses (title, description, thumbnail) VALUES ('Saving Basics', 'Learn to save', '💰'), ('Zakat Explained', 'What is Zakat?', '🕌');
INSERT INTO app_badges (title, icon, description) VALUES ('First Saver', '🏆', 'Save first dollar');