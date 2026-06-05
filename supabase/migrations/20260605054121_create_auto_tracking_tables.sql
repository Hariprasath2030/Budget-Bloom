
/*
# Create auto_transactions and merchant_categories tables

1. New Tables
- `auto_transactions`: Stores expense transactions detected from payment notifications
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to auth.uid()) - owner
  - `amount` (numeric, not null) - transaction amount
  - `merchant_name` (text) - merchant/payee name parsed from notification
  - `category` (text) - auto-detected or user-confirmed category
  - `payment_method` (text) - UPI app, card, etc.
  - `source_app` (text) - which app sent the notification (Google Pay, PhonePe, etc.)
  - `raw_notification` (text) - raw notification text for reference
  - `status` (text, default 'pending') - pending/confirmed/dismissed
  - `budget_id` (uuid, nullable) - linked budget after confirmation
  - `expense_id` (uuid, nullable) - linked expense after confirmation
  - `detected_at` (timestamptz, default now()) - when detected
  - `transaction_date` (date) - date of the actual transaction

- `merchant_categories`: Merchant-to-category mapping for auto-classification
  - `id` (uuid, primary key)
  - `merchant_pattern` (text, unique, not null) - pattern to match (e.g. "swiggy", "amazon")
  - `category` (text, not null) - default category
  - `icon` (text) - emoji icon for the category
  - `user_id` (uuid, nullable) - null = global mapping, non-null = user-specific override

2. Security
- RLS enabled on both tables
- auto_transactions: owner-scoped CRUD
- merchant_categories: owner can CRUD their own, global (user_id null) readable by all authenticated
*/

CREATE TABLE IF NOT EXISTS auto_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  merchant_name text,
  category text,
  payment_method text,
  source_app text,
  raw_notification text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'dismissed')),
  budget_id uuid REFERENCES budgets(id) ON DELETE SET NULL,
  expense_id uuid REFERENCES expenses(id) ON DELETE SET NULL,
  detected_at timestamptz DEFAULT now(),
  transaction_date date DEFAULT CURRENT_DATE
);

ALTER TABLE auto_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_auto_transactions" ON auto_transactions;
CREATE POLICY "select_own_auto_transactions" ON auto_transactions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_auto_transactions" ON auto_transactions;
CREATE POLICY "insert_own_auto_transactions" ON auto_transactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_auto_transactions" ON auto_transactions;
CREATE POLICY "update_own_auto_transactions" ON auto_transactions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_auto_transactions" ON auto_transactions;
CREATE POLICY "delete_own_auto_transactions" ON auto_transactions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_auto_transactions_user_id ON auto_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_transactions_status ON auto_transactions(user_id, status);

CREATE TABLE IF NOT EXISTS merchant_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_pattern text NOT NULL,
  category text NOT NULL,
  icon text DEFAULT '💰',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(merchant_pattern, user_id)
);

ALTER TABLE merchant_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_merchant_categories" ON merchant_categories;
CREATE POLICY "select_merchant_categories" ON merchant_categories FOR SELECT
  TO authenticated USING (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_merchant_categories" ON merchant_categories;
CREATE POLICY "insert_own_merchant_categories" ON merchant_categories FOR INSERT
  TO authenticated WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_merchant_categories" ON merchant_categories;
CREATE POLICY "update_own_merchant_categories" ON merchant_categories FOR UPDATE
  TO authenticated USING (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_merchant_categories" ON merchant_categories;
CREATE POLICY "delete_own_merchant_categories" ON merchant_categories FOR DELETE
  TO authenticated USING (user_id IS NULL OR auth.uid() = user_id);

-- Seed global merchant-category mappings
INSERT INTO merchant_categories (merchant_pattern, category, icon, user_id) VALUES
  ('swiggy', 'Food & Dining', '🍕', NULL),
  ('zomato', 'Food & Dining', '🍕', NULL),
  ('amazon', 'Shopping', '🛒', NULL),
  ('flipkart', 'Shopping', '🛒', NULL),
  ('uber', 'Transport', '🚗', NULL),
  ('ola', 'Transport', '🚗', NULL),
  ('rapido', 'Transport', '🚗', NULL),
  ('netflix', 'Entertainment', '🎬', NULL),
  ('hotstar', 'Entertainment', '🎬', NULL),
  ('spotify', 'Entertainment', '🎵', NULL),
  ('electricity', 'Utilities', '💡', NULL),
  ('water', 'Utilities', '💧', NULL),
  ('gas', 'Utilities', '🔥', NULL),
  ('reliance', 'Shopping', '🛒', NULL),
  ('bigbasket', 'Groceries', '🛒', NULL),
  ('dunzo', 'Groceries', '🛒', NULL),
  ('blinkit', 'Groceries', '🛒', NULL),
  ('zepto', 'Groceries', '🛒', NULL),
  ('bookmyshow', 'Entertainment', '🎟️', NULL),
  ('makemytrip', 'Travel', '✈️', NULL),
  ('goibibo', 'Travel', '✈️', NULL),
  ('cleartrip', 'Travel', '✈️', NULL),
  ('phonepe', 'UPI Payment', '📱', NULL),
  ('gpay', 'UPI Payment', '📱', NULL),
  ('paytm', 'UPI Payment', '📱', NULL),
  ('cred', 'Credit Card', '💳', NULL),
  ('bharatpe', 'UPI Payment', '📱', NULL)
ON CONFLICT (merchant_pattern, user_id) DO NOTHING;
