require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;
    console.log('Registering user:', username, email);

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists');
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create user
    user = await User.create({
      username,
      email,
      password,
      coins: 100 // New users start with 100 coins
    });
    console.log('User created:', user);

    // Generate JWT token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        coins: user.coins
      },
      token
    });
  } catch (error) {
    console.error('Error during registration:', error);
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     // 1. Check if user exists
//     const user = await User.create({ username, email, password });
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // 2. Verify password
//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // 3. Generate token
//     // const token = user.getSignedJwtToken();
    
    
// const generateToken = (user) => {
//   return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
//     expiresIn: '1d', // optional: set token expiry
//   });
// };

// const token = generateToken(user);

//     // 4. Send response
//     res.json({
//       token,
//       user: {
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//         coins: user.coins
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.loginUser = async (req, res) => {
  console.log('[LOGIN] login controller hit');
  try {

  console.log(req.body);
    const { email, password } = req.body;
    console.log('[login] got email:', email);

    // 1. Check if user exists and get password explicitly
    const user = await User.findOne({ email }).select('+password');

    console.log('[LOGIN] user found?', !!user);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('[DEBUG] JWT_SECRET:', process.env.JWT_SECRET);
    console.log('[DEBUG] JWT_SECRET length:', process.env.JWT_SECRET.length);

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ error: 'Internal server error' });
    }

// 3. Generate token
let token;
try {
  token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: '1d',
  });
} catch (err) {
  console.error('[DEBUG] jwt.sign error:', err.message);
  return res.status(500).json({ error: 'Internal server error' });
}
console.log('[LOGIN] Sending token:', token);
// res.cookie('adminData', JSON.stringify(adminData), {
//             httpOnly: false, // For testing only; set to true in production for security
//             secure: false,   // Set to true if using HTTPS
//             sameSite: 'lax'  // Adjust for cross-origin cookies if necessary
//         });
// 4. Send response (excluding password)
res.cookie('userDetails', JSON.stringify(user), {
  httpOnly: false, // For testing only; set to true in production for security
  secure: false,   // Set to true if using HTTPS
});
res.json({
  token,
  user: {
    _id: user._id,
    username: user.username,
    email: user.email,
    coins: user.coins
  }
});


  } catch (err) {
    console.error('[login] error:', err.message);
    res.status(500).json({ error: err.message });
  }
};


// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        coins: user.coins,
        lastFairyReward: user.lastFairyReward,
        lastTubaReward: user.lastTubaReward
      }
    });
  } catch (error) {
    next(error);
  }
};