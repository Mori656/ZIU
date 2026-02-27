import { useEffect, useState } from 'react';
import { Zap, Users, Trophy, Sparkles } from 'lucide-react';
import { supabase } from './lib/supabase';
import { PokemonCard } from './components/PokemonCard';
import type { PokemonCard as PokemonCardType, UserCollection } from './types';

function App() {
  const [cards, setCards] = useState<PokemonCardType[]>([]);
  const [collection, setCollection] = useState<UserCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'market' | 'collection'>('market');

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    try {
      const { data: cardsData, error } = await supabase
        .from('pokemon_cards')
        .select('*')
        .order('rarity', { ascending: false });

      if (error) throw error;
      setCards(cardsData || []);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCollection(cardId: string) {
    console.log('Adding card to collection:', cardId);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400">
      <header className="bg-black text-white shadow-2xl border-b-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 p-3 rounded-full">
                <Zap className="w-8 h-8 text-black fill-current" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">PokéTrade</h1>
                <p className="text-yellow-400 text-sm">Gotta Trade 'Em All!</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold">
                <Trophy className="w-5 h-5" />
                <span>{collection.length} Cards</span>
              </div>
              <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full font-bold">
                <Users className="w-5 h-5" />
                <span>Trading</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-md border-b-2 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('market')}
              className={`flex-1 py-4 px-6 font-bold transition-all ${
                activeTab === 'market'
                  ? 'bg-yellow-400 text-black border-b-4 border-red-600'
                  : 'text-gray-600 hover:bg-yellow-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Card Market
              </div>
            </button>
            <button
              onClick={() => setActiveTab('collection')}
              className={`flex-1 py-4 px-6 font-bold transition-all ${
                activeTab === 'collection'
                  ? 'bg-yellow-400 text-black border-b-4 border-red-600'
                  : 'text-gray-600 hover:bg-yellow-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5" />
                My Collection
              </div>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Zap className="w-16 h-16 text-yellow-600 animate-bounce" />
              <p className="text-xl font-bold text-black">Loading cards...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'market' && (
              <div>
                <div className="mb-6 bg-white rounded-lg p-6 shadow-lg border-2 border-yellow-400">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome to the Card Market!
                  </h2>
                  <p className="text-gray-600">
                    Browse and collect amazing Pokemon cards. Build your collection and trade with others!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cards.map((card) => (
                    <PokemonCard
                      key={card.id}
                      card={card}
                      onAddToCollection={() => handleAddToCollection(card.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'collection' && (
              <div>
                <div className="mb-6 bg-white rounded-lg p-6 shadow-lg border-2 border-yellow-400">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    My Collection
                  </h2>
                  <p className="text-gray-600">
                    View and manage your Pokemon card collection.
                  </p>
                </div>

                {collection.length === 0 ? (
                  <div className="bg-white rounded-lg p-12 shadow-lg text-center border-2 border-yellow-400">
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Your collection is empty
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start collecting cards from the market!
                    </p>
                    <button
                      onClick={() => setActiveTab('market')}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md"
                    >
                      Browse Market
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collection.map((item) => (
                      item.pokemon_cards && (
                        <PokemonCard
                          key={item.id}
                          card={item.pokemon_cards}
                          quantity={item.quantity}
                          forTrade={item.for_trade}
                          showActions={false}
                        />
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-black text-white mt-16 border-t-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-yellow-400 fill-current" />
            <span className="font-bold text-yellow-400">PokéTrade</span>
          </div>
          <p className="text-gray-400 text-sm">
            Trade Pokemon cards with trainers around the world
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
