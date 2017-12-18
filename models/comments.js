const mongoose = require('mongoose'),
  schema = mongoose.Schema;

var commentSchema = new schema({
  todoId: mongoose.Schema.Types.ObjectId,
  comment: String,
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comments', commentSchema);