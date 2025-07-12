const User = require('../models/User');

const checkUserStatus = async (req, res, next) => {
  const user = await User.findById(req.user);
  if (user.status === 'banned') {
    return res.status(403).json({ message: 'Your account has been banned' });
  }
  next();
};

module.exports = checkUserStatus;
