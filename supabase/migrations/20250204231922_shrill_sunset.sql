/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - name (text)
      - phone (text)
      - created_at (timestamptz)
      
    - trades
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - coin (text)
      - entry_price (numeric)
      - quantity (numeric)
      - fees (numeric)
      - notes (text)
      - status (text)
      - selected_plan_id (uuid)
      - date (date)
      - time (time)
      - created_at (timestamptz)
      
    - exit_plans
      - id (uuid, primary key)
      - trade_id (uuid, references trades)
      - target_price (numeric)
      - quantity (numeric)
      - stop_loss (numeric)
      - notes (text)
      - status (text)
      - created_at (timestamptz)
      
    - simulations
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - coin (text)
      - entry_price (numeric)
      - investment (numeric)
      - entry_fees (numeric)
      - exit_fees (numeric)
      - network_fees (numeric)
      - exit_price (numeric)
      - notes (text)
      - date (date)
      - time (time)
      - created_at (timestamptz)
      
    - ideas
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - content (text)
      - color (text)
      - position_x (numeric)
      - position_y (numeric)
      - created_at (timestamptz)
      
    - signals
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - coin (text)
      - type (text)
      - entry_price (numeric)
      - target_price (numeric)
      - stop_loss (numeric)
      - description (text)
      - risk (text)
      - status (text)
      - created_at (timestamptz)
      
    - videos
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - title (text)
      - url (text)
      - description (text)
      - category (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  name text,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Create trades table
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  coin text NOT NULL,
  entry_price numeric NOT NULL,
  quantity numeric NOT NULL,
  fees numeric NOT NULL DEFAULT 0,
  notes text,
  status text NOT NULL DEFAULT 'open',
  selected_plan_id uuid,
  date date NOT NULL,
  time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create exit_plans table
CREATE TABLE IF NOT EXISTS exit_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  trade_id uuid REFERENCES trades(id) ON DELETE CASCADE,
  target_price numeric NOT NULL,
  quantity numeric NOT NULL,
  stop_loss numeric NOT NULL,
  notes text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create simulations table
CREATE TABLE IF NOT EXISTS simulations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  coin text NOT NULL,
  entry_price numeric NOT NULL,
  investment numeric NOT NULL,
  entry_fees numeric NOT NULL DEFAULT 0,
  exit_fees numeric NOT NULL DEFAULT 0,
  network_fees numeric NOT NULL DEFAULT 0,
  exit_price numeric NOT NULL,
  notes text,
  date date NOT NULL,
  time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  color text NOT NULL,
  position_x numeric NOT NULL DEFAULT 0,
  position_y numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create signals table
CREATE TABLE IF NOT EXISTS signals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  coin text NOT NULL,
  type text NOT NULL,
  entry_price numeric NOT NULL,
  target_price numeric NOT NULL,
  stop_loss numeric NOT NULL,
  description text,
  risk text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  description text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
DO $$ 
BEGIN
  -- Enable RLS for each table if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'users' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'trades' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'exit_plans' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE exit_plans ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'simulations' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'ideas' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'signals' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'videos' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create or replace policies
DO $$ 
BEGIN
  -- Users policies
  DROP POLICY IF EXISTS "Users can manage their own data" ON users;
  CREATE POLICY "Users can manage their own data" ON users
    FOR ALL USING (auth.uid() = id);

  -- Trades policies
  DROP POLICY IF EXISTS "Users can manage their own trades" ON trades;
  CREATE POLICY "Users can manage their own trades" ON trades
    FOR ALL USING (auth.uid() = user_id);

  -- Exit plans policies
  DROP POLICY IF EXISTS "Users can manage their own exit plans" ON exit_plans;
  CREATE POLICY "Users can manage their own exit plans" ON exit_plans
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM trades
        WHERE trades.id = exit_plans.trade_id
        AND trades.user_id = auth.uid()
      )
    );

  -- Simulations policies
  DROP POLICY IF EXISTS "Users can manage their own simulations" ON simulations;
  CREATE POLICY "Users can manage their own simulations" ON simulations
    FOR ALL USING (auth.uid() = user_id);

  -- Ideas policies
  DROP POLICY IF EXISTS "Users can manage their own ideas" ON ideas;
  CREATE POLICY "Users can manage their own ideas" ON ideas
    FOR ALL USING (auth.uid() = user_id);

  -- Signals policies
  DROP POLICY IF EXISTS "Users can manage their own signals" ON signals;
  CREATE POLICY "Users can manage their own signals" ON signals
    FOR ALL USING (auth.uid() = user_id);

  -- Videos policies
  DROP POLICY IF EXISTS "Users can manage their own videos" ON videos;
  CREATE POLICY "Users can manage their own videos" ON videos
    FOR ALL USING (auth.uid() = user_id);
END $$;