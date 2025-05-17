
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="shadow-md bg-gradient-to-br from-[#1a2b47] to-[#102340] border border-blue-500/30">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-blue-300 pokemon-font">Trainer Stats</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-[#0a1128]/50 rounded-lg border border-blue-500/20">
            <p className="text-sm text-blue-300">Adopted Pokémon</p>
            <p className="text-2xl font-bold text-pokemon-blue">
              {user?.adoptedPokemons?.length || 0}
            </p>
          </div>
          
          <div className="text-center p-3 bg-[#0a1128]/50 rounded-lg border border-blue-500/20">
            <p className="text-sm text-blue-300">Available Coins</p>
            <p className="text-2xl font-bold text-pokemon-yellow">
              {user?.coins || 0}
            </p>
          </div>
          
          <div className="text-center p-3 bg-[#0a1128]/50 rounded-lg border border-blue-500/20">
            <p className="text-sm text-blue-300">Healthy Pokémon</p>
            <p className="text-2xl font-bold text-green-500">
              {healthStats.healthy}
            </p>
          </div>
          
          <div className="text-center p-3 bg-[#0a1128]/50 rounded-lg border border-blue-500/20">
            <p className="text-sm text-blue-300">Need Feeding</p>
            <p className="text-2xl font-bold text-red-500">
              {healthStats.danger}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
