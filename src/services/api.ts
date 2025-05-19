import axios from 'axios';
import { User, Pokemon, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/types';

// Create an axios instance
const api = axios.create({
  baseURL: 'https://api.example.com/v1', // Replace with your actual API URL
});

// Set JWT token for auth requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to decrease health for Pokémon not fed in 24 hours
const updatePokemonHealth = () => {
  try {
    const adoptedPokemons = JSON.parse(localStorage.getItem('adoptedPokemons') || '[]');
    const now = new Date();
    
    const updatedPokemons = adoptedPokemons.map((pokemon: Pokemon) => {
      if (!pokemon.lastFed) return pokemon;
      
      const lastFed = new Date(pokemon.lastFed);
      const hoursSinceLastFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);
      
      // If not fed in the last 24 hours, decrease health (simulating cron job)
      if (hoursSinceLastFed >= 24) {
        const healthDecrease = Math.floor(hoursSinceLastFed / 24) * 10;  // 10 health points per day
        return {
          ...pokemon,
          health: Math.max(1, pokemon.health - healthDecrease) // Don't go below 1
        };
      }
      
      return pokemon;
    });
    
    localStorage.setItem('adoptedPokemons', JSON.stringify(updatedPokemons));
    return updatedPokemons;
  } catch (error) {
    console.error('Error updating Pokémon health:', error);
    return [];
  }
};

// Real API service for production use
const realApiService = {
  getAllPokemons: async (): Promise<Pokemon[]> => {
    const response = await api.get('/pokemons');
    return response.data;
  },

  getUserPokemons: async (): Promise<Pokemon[]> => {
    // Check and update health first (simulating a cron job)
    const updatedPokemons = updatePokemonHealth();
    return updatedPokemons;
  },

  adoptPokemon: async (pokemonId: string): Promise<{ pokemon: Pokemon; user: User }> => {
    const response = await api.post(`/pokemons/${pokemonId}/adopt`);
    return response.data;
  },

  feedPokemon: async (pokemonId: string): Promise<{ pokemon: Pokemon; message: string }> => {
    const response = await api.post(`/pokemons/${pokemonId}/feed`);
    return response.data;
  },

  collectFairyReward: async (): Promise<{ user: User; message: string }> => {
    const response = await api.post('/rewards/fairy');
    return response.data;
  }
};

// Enhanced mock API service for better user data persistence
export const mockApiService = {
  getAllPokemons: async (): Promise<Pokemon[]> => {
    // Get current user
    const userString = localStorage.getItem('user');
    const currentUser = userString ? JSON.parse(userString) : null;
    const userId = currentUser ? currentUser._id : '';
    
    // Get available Pokémon from localStorage or use the default list
    let availablePokemons = localStorage.getItem('availablePokemons');
    
    if (!availablePokemons) {
      // Return mock data for demo purposes with more Pokémon
      const defaultPokemons: Pokemon[] = [
        {
          _id: '1',
          name: 'Pikachu',
          breed: 'Electric Mouse',
          age: 2,
          type: ['Electric'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
          description: "When it is angered, it immediately discharges the energy stored in the pouches in its cheeks.",
          health: 100,
          rarity: 'rare',
          price: 50,
          isAdopted: false
        },
        {
          _id: '2',
          name: 'Bulbasaur',
          breed: 'Seed',
          age: 1,
          type: ['Grass', 'Poison'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
          description: "Bulbasaur can be seen napping in bright sunlight. There is a seed on its back. By soaking up the sun's rays, the seed grows progressively larger.",
          health: 120,
          rarity: 'common',
          price: 30,
          isAdopted: false
        },
        {
          _id: '3',
          name: 'Charmander',
          breed: 'Lizard',
          age: 1,
          type: ['Fire'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
          description: "The flame that burns at the tip of its tail is an indication of its emotions. The flame wavers when Charmander is enjoying itself. If the Pokémon becomes enraged, the flame burns fiercely.",
          health: 80,
          rarity: 'common',
          price: 30,
          isAdopted: false
        },
        {
          _id: '4',
          name: 'Squirtle',
          breed: 'Tiny Turtle',
          age: 1,
          type: ['Water'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
          description: "Squirtle's shell is not merely used for protection. The shell's rounded shape and the grooves on its surface minimize resistance in water, enabling this Pokémon to swim at high speeds.",
          health: 90,
          rarity: 'common',
          price: 30,
          isAdopted: false
        },
        {
          _id: '5',
          name: 'Eevee',
          breed: 'Evolution',
          age: 2,
          type: ['Normal'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
          description: 'Eevee has an unstable genetic code that allows it to evolve into multiple forms. It is popular as a pet due to its friendly nature.',
          health: 110,
          rarity: 'rare',
          price: 50,
          isAdopted: false
        },
        {
          _id: '6',
          name: 'Snorlax',
          breed: 'Sleeping',
          age: 5,
          type: ['Normal'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
          description: 'Snorlax is a very lazy Pokémon. Unless it is eating, it is constantly asleep. It is not picky about what it eats—even moldy food will do.',
          health: 200,
          rarity: 'common',
          price: 70,
          isAdopted: false
        },
        {
          _id: '7',
          name: 'Gengar',
          breed: 'Shadow',
          age: 4,
          type: ['Ghost', 'Poison'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
          description: 'Sometimes, on a dark night, your shadow thrown by a streetlight will suddenly overtake you and race off into the darkness. It is actually a Gengar running by pretending to be your shadow.',
          health: 95,
          rarity: 'rare',
          price: 60,
          isAdopted: false
        },
        {
          _id: '8',
          name: 'Mewtwo',
          breed: 'Genetic',
          age: 3,
          type: ['Psychic'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
          description: "Mewtwo is a Pokémon that was created by genetic manipulation. However, even though the scientific power of humans created this Pokémon's body, they failed to endow Mewtwo with a compassionate heart.",
          health: 150,
          rarity: 'legendary',
          price: 100,
          isAdopted: false
        },
        {
          _id: '9',
          name: 'Articuno',
          breed: 'Freeze',
          age: 5,
          type: ['Ice', 'Flying'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png',
          description: 'Articuno is a large, avian Pokémon with predominantly blue plumage. It has a head crest of long, blue feathers and a gray, mask-like marking around its eyes.',
          health: 130,
          rarity: 'legendary',
          price: 90,
          isAdopted: false
        },
        {
          _id: '10',
          name: 'Zapdos',
          breed: 'Electric',
          age: 5,
          type: ['Electric', 'Flying'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png',
          description: 'Zapdos is an avian Pokémon with predominantly yellow plumage. Black tips appear on its wings and tail feathers. It has a long, thin, light orange beak and black eyes.',
          health: 130,
          rarity: 'legendary',
          price: 90,
          isAdopted: false
        },
        {
          _id: '11',
          name: 'Moltres',
          breed: 'Flame',
          age: 5,
          type: ['Fire', 'Flying'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png',
          description: 'Moltres is a large, avian Pokémon with orange plumage. It has a long, flowing head crest and tail composed of flames. Its beak is long and thin, and its eyes are surrounded by a black marking.',
          health: 130,
          rarity: 'legendary',
          price: 90,
          isAdopted: false
        },
        {
          _id: '12',
          name: 'Jigglypuff',
          breed: 'Balloon',
          age: 1,
          type: ['Normal', 'Fairy'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png',
          description: "Jigglypuff's vocal cords can freely adjust the wavelength of its voice. This Pokémon uses this ability to sing at precisely the right wavelength to make its foes most drowsy.",
          health: 95,
          rarity: 'common',
          price: 25,
          isAdopted: false
        },
        {
          _id: '13',
          name: 'Psyduck',
          breed: 'Duck',
          age: 2,
          type: ['Water'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png',
          description: 'Psyduck is constantly beset by headaches. If the Pokémon lets its strange power erupt, apparently the pain subsides for a while.',
          health: 85,
          rarity: 'common',
          price: 30,
          isAdopted: false
        },
        {
          _id: '14',
          name: 'Machop',
          breed: 'Superpower',
          age: 3,
          type: ['Fighting'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png',
          description: 'Machop exercises by hefting around a Graveler as if it were a barbell. There are some Machop that travel the world in a quest to master all kinds of martial arts.',
          health: 110,
          rarity: 'common',
          price: 35,
          isAdopted: false
        },
        {
          _id: '15',
          name: 'Growlithe',
          breed: 'Puppy',
          age: 1,
          type: ['Fire'],
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/58.png',
          description: "Growlithe has a superb sense of smell. Once it smells anything, this Pokémon won't forget the scent, no matter what. It uses its advanced olfactory sense to determine the emotions of other living things.",
          health: 90,
          rarity: 'common',
          price: 30,
          isAdopted: false
        }
      ];
      
      // Save to localStorage for future use
      localStorage.setItem('availablePokemons', JSON.stringify(defaultPokemons));
      return defaultPokemons;
    }
    
    // Get all adopted Pokémon to mark which ones are adopted
    const allAdoptedPokemons = JSON.parse(localStorage.getItem('adoptedPokemons') || '[]');
    const adoptedIds = new Set(allAdoptedPokemons.map((p: Pokemon) => p._id));
    
    // Parse available Pokémon and update their adoption status
    const parsedPokemons: Pokemon[] = JSON.parse(availablePokemons);
    return parsedPokemons.map(pokemon => ({
      ...pokemon,
      // Only show as adopted if it's in the adopted list (regardless of user)
      isAdopted: adoptedIds.has(pokemon._id)
    }));
  },

  getUserPokemons: async (): Promise<Pokemon[]> => {
    // Get current user
    const userString = localStorage.getItem('user');
    if (!userString) return [];
    
    const user = JSON.parse(userString);
    
    // Get adopted Pokémon for this specific user
    const allAdoptedPokemons = JSON.parse(localStorage.getItem('adoptedPokemons') || '[]');
    const userPokemons = allAdoptedPokemons.filter((pokemon: Pokemon) => 
      pokemon.adoptedBy === user._id
    );
    
    // Update health based on last fed time
    const now = new Date();
    const updatedPokemons = userPokemons.map((pokemon: Pokemon) => {
      if (!pokemon.lastFed) return pokemon;
      
      const lastFed = new Date(pokemon.lastFed);
      const hoursSinceLastFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);
      
      // If not fed in the last 24 hours, decrease health
      if (hoursSinceLastFed >= 24) {
        const healthDecrease = Math.floor(hoursSinceLastFed / 24) * 10;
        return {
          ...pokemon,
          health: Math.max(1, pokemon.health - healthDecrease) 
        };
      }
      
      return pokemon;
    });
    
    // Update the localStorage with the latest health values
    if (updatedPokemons.length > 0) {
      const allUpdatedPokemons = allAdoptedPokemons.map((pokemon: Pokemon) => {
        const updatedPokemon = updatedPokemons.find(p => p._id === pokemon._id);
        return updatedPokemon || pokemon;
      });
      
      localStorage.setItem('adoptedPokemons', JSON.stringify(allUpdatedPokemons));
    }
    
    return updatedPokemons;
  },

  adoptPokemon: async (pokemonId: string): Promise<{ pokemon: Pokemon; user: User }> => {
    // Get current user
    const userString = localStorage.getItem('user');
    if (!userString) {
      throw new Error('User not logged in');
    }
    
    const currentUser: User = JSON.parse(userString);
    
    // Get available Pokémon
    const allPokemons = await mockApiService.getAllPokemons();
    const pokemon = allPokemons.find(p => p._id === pokemonId);
    
    if (!pokemon) {
      throw new Error('Pokemon not found');
    }
    
    if (pokemon.price > currentUser.coins) {
      throw new Error('Not enough coins');
    }
    
    if (pokemon.isAdopted) {
      throw new Error('This Pokémon has already been adopted');
    }
    
    // Update the pokemon
    const adoptedPokemon = { 
      ...pokemon, 
      isAdopted: true, 
      lastFed: new Date().toISOString(),
      adoptedBy: currentUser._id
    };
    
    // Update user coins
    const updatedUser = { 
      ...currentUser, 
      coins: currentUser.coins - pokemon.price
    };
    
    // Get current adopted Pokémon list and add new one
    const adoptedPokemons = JSON.parse(localStorage.getItem('adoptedPokemons') || '[]');
    const updatedAdoptedPokemons = [...adoptedPokemons, adoptedPokemon];
    
    // Update the user's adoptedPokemons array as well
    const userAdoptedPokemons = updatedUser.adoptedPokemons || [];
    updatedUser.adoptedPokemons = [...userAdoptedPokemons, adoptedPokemon];
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('adoptedPokemons', JSON.stringify(updatedAdoptedPokemons));
    
    // Mark this pokemon as adopted in the available list too
    const updatedAvailablePokemons = allPokemons.map((p: Pokemon) => 
      p._id === pokemonId ? { ...p, isAdopted: true } : p
    );
    localStorage.setItem('availablePokemons', JSON.stringify(updatedAvailablePokemons));
    
    return { pokemon: adoptedPokemon, user: updatedUser };
  },

  feedPokemon: async (pokemonId: string): Promise<{ pokemon: Pokemon; message: string }> => {
    // Get current user
    const userString = localStorage.getItem('user');
    if (!userString) {
      throw new Error('User not logged in');
    }
    
    const currentUser: User = JSON.parse(userString);
    const feedingCost = 5; // 5 coins per feeding
    
    if (currentUser.coins < feedingCost) {
      throw new Error('Not enough coins to feed this Pokémon. Feeding costs 5 coins.');
    }
    
    // Get all adopted Pokémon
    const allAdoptedPokemons = JSON.parse(localStorage.getItem('adoptedPokemons') || '[]');
    const pokemonIndex = allAdoptedPokemons.findIndex((p: Pokemon) => 
      p._id === pokemonId && p.adoptedBy === currentUser._id
    );
    
    if (pokemonIndex === -1) {
      throw new Error('Pokemon not found or not owned by you');
    }
    
    // Update Pokemon health and lastFed
    const updatedPokemon = {
      ...allAdoptedPokemons[pokemonIndex],
      health: Math.min(100, allAdoptedPokemons[pokemonIndex].health + 20),
      lastFed: new Date().toISOString()
    };
    
    // Update user coins
    const updatedUser = {
      ...currentUser,
      coins: currentUser.coins - feedingCost
    };
    
    // Update the user's adoptedPokemons list too
    if (updatedUser.adoptedPokemons) {
      updatedUser.adoptedPokemons = updatedUser.adoptedPokemons.map((p: Pokemon) =>
        p._id === pokemonId ? updatedPokemon : p
      );
    }
    
    // Update in storage
    allAdoptedPokemons[pokemonIndex] = updatedPokemon;
    localStorage.setItem('adoptedPokemons', JSON.stringify(allAdoptedPokemons));
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return { 
      pokemon: updatedPokemon, 
      message: `${updatedPokemon.name} has been fed and is feeling better!` 
    };
  },

  collectFairyReward: async (): Promise<{ user: User; message: string }> => {
    // Get current user
    const userString = localStorage.getItem('user');
    if (!userString) {
      throw new Error('User not logged in');
    }
    
    const currentUser: User = JSON.parse(userString);
    
    // Update user with coins and timestamp
    const updatedUser = {
      ...currentUser,
      coins: currentUser.coins + 1,
      lastFairyReward: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return {
      user: updatedUser,
      message: "You received 1 coin from Fairy Tuba!"
    };
  },

  collectTubaReward: async (): Promise<{ user: User; message: string }> => {
    // Get current user
    const userString = localStorage.getItem('user');
    if (!userString) {
      throw new Error('User not logged in');
    }
    
    const currentUser: User = JSON.parse(userString);
    
    // Check if 10 hours have passed since last collection
    const lastReward = currentUser.lastTubaReward ? new Date(currentUser.lastTubaReward) : null;
    const currentTime = new Date();
    
    if (lastReward && ((currentTime.getTime() - lastReward.getTime()) < 10 * 60 * 60 * 1000)) {
      throw new Error('You can collect this reward again in a few hours');
    }
    
    // Update user with coins and timestamp
    const updatedUser = {
      ...currentUser,
      coins: currentUser.coins + 5,
      lastTubaReward: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return {
      user: updatedUser,
      message: "You received 5 coins from Fairy Tuba!"
    };
  },

  // Enhanced Auth methods with user data persistence
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Find user with matching credentials
    const user = registeredUsers.find((u: User & { password: string }) => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (user) {
      // Remove password before storing in state
      const { password, ...safeUser } = user;
      
      // Retrieve user's adopted Pokémon - only those adopted by this user
      const allAdoptedPokemons = JSON.parse(localStorage.getItem('adoptedPokemons') || '[]');
      const userPokemons = allAdoptedPokemons.filter((p: Pokemon) => p.adoptedBy === safeUser._id);
      
      const fullUser = {
        ...safeUser,
        adoptedPokemons: userPokemons
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(fullUser));
      localStorage.setItem('token', token);
      
      return { user: fullUser as User, token };
    }
    
    // Demo user for testing
    if (credentials.email === 'user@example.com' && credentials.password === 'password') {
      const demoId = '12345';
      
      // Check if this demo user already exists in our system (they might have coins/pokemon already)
      const existingDemoUser = JSON.parse(localStorage.getItem('demoUser') || 'null');
      const userCoins = existingDemoUser ? existingDemoUser.coins : 100;
      
      const user: User = {
        _id: demoId,
        username: 'DemoUser',
        email: credentials.email,
        coins: userCoins,
        adoptedPokemons: []
      };
      
      // Retrieve user's adopted Pokémon - only those adopted by this user
      const allAdoptedPokemons = JSON.parse(localStorage.getItem('adoptedPokemons') || '[]');
      const userPokemons = allAdoptedPokemons.filter((p: Pokemon) => p.adoptedBy === demoId);
      
      const fullUser = {
        ...user,
        adoptedPokemons: userPokemons
      };
      
      const token = 'mock-jwt-token-demo';
      
      localStorage.setItem('user', JSON.stringify(fullUser));
      localStorage.setItem('token', token);
      localStorage.setItem('demoUser', JSON.stringify(fullUser)); // Store special record for demo user
      
      return { user: fullUser, token };
    }
    
    throw new Error('Invalid email or password');
  },
  
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    // Get existing users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if user already exists
    const userExists = registeredUsers.some((u: User) => u.email === credentials.email);
    if (userExists) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      _id: Date.now().toString(),
      username: credentials.username,
      email: credentials.email,
      password: credentials.password, // In a real app, this would be hashed
      coins: 100,
      adoptedPokemons: []
    };
    
    // Add to registered users
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Remove password for state/response
    const { password, ...safeUser } = newUser;
    
    const token = 'mock-jwt-token-' + Date.now();
    
    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(safeUser));
    localStorage.setItem('token', token);
    
    return { user: safeUser as User, token };
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return;
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    const user = JSON.parse(userString);
    
    // Check if token exists (user is logged in)
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    return user as User;
  }
};

// Export the appropriate service based on environment
export const pokemonService = mockApiService;
