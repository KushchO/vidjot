const mongose = require('mongoose');
const Schema = mongose.Schema;

//Create Schema
const IdeaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongose.model('ideas', IdeaSchema);
