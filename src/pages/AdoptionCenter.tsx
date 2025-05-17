
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { pokemonService, mockApiService } from '@/services/api';
import { Pokemon } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import PokemonCard from '@/components/PokemonCard';
import StatsCard from '@/components/StatsCard';
import TubaFairy from '@/components/TubaFairy';
import FairyTuba from '@/components/FairyTuba';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdoptionCenter: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { toast } = useToast();
  const [availablePokemons, setAvailablePokemons] = useState<Pokemon[]>([]);
  const [adoptedPokemons, setAdoptedPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch pokemons
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setIsLoading(true);
        // For demo purposes use mock service
        const pokemons = await mockApiService.getAllPokemons();
        setAvailablePokemons(pokemons.filter((p: Pokemon) => !p.isAdopted));
        
        if (isAuthenticated) {
          const userPokemons = await mockApiService.getUserPokemons();
          setAdoptedPokemons(userPokemons);
        }
      } catch (error) {
        console.error('Failed to fetch pokemons:', error);
        toast({
          title: 'Error',
          description: 'Failed to load Pokémon data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemons();
  }, [isAuthenticated, toast]);

  const handleAdoptPokemon = async (pokemonId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to adopt a Pokémon',
        variant: 'destructive',
      });
      return;
    }

    try {
      setActionLoading(true);
      const response = await mockApiService.adoptPokemon(pokemonId);
      
      // Update available pokemons
      setAvailablePokemons(prev => prev.filter(p => p._id !== pokemonId));
      
      // Update adopted pokemons
      setAdoptedPokemons(prev => [...prev, response.pokemon]);
      
      // Update user data
      updateUser(response.user);
      
      // Show success message
      toast({
        title: 'Adoption Successful',
        description: `${response.pokemon.name} has been adopted successfully! Uddeshya congratulates you — you're a true Pokémon lover!`,
      });
      
      // Play adoption sound
      const adoptSound = new Audio('/adopt.mp3');
      adoptSound.volume = 0.5;
      adoptSound.play().catch(error => console.error('Error playing sound:', error));
      
    } catch (error: any) {
      toast({
        title: 'Adoption Failed',
        description: error.message || 'Failed to adopt Pokémon',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleFeedPokemon = async (pokemonId: string) => {
    try {
      setActionLoading(true);
      const response = await mockApiService.feedPokemon(pokemonId);
      
      // Update the pokemon in the adopted list
      setAdoptedPokemons(prev => 
        prev.map(p => p._id === pokemonId ? response.pokemon : p)
      );
      
      // Show success message
      toast({
        title: 'Feeding Successful',
        description: response.message,
      });
      
      // Play feeding sound
      const feedSound = new Audio('/feed.mp3');
      feedSound.volume = 0.5;
      feedSound.play().catch(error => console.error('Error playing sound:', error));
      
    } catch (error: any) {
      toast({
        title: 'Feeding Failed',
        description: error.message || 'Failed to feed Pokémon',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen night-sky flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-pokemon-yellow border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="pokemon-font text-white">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="night-sky min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h1 className="pokemon-font text-3xl text-blue-300 mb-2">Welcome back, {user?.username}!</h1>
          <p className="text-white mb-8">Rescued Pokémon are waiting for your love and care. Adopt them, feed them, and help them grow stronger!</p>
          
          <div className="flex gap-4 mb-8">
            <button 
              className="pixel-button flex-1"
              onClick={() => {}}
            >
              ❤️ ADOPT A POKÉMON
            </button>
            <button 
              className="pixel-button bg-blue-600 flex-1"
              onClick={() => {}}
            >
              🔄 MY POKÉMON
            </button>
          </div>
        </div>
        
        <div className="flex items-start gap-6">
          <div className="w-3/4">
            <h2 className="flex items-center justify-between mb-4">
              <span className="pokemon-font text-2xl text-white">Available for Adoption</span>
              <button className="text-blue-300 hover:text-blue-100">View all</button>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {availablePokemons.map(pokemon => (
                <PokemonCard 
                  key={pokemon._id}
                  pokemon={pokemon}
                  onAdopt={handleAdoptPokemon}
                  userCoins={user?.coins}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          </div>
          
          <div className="w-1/4">
            <div className="pixel-card p-4 text-white mb-4">
              <div className="flex items-center mb-2">
                <div className="trainer-avatar w-12 h-12 mr-3"></div>
                <div>
                  <p className="pokemon-font text-sm">Trainer</p>
                  <p className="pokemon-font text-sm">Uddeshya</p>
                </div>
              </div>
            </div>
            
            <div className="pixel-card p-4 text-white">
              <div className="text-center">
                <p className="pokemon-font text-xs mb-4">Don't forget to feed your Pokémon daily to keep them healthy!</p>
              </div>
            </div>
            
            {isAuthenticated && (
              <div className="mt-4">
                <FairyTuba />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionCenter;
