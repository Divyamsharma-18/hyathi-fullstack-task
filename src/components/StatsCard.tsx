
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

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
    <Card className="shadow-md">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold">Trainer Stats</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Adopted Pokémon</p>
            <p className="text-2xl font-bold text-pokemon-blue">
              {user?.adoptedPokemons?.length || 0}
            </p>
          </div>
          
          <div className="text-center p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Available Coins</p>
            <p className="text-2xl font-bold text-pokemon-yellow">
              {user?.coins || 0}
            </p>
          </div>
          
          <div className="text-center p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Healthy Pokémon</p>
            <p className="text-2xl font-bold text-green-500">
              {healthStats.healthy}
            </p>
          </div>
          
          <div className="text-center p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Need Feeding</p>
            <p className="text-2xl font-bold text-red-500">
              {healthStats.danger}
            </p>
          </div>
        </div>
        
        {user && (
          <div className="mt-4 p-3 bg-pokemon-blue/10 rounded-lg">
            <p className="text-sm italic text-center">
              "Trainer Uddeshya's Tip: Don't forget to feed your Pokémon daily!"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
