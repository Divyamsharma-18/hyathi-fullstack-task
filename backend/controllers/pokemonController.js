const Pokemon = require('../models/Pokemon.js');
const User = require('../models/User');


// @desc    Get all pokemons
// @route   GET /api/pokemons
// @access  Public
// const Pokemon = require('../models/Pokemon');

exports.getAllPokemons = async (req, res) => {
  try {
    console.log('Fetching all Pokémon...');
    const pokemons = await Pokemon.find({});
    console.log(`Fetched ${pokemons.length} Pokémon`);
    res.json(pokemons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error', error });
  }
};

// @desc    Get user's adopted pokemons
// @route   GET /api/pokemons/user
// @access  Private
exports.getUserPokemons = async (req, res) => {
  try {
    // First update health status
    // await updatePokemonHealth();

    exports.feedPokemon = async (req, res) => {
  const { UserId, pokemonId, feedingCost } = req.body;

  if (!UserId) {
    return res.status(400).json({
      status: false,
      message: "userId not there",
    });
  }

  const foundUser = await User.findById(UserId);
  if (!foundUser) {
    return res.status(400).json({
      status: false,
      message: "no user found",
    });
  }

  const updatedPokemon = await Pokemon.findByIdAndUpdate(
    pokemonId,
    { fullyFeed: true },
    { new: true }
  );
  if (!updatedPokemon) {
    return res.status(400).json({
      status: false,
      message: "no pokemon found",
    });
  }

  foundUser.coins -= feedingCost;
  await foundUser.save();

  return res.status(200).json({
    message: "feeded",
    status: true,
    updatedPokemon,
    remainingCoins: foundUser.coins,
  });
};

    // Then fetch user's pokemons
    const pokemons = await Pokemon.find({ adoptedBy: req.user.id });
    res.json(pokemons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// code to add pokemon
exports.addPokemon=async(req,res)=>{
  console.log(req.body)
    const {
    userEmail,
    name,
    breed,
    age,
    type,
    imageUrl,
    description,
    health,
    rarity,
    isRare,
    isLegendary,
    price,
    cost,
    isAdopted
  } = req.body;

    // if(!pokemon){
    //     return res.status(401).json({
    //       status:false,
    //       message:"please provide details"
    //     })
    // }

    const user = await User.findOne({ email : userEmail });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
    console.log(user.coins)
    if (user.coins < cost) {
      return res.status(400).json({
        status: false,
        message: "Not enough coins to adopt this pokemon.",
      });
    }
    user.coins -= cost;
    await user.save();

    const newPokemon=await Pokemon.create({
        UserId:userEmail,
        name,
        type,
        image:imageUrl,
        health,
        rarity,
        isRare: isRare,
        isLegendary: isLegendary,
        price:cost,
        isAdopted:isAdopted
    })

    if(!newPokemon){
        return res.status(400).json({
            status:false,
            message:"somethng went wrong"
        }     
        )
    }
    return res.status(201).json({
        status:true,
        message:'added'
    }
    )
} 

// @desc    Adopt a pokemon
// @route   POST /api/pokemons/:id/adopt
// @access  Private
exports.adoptPokemon = async (req, res, next) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);

    if (!pokemon) {
      return res.status(404).json({ success: false, error: 'Pokemon not found' });
    }

    if (pokemon.isAdopted) {
      return res.status(400).json({ success: false, error: 'This Pokémon has already been adopted' });
    }

    const user = await User.findById(req.user.id);

    if (user.coins < pokemon.price) {
      return res.status(400).json({ success: false, error: 'Not enough coins' });
    }

    // Update Pokémon adoption status
    pokemon.isAdopted = true;
    pokemon.adoptedBy = user._id;
    pokemon.lastFed = new Date();
    await pokemon.save();

    // Update user coins and add to their adopted list
    user.coins -= pokemon.price;

    // Ensure the array exists
    if (!user.pokemons) {
      user.pokemons = [];
    }

    // Push only if not already adopted (avoid duplicates)
    if (!user.pokemons.includes(pokemon._id)) {
      user.pokemons.push(pokemon._id);
    }

    await user.save();


    res.json({
      success: true,
      pokemon,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        coins: user.coins
      }
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Feed a pokemon
// @route   POST /api/pokemons/:id/feed
// @access  Private
exports.feedPokemon = async (req, res, next) => {
  try {
    // Check if the pokemon exists and belongs to the user
    const pokemon = await Pokemon.findOne({
      _id: req.params.id,
      adoptedBy: req.user.id
    });

    if (!pokemon) {
      return res.status(404).json({ success: false, error: 'Pokemon not found or not owned by you' });
    }

    // Find the user and check if they have enough coins
    const user = await User.findById(req.user.id);
    const feedingCost = 5; // 5 coins per feeding

    if (user.coins < feedingCost) {
      return res.status(400).json({
        success: false,
        error: 'Not enough coins to feed this Pokémon. Feeding costs 5 coins.'
      });
    }

    // Update pokemon health and last fed time
    pokemon.health = Math.min(100, pokemon.health + 20);
    pokemon.lastFed = new Date();
    await pokemon.save();

    // Deduct coins from user
    user.coins -= feedingCost;
    await user.save();

    res.json({
      success: true,
      pokemon,
      message: `${pokemon.name} has been fed and is feeling better!`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        coins: user.coins
      }
    });
  } catch (error) {
    next(error);
  }
};