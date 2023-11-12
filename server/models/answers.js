// Answer Document Schema
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  aid: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  ansBy: {
    type: String,
    required: true
  },
  ansDate: {
    type: Date,
    required: true
  }
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
