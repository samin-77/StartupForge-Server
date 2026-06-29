const router = require('express').Router();
const { createStartup, getMyStartup, updateStartup, deleteStartup, getAllStartups, getStartupById } = require('../controllers/startupController');
const { protect, authorize } = require('../middleware/auth');

router.get('/all', getAllStartups);
router.get('/:id', getStartupById);
router.post('/', protect, authorize('founder'), createStartup);
router.get('/', protect, authorize('founder'), getMyStartup);
router.put('/', protect, authorize('founder'), updateStartup);
router.delete('/', protect, authorize('founder'), deleteStartup);

module.exports = router;
