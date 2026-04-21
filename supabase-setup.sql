-- Al Nibras Finance - Supabase Database Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  parent_pin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table (for admin)
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- App Content (CMS)
CREATE TABLE app_books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE app_courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE app_badges (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_badges ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles: users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Profiles: users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Profiles: admins can view all
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Transactions: users can CRUD own
CREATE POLICY "Users can CRUD own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id);

-- Customers: users can view all
CREATE POLICY "Anyone can view customers" ON customers
  FOR SELECT USING (true);

-- Customers: users can insert own
CREATE POLICY "Users can insert customers" ON customers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CMS: public can read
CREATE POLICY "Public can read books" ON app_books FOR SELECT USING (true);
CREATE POLICY "Public can read courses" ON app_courses FOR SELECT USING (true);
CREATE POLICY "Public can read badges" ON app_badges FOR SELECT USING (true);

-- Admins can CRUD CMS
CREATE POLICY "Admins can CRUD books" ON app_books
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can CRUD courses" ON app_courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can CRUD badges" ON app_badges
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample CMS data
INSERT INTO app_books (title, url) VALUES
  ('Islamic Finance 101', 'https://example.com/islamic-finance-101'),
  ('Teaching Kids About Money', 'https://example.com/kids-money');

INSERT INTO app_courses (title, description, thumbnail) VALUES
  ('Basics of Saving', 'Learn how to save money the Islamic way', '💰'),
  ('Understanding Zakat', 'What is Zakat and how to calculate it', '🕌'),
  ('Goal Setting', 'How to set and achieve financial goals', '🎯');

INSERT INTO app_badges (title, icon, description) VALUES
  ('First Saver', '🏆', 'Save your first dollar'),
  ('Goal Getter', '🎯', 'Reach a savings goal'),
  ('Quiz Master', '🧠', 'Complete 5 quizzes');

-- Create indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_profiles_role ON profiles(role);