const mongoose = require('mongoose');
  const { Schema, Types } = mongoose;

  const CallSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },    
  });

  module.exports = mongoose.model('FakeCall', CallSchema);