const mongoose = require('mongoose');
  const { Schema, Types } = mongoose;

  const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },    
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  });

  module.exports = mongoose.model('User', UserSchema);