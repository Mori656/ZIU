/*
  # Pokemon Trading Card Database Schema

  ## Tables Created
  
  ### 1. pokemon_cards
  - `id` (uuid, primary key) - Unique identifier for each card
  - `name` (text) - Pokemon name
  - `type` (text) - Pokemon type (Fire, Water, Electric, etc.)
  - `hp` (integer) - Hit points
  - `rarity` (text) - Card rarity (Common, Uncommon, Rare, Ultra Rare)
  - `image_url` (text) - URL to card image
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 2. user_collections
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid) - Reference to auth.users
  - `card_id` (uuid) - Reference to pokemon_cards
  - `quantity` (integer) - Number of cards owned
  - `for_trade` (boolean) - Whether card is available for trading
  - `created_at` (timestamptz) - Creation timestamp
  
  ### 3. trades
  - `id` (uuid, primary key) - Unique identifier
  - `from_user_id` (uuid) - User offering the trade
  - `to_user_id` (uuid) - User receiving the trade offer
  - `offered_card_id` (uuid) - Card being offered
  - `requested_card_id` (uuid) - Card being requested
  - `status` (text) - Trade status (pending, accepted, rejected, cancelled)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ## Security
  - RLS enabled on all tables
  - Users can read all pokemon_cards
  - Users can manage their own collections
  - Users can manage their own trades
*/

CREATE TABLE IF NOT EXISTS pokemon_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  hp integer NOT NULL DEFAULT 0,
  rarity text NOT NULL DEFAULT 'Common',
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id uuid REFERENCES pokemon_cards(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  for_trade boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, card_id)
);

CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  offered_card_id uuid REFERENCES pokemon_cards(id) ON DELETE CASCADE,
  requested_card_id uuid REFERENCES pokemon_cards(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pokemon_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pokemon cards"
  ON pokemon_cards FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view all collections"
  ON user_collections FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own collection items"
  ON user_collections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collection items"
  ON user_collections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collection items"
  ON user_collections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view all trades"
  ON trades FOR SELECT
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create trades"
  ON trades FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update their own trades"
  ON trades FOR UPDATE
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id)
  WITH CHECK (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can delete their own trades"
  ON trades FOR DELETE
  TO authenticated
  USING (auth.uid() = from_user_id);

INSERT INTO pokemon_cards (name, type, hp, rarity, image_url) VALUES
  ('Pikachu', 'Electric', 60, 'Common', 'https://images.pexels.com/photos/14895158/pexels-photo-14895158.jpeg'),
  ('Charizard', 'Fire', 120, 'Rare', 'https://images.pexels.com/photos/14895407/pexels-photo-14895407.jpeg'),
  ('Blastoise', 'Water', 110, 'Rare', 'https://images.pexels.com/photos/14699828/pexels-photo-14699828.jpeg'),
  ('Mewtwo', 'Psychic', 130, 'Ultra Rare', 'https://images.pexels.com/photos/14895364/pexels-photo-14895364.jpeg'),
  ('Raichu', 'Electric', 90, 'Uncommon', 'https://images.pexels.com/photos/14895502/pexels-photo-14895502.jpeg'),
  ('Venusaur', 'Grass', 110, 'Rare', 'https://images.pexels.com/photos/14895091/pexels-photo-14895091.jpeg')
ON CONFLICT DO NOTHING;