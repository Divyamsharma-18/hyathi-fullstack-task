require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { updatePokemonHealth } = require('./services/pokemonService');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');



// Connect to DB
// Close existing connection
mongoose.disconnect()
  .then(() => console.log('Disconnected from MongoDB'))
  .catch(err => console.error('Error disconnecting from MongoDB:', err));

  mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});

// Reconnect after disconnecting
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());
app.use(cookieParser()); 
// Body parser
app.use(express.json());



// Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Add root route
app.get('/', (req, res) => {
  res.send('Pokemon Adoption Backend is Running');
});

// Mount routers
// app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/pokemons', require('./routes/pokemonRoutes'));
app.use('/api/rewards', require('./routes/rewardRoutes'));


app.use('/api/users', authRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server Error' });
});

// Health check cron job
cron.schedule('0 * * * *', async () => {
  console.log('Checking Pokemon health...');
  await updatePokemonHealth();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));