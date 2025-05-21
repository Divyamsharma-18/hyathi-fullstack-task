const express = require('express');
const {
  getAllPokemons,
  getUserPokemons,
  adoptPokemon,
  feedPokemon,
  addPokemon: pokemonController,
} = require('../controllers/pokemonController');
const { protect } = require('../middleware/auth');


const router = express.Router();

router.get('/', getAllPokemons);
router.get('/user', protect, getUserPokemons);
router.post("/adopt-pokemon", pokemonController);
// router.post('/:id/adopt', protect, adoptPokemon);
router.post('/:id/feed', protect, feedPokemon);

module.exports = router;