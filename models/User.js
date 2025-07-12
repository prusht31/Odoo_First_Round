const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  profilePhoto: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skillsOffered: [String],
  skillsWanted: [String],
  availability: [String],
  isPublic: { type: Boolean, default: true }, 
  status: { type: String, enum: ['active', 'banned'], default: 'active' },
  isAdmin: { type: Boolean, default: false },
  role: { type: String, default: 'user' } // 'admin' or 'user'
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
