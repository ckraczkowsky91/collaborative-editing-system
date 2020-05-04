const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  text: {
   type: String,
   required: true
 },
 state: {
   type: Array,
   default: [0,0]
 }
});

const mutationSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  conversationId: {
    type: String,
    required: true
  },
  index: {
    type: Number
  },
  length: {
    type: Number
  },
  text: {
    type: String
  },
  type: {
    type: String
  },
  conversationState: {
    type: Array
  }
});

module.exports.conversationSchema = conversationSchema;
module.exports.mutationSchema = mutationSchema;
