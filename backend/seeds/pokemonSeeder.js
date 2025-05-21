const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pokemon = require('../models/Pokemon.js');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();
console.log('Connecting to Mongo URI:', process.env.MONGO_URI);


// Connect to DB
connectDB();

// Pokemon data


// Import the data
(async () => {
  await connectDB(); // 🛑 Add await here

  const pokemonData = [
  {
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
  // Add more pokemon from the frontend mockApiService data
  {
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
  }
];

  try {
    const deleted = await Pokemon.deleteMany();
    console.log(`Deleted ${deleted.deletedCount} Pokémon`);

    const inserted = await Pokemon.insertMany(pokemonData);
    console.log(`Inserted ${inserted.length} Pokémon`);
    
    process.exit(0); // ✅ only exit after it finishes
  } catch (err) {
    console.error('Error inserting data:', err);
    process.exit(1);
  }
})();