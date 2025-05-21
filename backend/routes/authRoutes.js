const express = require('express');
// const { register, login, getMe, getCurrentUser } = require('../controllers/authController');
const { register, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');

const router = express.Router();

console.log('[ROUTES] Auth routes loaded');


router.post('/register', register);
// router.post('/login', loginValidation, login);
// router.post('/login', login);
// router.get('/me', getCurrentUser);
router.get('/me', protect, getMe);
router.post('/login', loginUser);



module.exports = router;
// exports.loginUser = loginUser;