
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart } from 'lucide-react';

const StatsCard: React.FC = () => {
  const { user } = useAuth();
  
  // Calculate how many Pokémon are healthy vs in danger
  const calculatePokemonHealth = () => {
    if (!user || !user.adoptedPokemons || user.adoptedPokemons.length === 0) {
      return { healthy: 0, danger: 0 };
    }
    
    const healthy = user.adoptedPokemons.filter(pokemon => pokemon.health > 50).length;
    const danger = user.adoptedPokemons.length - healthy;
    
    return { healthy, danger };
  };
  
  const healthStats = calculatePokemonHealth();
  
  return (
    <div className="w-full bg-gradient-to-r from-[#152642] to-[#0a1128] border border-blue-500/30 rounded-lg shadow-lg p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center px-4 py-2 bg-blue-900/30 rounded-lg">
          <div className="mr-3 text-blue-300">
            <span className="block text-xs">Adopted Pokémon</span>
            <span className="block text-2xl font-bold">{user?.adoptedPokemons?.length || 0}</span>
          </div>
        </div>

        <div className="flex items-center px-4 py-2 bg-blue-900/30 rounded-lg">
          <div className="mr-3 text-pokemon-yellow">
            <span className="block text-xs">Available Coins</span>
            <span className="block text-2xl font-bold">{user?.coins || 0}</span>
          </div>
        </div>

        <div className="flex items-center px-4 py-2 bg-blue-900/30 rounded-lg">
          <div className="mr-3 text-green-500">
            <span className="block text-xs">Healthy Pokémon</span>
            <span className="block text-2xl font-bold">{healthStats.healthy}</span>
          </div>
        </div>

        <div className="flex items-center px-4 py-2 bg-blue-900/30 rounded-lg">
          <div className="mr-3 text-red-500">
            <span className="block text-xs">Need Feeding</span>
            <span className="block text-2xl font-bold">{healthStats.danger}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
