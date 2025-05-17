
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
  const [activeTab, setActiveTab] = useState<string>("available");

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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="pokemon-font text-3xl text-blue-300 mb-2">Welcome back, {user?.username}!</h1>
              <p className="text-white mb-8">Rescued Pokémon are waiting for your love and care. Adopt them, feed them, and help them grow stronger!</p>
            </div>
            
            {/* Repositioned Fairy Tuba component */}
            <div className="mt-2">
              {isAuthenticated && <FairyTuba />}
            </div>
          </div>
          
          <Tabs defaultValue="available" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="available" className="pokemon-font">❤️ ADOPT A POKÉMON</TabsTrigger>
              <TabsTrigger value="adopted" className="pokemon-font">🔄 MY POKÉMON</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex items-start gap-6">
          <div className="w-full">
            {activeTab === "available" && (
              <>
                <h2 className="flex items-center justify-between mb-4">
                  <span className="pokemon-font text-2xl text-white">Available for Adoption</span>
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
              </>
            )}
            
            {activeTab === "adopted" && (
              <>
                <div className="flex justify-between mb-4">
                  <h2 className="pokemon-font text-2xl text-white">My Adopted Pokémon</h2>
                  <div>
                    <StatsCard />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {adoptedPokemons.length > 0 ? (
                    adoptedPokemons.map(pokemon => (
                      <PokemonCard 
                        key={pokemon._id}
                        pokemon={pokemon}
                        onFeed={handleFeedPokemon}
                        isAdopted={true}
                        actionLoading={actionLoading}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-white text-xl mb-4">You haven't adopted any Pokémon yet</p>
                      <button 
                        className="pixel-button"
                        onClick={() => setActiveTab("available")}
                      >
                        Find a Pokémon to Adopt
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionCenter;
