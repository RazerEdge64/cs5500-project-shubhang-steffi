// Tag Document Schema
const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  tid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true 
  }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
