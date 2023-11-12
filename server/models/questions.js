// Question Document Schema
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  qid: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  tagIds: [{
    type: String
  }],
  askedBy: {
    type: String,
    required: true
  },
  askDate: {
    type: Date,
    required: true
  },
  ansIds: [{
    type: String
  }],
  views: {
    type: Number,
    default: 0
  }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
