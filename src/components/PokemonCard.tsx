
import React from 'react';
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

  // Check if pokemon is rare based on rarity or isRare property
  const isRare = pokemon.isRare || pokemon.rarity === 'rare' || pokemon.rarity === 'legendary';
  
  // Get image URL from either imageUrl or image property
  const imageUrl = pokemon.imageUrl || pokemon.image;
  
  // Get adoption cost from either adoptionCost or price property
  const adoptionCost = pokemon.adoptionCost || pokemon.price;

  // Random age between 1-5 years
  const age = pokemon.age || Math.floor(Math.random() * 5) + 1;

  // Generate breed from type if not provided
  const breed = pokemon.breed || (Array.isArray(pokemon.type) ? pokemon.type[0] : pokemon.type);

  return (
    <div className={`pixel-card overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
      isRare ? 'border-2 border-pokemon-gold' : ''
    } ${
      !isAdopted ? 'hover:border-blue-400 hover:shadow-blue-400/20' : 'hover:border-green-400 hover:shadow-green-400/20'
    }`}>
      {/* Pokemon Image Container */}
      <div className={`relative bg-[#1e3a64] aspect-square flex items-center justify-center p-2 ${
        isRare ? 'bg-gradient-to-br from-[#1e3a64] to-pokemon-gold/30' : ''
      }`}>
        {/* Adopted Badge */}
        {pokemon.isAdopted && !isAdopted && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10 pokemon-font">
            Adopted
          </div>
        )}
        
        <img 
          src={imageUrl} 
          alt={pokemon.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      
      {/* Pokemon Info */}
      <div className={`p-3 ${
        isRare ? 'bg-gradient-to-br from-[#102340] to-pokemon-gold/20' : 'bg-[#102340]'
      } text-white`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="pokemon-font text-sm">{pokemon.name}</h3>
          {isRare && (
            <span className="bg-pokemon-gold text-xs px-1 rounded text-black">RARE</span>
          )}
        </div>
        
        <div className="text-xs mb-1 flex justify-between">
          <span>Breed:</span>
          <span>{breed}</span>
        </div>
        
        <div className="text-xs mb-1 flex justify-between">
          <span>Age:</span>
          <span>{age} {age === 1 ? 'year' : 'years'}</span>
        </div>
        
        <div className="flex justify-between text-xs mb-2">
          <span>Health:</span>
          <span>{pokemon.health}/100</span>
        </div>
        
        <div className="w-full h-2 bg-gray-700 mb-3">
          <div 
            className={`h-full ${getHealthStatusColor()}`}
            style={{ width: `${pokemon.health}%` }}
          ></div>
        </div>
        
        {!isAdopted ? (
          <button 
            onClick={() => onAdopt && onAdopt(pokemon._id)}
            disabled={userCoins < adoptionCost || actionLoading || pokemon.isAdopted}
            className={`w-full py-1 pokemon-font text-center text-xs ${
              userCoins < adoptionCost || pokemon.isAdopted ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {pokemon.isAdopted ? 'ADOPTED' : `ADOPT (${adoptionCost} COINS)`}
          </button>
        ) : (
          <button 
            onClick={() => onFeed && onFeed(pokemon._id)}
            disabled={pokemon.health >= 100 || actionLoading}
            className={`w-full py-1 pokemon-font text-center text-xs ${
              pokemon.health >= 100 ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {pokemon.health >= 100 ? 'FULLY FED' : 'FEED'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
