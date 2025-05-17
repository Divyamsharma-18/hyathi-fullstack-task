
import React, { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, Coins, AlertCircle } from 'lucide-react';

const StatsCard: React.FC = () => {
  const { user } = useAuth();
  
  // Calculate how many Pokémon are healthy vs in danger with memoization
  const pokemonStats = useMemo(() => {
    if (!user || !user.adoptedPokemons || user.adoptedPokemons.length === 0) {
      return { total: 0, healthy: 0, danger: 0 };
    }
    
    const total = user.adoptedPokemons.length;
    const healthy = user.adoptedPokemons.filter(pokemon => pokemon.health > 50).length;
    const danger = total - healthy;
    
    return { total, healthy, danger };
  }, [user?.adoptedPokemons]);
  
  return (
    <div className="w-full bg-gradient-to-r from-[#1a2b47] to-[#0a1128] border border-blue-500/30 rounded-lg shadow-lg p-3 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center px-3 py-1 bg-blue-900/30 rounded-lg">
          <div className="flex items-center gap-2 text-blue-300">
            <span className="text-xs whitespace-nowrap">Adopted Pokémon</span>
            <span className="block text-lg font-bold">{pokemonStats.total}</span>
          </div>
        </div>

        <div className="flex items-center px-3 py-1 bg-blue-900/30 rounded-lg">
          <div className="flex items-center gap-2 text-pokemon-yellow">
            <Coins size={16} />
            <span className="text-xs whitespace-nowrap">Available Coins</span>
            <span className="block text-lg font-bold">{user?.coins || 0}</span>
          </div>
        </div>

        <div className="flex items-center px-3 py-1 bg-blue-900/30 rounded-lg">
          <div className="flex items-center gap-2 text-green-500">
            <Heart size={16} />
            <span className="text-xs whitespace-nowrap">Healthy Pokémon</span>
            <span className="block text-lg font-bold">{pokemonStats.healthy}</span>
          </div>
        </div>

        <div className="flex items-center px-3 py-1 bg-blue-900/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle size={16} />
            <span className="text-xs whitespace-nowrap">Need Feeding</span>
            <span className="block text-lg font-bold">{pokemonStats.danger}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
