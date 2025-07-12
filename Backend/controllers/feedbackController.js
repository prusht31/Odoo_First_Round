const Feedback = require('../models/Feedback');

exports.leaveFeedback = async (req, res) => {
  const { to, rating, comment } = req.body;

  const feedback = await Feedback.create({
    from: req.user,
    to,
    rating,
    comment
  });

  res.status(201).json(feedback);
};

exports.getFeedbackForUser = async (req, res) => {
  const feedbacks = await Feedback.find({ to: req.params.userId })
    .populate('from', 'name');
  res.json(feedbacks);
};
