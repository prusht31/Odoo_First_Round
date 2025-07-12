const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const {
  banUser,
  updateUserSkills,
  getAllSwaps,
  sendMessage,
  getMessages,
  downloadReports
} = require('../controllers/adminController');

// All routes: [protect, adminOnly]
router.put('/ban-user/:id', protect, adminOnly, banUser);
router.put('/clear-skills/:id', protect, adminOnly, updateUserSkills);
router.get('/swaps', protect, adminOnly, getAllSwaps);
router.post('/messages', protect, adminOnly, sendMessage);
router.get('/messages', getMessages);
router.get('/report', protect, adminOnly, downloadReports);

module.exports = router;
