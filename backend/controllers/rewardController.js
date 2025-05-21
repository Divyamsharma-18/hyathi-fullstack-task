const User = require('../models/User');

// @desc    Collect fairy reward (1 coin every hour)
// @route   POST /api/rewards/fairy
// @access  Private
exports.collectFairyReward = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if an hour has passed since last collection
    const lastReward = user.lastFairyReward ? new Date(user.lastFairyReward) : null;
    const currentTime = new Date();
    
    if (lastReward && ((currentTime.getTime() - lastReward.getTime()) < 60 * 60 * 1000)) {
      return res.status(400).json({ 
        success: false, 
        error: 'You can collect this reward again in an hour' 
      });
    }
    
    // Add 1 coin and update timestamp
    user.coins += 1;
    user.lastFairyReward = currentTime;
    await user.save();
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        coins: user.coins,
        lastFairyReward: user.lastFairyReward
      },
      message: "You received 1 coin from Fairy Tuba!"
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Collect tuba reward (5 coins every 10 hours)
// @route   POST /api/rewards/tuba
// @access  Private
exports.collectTubaReward = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Check if 10 hours have passed since last collection
    const lastReward = user.lastTubaReward ? new Date(user.lastTubaReward) : null;
    const currentTime = new Date();
    
    if (lastReward && ((currentTime.getTime() - lastReward.getTime()) < 10 * 60 * 60 * 1000)) {
      return res.status(400).json({ 
        success: false, 
        error: 'You can collect this reward again in a few hours' 
      });
    }
    
    // Add 5 coins and update timestamp
    user.coins += 5;
    user.lastTubaReward = currentTime;
    await user.save();
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        coins: user.coins,
        lastTubaReward: user.lastTubaReward
      },
      message: "You received 5 coins from Fairy Tuba!"
    });
  } catch (error) {
    next(error);
  }
};