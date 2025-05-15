
import axios from 'axios';

// Define base URL
const API_BASE_URL = 'https://virtual-pokemon-adoption-api.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pokemon_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('pokemon_token', response.data.token);
      localStorage.setItem('pokemon_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('pokemon_token', response.data.token);
      localStorage.setItem('pokemon_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('pokemon_token');
    localStorage.removeItem('pokemon_user');
    window.location.href = '/';
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('pokemon_user');
    return user ? JSON.parse(user) : null;
  },
  
  updateUserCoins: async (coins: number) => {
    const response = await api.patch('/users/coins', { coins });
    // Update local storage with new user data
    localStorage.setItem('pokemon_user', JSON.stringify(response.data));
    return response.data;
  }
};

// Pokemon services
export const pokemonService = {
  getAllPokemons: async () => {
    const response = await api.get('/pokemons');
    return response.data;
  },
  
  adoptPokemon: async (pokemonId: string) => {
    const response = await api.post(`/pokemons/${pokemonId}/adopt`);
    // Update local storage with new user data if returned
    if (response.data.user) {
      localStorage.setItem('pokemon_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  feedPokemon: async (pokemonId: string) => {
    const response = await api.post(`/pokemons/${pokemonId}/feed`);
    return response.data;
  },
  
  getUserPokemons: async () => {
    const response = await api.get('/users/pokemons');
    return response.data;
  },
  
  collectTubaReward: async () => {
    const response = await api.post('/users/tuba-reward');
    // Update local storage with new user data
    localStorage.setItem('pokemon_user', JSON.stringify(response.data));
    return response.data;
  },
  
  getDailyLoginReward: async () => {
    const response = await api.post('/users/daily-reward');
    // Update local storage with new user data
    localStorage.setItem('pokemon_user', JSON.stringify(response.data));
    return response.data;
  }
};

// Mock API service for local development
const mockData = {
  pokemons: [
    {
      _id: '1',
      name: 'Pikachu',
      type: 'Electric',
      description: 'A cute electric mouse Pokémon',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      health: 90,
      adoptionCost: 50,
      lastFed: new Date(),
      isAdopted: false,
      isRare: false
    },
    {
      _id: '2',
      name: 'Charmander',
      type: 'Fire',
      description: 'A fire lizard Pokémon with a flame on its tail',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
      health: 85,
      adoptionCost: 60,
      lastFed: new Date(),
      isAdopted: false,
      isRare: false
    },
    {
      _id: '3',
      name: 'Bulbasaur',
      type: 'Grass/Poison',
      description: 'A plant seed Pokémon with a bulb on its back',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      health: 95,
      adoptionCost: 55,
      lastFed: new Date(),
      isAdopted: false,
      isRare: false
    },
    {
      _id: '4',
      name: 'Squirtle',
      type: 'Water',
      description: 'A small turtle Pokémon that shoots water',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
      health: 88,
      adoptionCost: 58,
      lastFed: new Date(),
      isAdopted: false,
      isRare: false
    },
    {
      _id: '5',
      name: 'Mew',
      type: 'Psychic',
      description: 'A mythical Pokémon with the DNA of all Pokémon',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png',
      health: 100,
      adoptionCost: 150,
      lastFed: new Date(),
      isAdopted: false,
      isRare: true
    },
    {
      _id: '6',
      name: 'Mewtwo',
      type: 'Psychic',
      description: 'A genetically engineered Pokémon cloned from Mew',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
      health: 98,
      adoptionCost: 200,
      lastFed: new Date(),
      isAdopted: false,
      isRare: true
    }
  ],
  user: {
    _id: 'user1',
    username: 'trainer1',
    email: 'trainer@example.com',
    coins: 100,
    adoptedPokemons: [],
    lastLogin: new Date(),
    lastTubaReward: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  }
};

// Mock API functions for local development
export const mockApiService = {
  login: async (credentials: { email: string; password: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockData.user;
    const token = 'mock_token_123';
    
    localStorage.setItem('pokemon_token', token);
    localStorage.setItem('pokemon_user', JSON.stringify(user));
    
    return { user, token };
  },
  
  register: async (userData: { username: string; email: string; password: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = {
      ...mockData.user,
      username: userData.username,
      email: userData.email
    };
    const token = 'mock_token_123';
    
    localStorage.setItem('pokemon_token', token);
    localStorage.setItem('pokemon_user', JSON.stringify(user));
    
    return { user, token };
  },
  
  getAllPokemons: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockData.pokemons;
  },
  
  adoptPokemon: async (pokemonId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = JSON.parse(localStorage.getItem('pokemon_user') || '{}');
    const pokemon = mockData.pokemons.find(p => p._id === pokemonId);
    
    if (!pokemon) {
      throw new Error('Pokemon not found');
    }
    
    if (pokemon.isAdopted) {
      throw new Error('This pokemon is already adopted');
    }
    
    if (user.coins < pokemon.adoptionCost) {
      throw new Error('Not enough coins');
    }
    
    // Update user coins and adopted pokemons
    user.coins -= pokemon.adoptionCost;
    user.adoptedPokemons = [...(user.adoptedPokemons || []), { ...pokemon, isAdopted: true }];
    
    // Update pokemon status
    pokemon.isAdopted = true;
    
    localStorage.setItem('pokemon_user', JSON.stringify(user));
    
    return { 
      pokemon, 
      user,
      message: `${pokemon.name} has been adopted successfully!` 
    };
  },
  
  feedPokemon: async (pokemonId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = JSON.parse(localStorage.getItem('pokemon_user') || '{}');
    const pokemonIndex = user.adoptedPokemons?.findIndex((p: any) => p._id === pokemonId);
    
    if (pokemonIndex === -1 || pokemonIndex === undefined) {
      throw new Error('Pokemon not found in your adopted list');
    }
    
    // Update pokemon health and last fed time
    user.adoptedPokemons[pokemonIndex].health = Math.min(100, user.adoptedPokemons[pokemonIndex].health + 10);
    user.adoptedPokemons[pokemonIndex].lastFed = new Date();
    
    localStorage.setItem('pokemon_user', JSON.stringify(user));
    
    return { 
      pokemon: user.adoptedPokemons[pokemonIndex],
      message: `${user.adoptedPokemons[pokemonIndex].name} has been fed and is happier now!` 
    };
  },
  
  getUserPokemons: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = JSON.parse(localStorage.getItem('pokemon_user') || '{}');
    return user.adoptedPokemons || [];
  },
  
  collectTubaReward: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = JSON.parse(localStorage.getItem('pokemon_user') || '{}');
    const lastReward = new Date(user.lastTubaReward);
    const currentTime = new Date();
    
    // Check if 10 hours have passed
    const hoursPassed = (currentTime.getTime() - lastReward.getTime()) / (1000 * 60 * 60);
    
    if (hoursPassed < 10) {
      const hoursRemaining = Math.ceil(10 - hoursPassed);
      throw new Error(`Fairy Tuba is still gathering coins! Come back in ${hoursRemaining} hours.`);
    }
    
    // Update user coins and last reward time
    user.coins += 5;
    user.lastTubaReward = new Date();
    
    localStorage.setItem('pokemon_user', JSON.stringify(user));
    
    return { 
      user,
      message: 'Hi I\'m fairy Tuba, here are your 5 coins, do visit after every 10 hours to get more coins, byeee!' 
    };
  },
  
  getDailyLoginReward: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = JSON.parse(localStorage.getItem('pokemon_user') || '{}');
    const lastLogin = new Date(user.lastLogin);
    const currentTime = new Date();
    
    // Check if it's a new day (24 hours passed)
    const daysPassed = (currentTime.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysPassed < 1) {
      throw new Error('You have already claimed your daily reward today!');
    }
    
    // Update user coins and last login
    user.coins += 10;
    user.lastLogin = new Date();
    
    localStorage.setItem('pokemon_user', JSON.stringify(user));
    
    return { 
      user,
      message: 'You received 10 coins as your daily login reward!' 
    };
  }
};
