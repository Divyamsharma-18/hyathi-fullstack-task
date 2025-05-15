
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Coins, Heart } from 'lucide-react';
import { Pokemon } from '@/types/types';

interface PokemonCardProps {
  pokemon: Pokemon;
  onAdopt?: (id: string) => void;
  onFeed?: (id: string) => void;
  isAdopted?: boolean;
  userCoins?: number;
  actionLoading?: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  onAdopt, 
  onFeed, 
  isAdopted = false, 
  userCoins = 0,
  actionLoading = false
}) => {
  // Function to determine time since last fed
  const getTimeSinceLastFed = () => {
    if (!pokemon.lastFed) return 'Never fed';
    
    const lastFed = new Date(pokemon.lastFed);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - lastFed.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just fed';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  // Determine health status color
  const getHealthStatusColor = () => {
    if (pokemon.health > 70) return 'bg-green-500';
    if (pokemon.health > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className={`overflow-hidden shadow-lg transform transition-all hover:scale-105 ${pokemon.isRare ? 'card-rare' : 'card-normal'}`}>
      <CardHeader className="bg-pokemon-blue p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white font-bold">{pokemon.name}</CardTitle>
          <span className="bg-white text-xs font-semibold px-2 py-1 rounded-full text-pokemon-blue">
            {pokemon.type}
          </span>
        </div>
      </CardHeader>
      
      <div className="relative">
        <img 
          src={pokemon.imageUrl} 
          alt={pokemon.name}
          className="w-full h-48 object-contain bg-gray-100"
        />
        {pokemon.isRare && (
          <span className="absolute top-2 right-2 bg-pokemon-gold text-white text-xs font-bold px-2 py-1 rounded-full">
            RARE
          </span>
        )}
      </div>
      
      <CardContent className="p-4">
        <p className="text-sm mb-4">{pokemon.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Health:</span>
            <span>{pokemon.health}/100</span>
          </div>
          <Progress value={pokemon.health} className={getHealthStatusColor()} />
          
          {isAdopted && (
            <div className="text-xs text-gray-600 mt-1">
              Last fed: {getTimeSinceLastFed()}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-4 flex justify-between">
        {!isAdopted ? (
          <>
            <div className="flex items-center">
              <Coins className="h-5 w-5 mr-1 text-pokemon-gold" />
              <span>{pokemon.adoptionCost} coins</span>
            </div>
            <Button 
              onClick={() => onAdopt && onAdopt(pokemon._id)}
              disabled={userCoins < pokemon.adoptionCost || actionLoading || pokemon.isAdopted}
              className="bg-pokemon-blue hover:bg-blue-700"
            >
              {userCoins < pokemon.adoptionCost ? 'Not enough coins' : 'Adopt'}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center">
              <Heart className="h-5 w-5 mr-1 text-pokemon-red" />
              <span>Adopted</span>
            </div>
            <Button 
              onClick={() => onFeed && onFeed(pokemon._id)}
              disabled={pokemon.health >= 100 || actionLoading}
              variant="outline"
              className="border-pokemon-blue text-pokemon-blue hover:bg-pokemon-blue/10"
            >
              {pokemon.health >= 100 ? 'Not Hungry' : 'Feed'}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PokemonCard;
