const Pokemon = require('../models/Pokemon');

// Update health for Pokemon not fed in 24 hours
const updatePokemonHealth = async () => {
  try {
    const now = new Date();
    
    // Find all adopted Pokemon
    const adoptedPokemons = await Pokemon.find({ isAdopted: true, lastFed: { $ne: null } });
    
    for (const pokemon of adoptedPokemons) {
      const lastFed = new Date(pokemon.lastFed);
      const hoursSinceLastFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);
      
      // If not fed in the last 24 hours, decrease health
      if (hoursSinceLastFed >= 24) {
        const healthDecrease = Math.floor(hoursSinceLastFed / 24) * 10; // 10 health points per day
        pokemon.health = Math.max(1, pokemon.health - healthDecrease); // Don't go below 1
        await pokemon.save();
      }
    }
    
    return adoptedPokemons;
  } catch (error) {
    console.error('Error updating Pokémon health:', error);
    throw error;
  }
};

module.exports = {
  updatePokemonHealth
};