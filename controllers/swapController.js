const SwapRequest = require('../models/SwapRequest');

exports.createSwapRequest = async (req, res) => {
  const { to, message } = req.body;
  const swap = await SwapRequest.create({ from: req.user, to, message });
  res.status(201).json(swap);
};

exports.getSwapRequests = async (req, res) => {
  const swaps = await SwapRequest.find({
    $or: [{ from: req.user }, { to: req.user }]
  }).populate('from to', 'name skillsOffered');
  res.json(swaps);
};

exports.updateSwapStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await SwapRequest.findByIdAndUpdate(id, { status }, { new: true });
  res.json(updated);
};

exports.deleteSwap = async (req, res) => {
  const { id } = req.params;
  await SwapRequest.findByIdAndDelete(id);
  res.json({ message: 'Swap deleted' });
};
