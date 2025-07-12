const mongoose = require('mongoose');

const SwapRequestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  message: String
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', SwapRequestSchema);
