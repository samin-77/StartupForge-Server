const router = require('express').Router();
const { createOpportunity, getMyOpportunities, updateOpportunity, deleteOpportunity, getOpportunities, getOpportunityById, getDashboardStats } = require('../controllers/opportunityController');
const { protect, authorize } = require('../middleware/auth');

router.get('/all', getOpportunities);
router.get('/:id', getOpportunityById);
router.post('/', protect, authorize('founder'), createOpportunity);
router.get('/', protect, authorize('founder'), getMyOpportunities);
router.get('/stats/overview', protect, authorize('founder'), getDashboardStats);
router.put('/:id', protect, authorize('founder'), updateOpportunity);
router.delete('/:id', protect, authorize('founder'), deleteOpportunity);

module.exports = router;
