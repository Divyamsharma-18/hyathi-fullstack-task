const express = require('express');
const { collectFairyReward, collectTubaReward } = require('../controllers/rewardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/fairy', protect, collectFairyReward);
router.post('/tuba', protect, collectTubaReward);

module.exports = router;