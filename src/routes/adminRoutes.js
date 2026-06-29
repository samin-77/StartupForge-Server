const router = require('express').Router();
const { getAdminOverview, getUsers, toggleUserBlock, getAdminStartups, approveStartup, removeStartup, getTransactions } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/overview', getAdminOverview);
router.get('/users', getUsers);
router.put('/users/:id/block', toggleUserBlock);
router.get('/startups', getAdminStartups);
router.put('/startups/:id/approve', approveStartup);
router.delete('/startups/:id', removeStartup);
router.get('/transactions', getTransactions);

module.exports = router;
