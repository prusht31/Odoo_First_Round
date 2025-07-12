const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  title: String,
  content: String,
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
