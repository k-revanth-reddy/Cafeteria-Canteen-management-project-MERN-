const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phNo: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['Hostel Student', 'Day Scholar']
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
