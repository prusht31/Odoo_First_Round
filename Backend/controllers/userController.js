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

const searchUsers = async (req, res) => {
  try {
    const { query, location, skill, availability } = req.query;

    const searchQuery = {
      isPublic: true,
      isBanned: { $ne: true } // Optional: exclude banned users
    };

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { skillsOffered: { $regex: query, $options: 'i' } },
        { skillsWanted: { $regex: query, $options: 'i' } }
      ];
    }

    if (location) {
      searchQuery.location = { $regex: location, $options: 'i' };
    }

    if (skill) {
      searchQuery.skillsOffered = { $regex: skill, $options: 'i' };
    }

    if (availability) {
      const availArray = Array.isArray(availability)
        ? availability
        : [availability];

      searchQuery.availability = { $in: availArray };
    }

    const users = await User.find(searchQuery).select('-password'); // hide password
    res.json(users);
  } catch (err) {
    console.error('Search Error:', err);
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};
exports.searchUsers = searchUsers;
exports.updateProfile = updateProfile;  
exports.getMyProfile = getMyProfile;

