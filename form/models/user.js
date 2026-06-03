const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  loginId: { type: String, unique: true },
  password: String
});

module.exports = mongoose.model('User', userSchema);
