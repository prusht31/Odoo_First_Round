const express = require('express');
const router = express.Router();

const protect = require('../middleware/auth');
const checkUserStatus = require('../middleware/checkStatus');
const upload = require('../middleware/upload');

const {
  getMyProfile,
  updateProfile,
  searchUsers
} = require('../controllers/userController');

router.put('/me', protect, checkUserStatus, upload.single('profilePhoto'), updateProfile);

router.get('/me', protect, getMyProfile);

router.get('/search', searchUsers);

module.exports = router;
