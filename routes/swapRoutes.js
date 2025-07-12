const express = require('express');
const {
  createSwapRequest,
  getSwapRequests,
  updateSwapStatus,
  deleteSwap
} = require('../controllers/swapController');
const protect = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createSwapRequest);
router.get('/', protect, getSwapRequests);
router.put('/:id', protect, updateSwapStatus);
router.delete('/:id', protect, deleteSwap);

module.exports = router;
