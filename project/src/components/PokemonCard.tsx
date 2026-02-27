import { Zap, Heart } from 'lucide-react';
import type { PokemonCard as PokemonCardType } from '../types';

interface PokemonCardProps {
  card: PokemonCardType;
  quantity?: number;
  forTrade?: boolean;
  onAddToCollection?: () => void;
  showActions?: boolean;
}

const typeColors: Record<string, string> = {
  Electric: 'bg-yellow-400',
  Fire: 'bg-red-500',
  Water: 'bg-blue-500',
  Grass: 'bg-green-500',
  Psychic: 'bg-purple-500',
};

const rarityColors: Record<string, string> = {
  Common: 'text-gray-600',
  Uncommon: 'text-green-600',
  Rare: 'text-blue-600',
  'Ultra Rare': 'text-purple-600',
};

export function PokemonCard({
  card,
  quantity,
  forTrade,
  onAddToCollection,
  showActions = true
}: PokemonCardProps) {
  const typeColor = typeColors[card.type] || 'bg-gray-400';
  const rarityColor = rarityColors[card.rarity] || 'text-gray-600';

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl border-8 border-black">
      <div className={`h-2 ${typeColor}`} />

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">{card.name}</h3>
          <div className="flex items-center gap-1 text-red-600">
            <Heart className="w-4 h-4 fill-current" />
            <span className="font-bold">{card.hp}</span>
          </div>
        </div>

        <div className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          {card.image_url ? (
            <img
              src={card.image_url}
              alt={card.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Zap className="w-20 h-20 text-yellow-500" />
          )}
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${typeColor} text-white`}>
            {card.type}
          </span>
          <span className={`text-sm font-bold ${rarityColor}`}>
            {card.rarity}
          </span>
        </div>

        {quantity !== undefined && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <span className="text-sm text-gray-600">Owned: {quantity}</span>
            {forTrade && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                For Trade
              </span>
            )}
          </div>
        )}

        {showActions && onAddToCollection && (
          <button
            onClick={onAddToCollection}
            className="w-full mt-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md"
          >
            Add to Collection
          </button>
        )}
      </div>
    </div>
  );
}
