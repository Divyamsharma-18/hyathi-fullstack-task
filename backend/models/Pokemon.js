const mongoose = require('mongoose');
const User = require('./User');

const PokemonSchema = new mongoose.Schema({
  UserId: {
    type: String,
    // ref: 'User',
    // required: true
  },
  name: {
    type: String,
    // required: [true, 'Please provide a name'],
    trim: true
  },
  breed: {
    type: String,
    // required: [true, 'Please provide a breed'],
    trim: true
  },
  age: {
    type: Number,
    // required: [true, 'Please provide an age']
  },
  type: {
    type: [String],
    // required: [true, 'Please provide types']
  },
  image: {
    type: String,
    // required: [true, 'Please provide an image URL']
  },
  description: {
    type: String,
    // required: [true, 'Please provide a description']
  },
  health: {
    type: Number,
    default: 100,
    min: 1,
    max: 200
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'legendary'],
    // required: [true, 'Please provide a rarity']
  },
  price: {
    type: Number,
    // required: [true, 'Please provide a price']
  },
  isAdopted: {
    type: Boolean,
    default: false
  },
  adoptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastFed: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pokemon', PokemonSchema);