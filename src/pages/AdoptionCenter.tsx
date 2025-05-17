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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-pokemon-yellow border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">Welcome to the Adoption Center</h1>
          <p className="text-gray-600 mb-4">
            Here you can adopt Pokémon and care for them. Each Pokémon has unique traits and needs.
          </p>
        </div>
        <div className="md:col-span-1">
          <div className="flex items-center justify-between">
            <StatsCard />
            {isAuthenticated && (
              <div className="ml-4">
                <FairyTuba />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="available">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="available">Available Pokémon</TabsTrigger>
            <TabsTrigger value="adopted" disabled={!isAuthenticated || adoptedPokemons.length === 0}>
              My Pokémon {adoptedPokemons.length > 0 && `(${adoptedPokemons.length})`}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="available">
          {availablePokemons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl">No Pokémon are available for adoption at the moment.</p>
              <p className="text-gray-500 mt-2">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </TabsContent>
        
        <TabsContent value="adopted">
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <p className="text-xl">Please log in to see your adopted Pokémon.</p>
            </div>
          ) : adoptedPokemons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl">You haven't adopted any Pokémon yet.</p>
              <p className="text-gray-500 mt-2">Switch to the Available tab to adopt your first Pokémon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {adoptedPokemons.map(pokemon => (
                <PokemonCard 
                  key={pokemon._id}
                  pokemon={pokemon}
                  isAdopted={true}
                  onFeed={handleFeedPokemon}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdoptionCenter;
