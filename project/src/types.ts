export interface PokemonCard {
  id: string;
  name: string;
  type: string;
  hp: number;
  rarity: string;
  image_url: string | null;
  created_at: string;
}

export interface UserCollection {
  id: string;
  user_id: string;
  card_id: string;
  quantity: number;
  for_trade: boolean;
  created_at: string;
  pokemon_cards?: PokemonCard;
}

export interface Trade {
  id: string;
  from_user_id: string;
  to_user_id: string;
  offered_card_id: string;
  requested_card_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
}
