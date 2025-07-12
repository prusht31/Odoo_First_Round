const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { leaveFeedback, getFeedbackForUser } = require('../controllers/feedbackController');

router.post('/', protect, leaveFeedback);
router.get('/:userId', getFeedbackForUser);

module.exports = router;
