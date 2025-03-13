const mongoose = require('mongoose');
  const { Schema, Types } = mongoose;

  const UserSchema = new Schema({
    //name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },    
  });

  module.exports = mongoose.model('User', UserSchema);