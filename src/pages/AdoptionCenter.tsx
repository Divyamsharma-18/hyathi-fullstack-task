
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { pokemonService, mockApiService } from '@/services/api';
import { Pokemon } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import PokemonCard from '@/components/PokemonCard';
import StatsCard from '@/components/StatsCard';
import TubaFairy from '@/components/TubaFairy';
import FairyTuba from '@/components/FairyTuba';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const AdoptionCenter: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { toast } = useToast();
  const [availablePokemons, setAvailablePokemons] = useState<Pokemon[]>([]);
  const [adoptedPokemons, setAdoptedPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("available");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter available Pokemon based on search query
  const filteredPokemons = useMemo(() => {
    if (!searchQuery.trim()) return availablePokemons;
    
    const query = searchQuery.toLowerCase();
    return availablePokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query) || 
      pokemon.breed?.toLowerCase().includes(query) || 
      (Array.isArray(pokemon.type) 
        ? pokemon.type.some(t => t.toLowerCase().includes(query))
        : pokemon.type.toLowerCase().includes(query))
    );
  }, [availablePokemons, searchQuery]);

  // Fetch pokemons
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setIsLoading(true);
        // For demo purposes use mock service
        const pokemons = await mockApiService.getAllPokemons();
        setAvailablePokemons(pokemons);
        
        // Only fetch user's Pokémon if they're authenticated
        if (isAuthenticated && user) {
          const userPokemons = await mockApiService.getUserPokemons();
          setAdoptedPokemons(userPokemons);
        } else {
          // Clear adopted Pokémon list if not authenticated
          setAdoptedPokemons([]);
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
  }, [isAuthenticated, user, toast]);

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
      setAvailablePokemons(prev => prev.map(p => 
        p._id === pokemonId ? { ...p, isAdopted: true } : p
      ));
      
      // Update adopted pokemons
      setAdoptedPokemons(prev => [...prev, response.pokemon]);
      
      // Update user data
      updateUser(response.user);
      
      // Show success message
      toast({
        title: 'Adoption Successful',
        description: `${response.pokemon.name} has been adopted successfully! Uddeshya congratulates you — you're a true Pokémon lover!`,
      });
      
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
      
      // Update user data (because feeding costs coins)
      const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
      updateUser(updatedUser);
      
      // Show success message
      toast({
        title: 'Feeding Successful',
        description: response.message,
      });
      
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
    <div className="night-sky min-h-screen flex flex-col">
      <div className="flex-grow py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-6 md:mb-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="order-2 md:order-1">
                <h1 className="pokemon-font text-xl sm:text-2xl md:text-3xl text-blue-300 mb-2">Welcome back, {user?.username || 'Trainer'}!</h1>
                <p className="text-white text-sm md:text-base mb-4 md:mb-8">Rescued Pokémon are waiting for your love and care. Adopt them, feed them, and help them grow stronger!</p>
              </div>
              
              {/* Fairy Tuba component - now always showing on the right, even on small screens */}
              <div className="order-1 md:order-2 flex justify-end">
                {isAuthenticated && <FairyTuba />}
              </div>
            </div>
            
            <Tabs defaultValue="available" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger 
                  value="available" 
                  className="pokemon-font text-xs overflow-hidden whitespace-nowrap text-ellipsis px-1 xs:px-2 sm:text-sm"
                >
                  <span className="hidden max-[380px]:inline">ADOPT</span>
                  <span className="inline max-[380px]:hidden">❤️ ADOPT A POKÉMON</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="adopted" 
                  className="pokemon-font text-xs overflow-hidden whitespace-nowrap text-ellipsis px-1 xs:px-2 sm:text-sm"
                >
                  <span className="hidden max-[380px]:inline">MY POKÉMON</span>
                  <span className="inline max-[380px]:hidden">🔄 MY POKÉMON</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex flex-col md:items-start gap-6">
            <div className="w-full">
              {activeTab === "available" && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <h2 className="pokemon-font text-lg sm:text-xl md:text-2xl text-white">Available for Adoption</h2>
                    
                    {/* Search bar */}
                    <div className="relative w-full max-w-xs">
                      <Input
                        type="text"
                        placeholder="Search by name, type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-blue-900/30 border-blue-700 text-white placeholder:text-blue-300/50"
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-300" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {filteredPokemons.length > 0 ? (
                      filteredPokemons.map(pokemon => (
                        <PokemonCard 
                          key={pokemon._id}
                          pokemon={pokemon}
                          onAdopt={handleAdoptPokemon}
                          userCoins={user?.coins}
                          actionLoading={actionLoading}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 md:py-12">
                        <p className="text-white text-lg md:text-xl mb-4">No Pokémon found matching your search</p>
                        <button 
                          className="pixel-button text-sm md:text-base"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear Search
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {activeTab === "adopted" && (
                <>
                  <h2 className="pokemon-font text-lg sm:text-xl md:text-2xl text-white mb-4">My Adopted Pokémon</h2>
                  
                  {/* Horizontal stats card */}
                  <StatsCard />
                  
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {adoptedPokemons.length > 0 ? (
                      adoptedPokemons.map(pokemon => (
                        <PokemonCard 
                          key={pokemon._id}
                          pokemon={pokemon}
                          onFeed={handleFeedPokemon}
                          isAdopted={true}
                          actionLoading={actionLoading}
                          userCoins={user?.coins}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 md:py-12">
                        <p className="text-white text-lg md:text-xl mb-4">You haven't adopted any Pokémon yet</p>
                        <button 
                          className="pixel-button text-sm md:text-base"
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
    </div>
  );
};

export default AdoptionCenter;
