const User = require('../models/User');

exports.getMyProfile = async (req, res) => {
  const user = await User.findById(req.user).select('-password');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    if (req.file) {
      updates.profilePhoto = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed' });
  }
};

exports.searchUsers = async (req, res) => {
  const { skill } = req.query;
  const users = await User.find({
    skillsOffered: { $regex: skill, $options: 'i' },
    isPublic: true
  }).select('-password');
  res.json(users);
};
