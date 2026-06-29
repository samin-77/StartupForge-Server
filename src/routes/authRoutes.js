const router = require('express').Router();
const { registerUser, loginUser, googleLogin, logoutUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

module.exports = router;
