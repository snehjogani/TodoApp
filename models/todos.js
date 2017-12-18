const mongoose = require('mongoose'),
  schema = mongoose.Schema;

var todoSchema = new schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  desc: String,
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }
});

module.exports = mongoose.model('Todos', todoSchema);
