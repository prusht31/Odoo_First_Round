const User = require('../models/User');
const SwapRequest = require('../models/SwapRequest');
const Feedback = require('../models/Feedback');
const Message = require('../models/Message');
const fs = require('fs');

exports.banUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: 'banned' }, { new: true });
  res.json({ message: 'User banned', user });
};

exports.updateUserSkills = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { skillsOffered: [], skillsWanted: [] },
    { new: true }
  );
  res.json({ message: 'Skills cleared', user });
};

exports.getAllSwaps = async (req, res) => {
  const swaps = await SwapRequest.find().populate('from to', 'name');
  res.json(swaps);
};

exports.sendMessage = async (req, res) => {
  const message = await Message.create({
    title: req.body.title,
    content: req.body.content,
  });
  res.status(201).json(message);
};

exports.getMessages = async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
};

exports.downloadReports = async (req, res) => {
  const users = await User.find();
  const feedbacks = await Feedback.find();
  const swaps = await SwapRequest.find();

  const report = {
    totalUsers: users.length,
    totalSwaps: swaps.length,
    totalFeedbacks: feedbacks.length,
    users,
    swaps,
    feedbacks
  };

  const filePath = 'report.json';
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  res.download(filePath);
};
