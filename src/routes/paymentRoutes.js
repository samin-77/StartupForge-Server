const router = require('express').Router();
const { createCheckoutSession, paymentSuccess } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/create-checkout', protect, authorize('founder'), createCheckoutSession);
router.get('/success', protect, paymentSuccess);

module.exports = router;
