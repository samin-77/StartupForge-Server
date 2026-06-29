const router = require('express').Router();
const { applyToOpportunity, getMyApplications, getFounderApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, applyToOpportunity);
router.get('/my', protect, authorize('collaborator'), getMyApplications);
router.get('/founder', protect, authorize('founder'), getFounderApplications);
router.put('/:id/status', protect, authorize('founder'), updateApplicationStatus);

module.exports = router;
