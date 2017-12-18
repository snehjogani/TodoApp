const mongoose = require('mongoose'),
	Todo = mongoose.model('Todos'),
  Comments = mongoose.model('Comments');

exports.create = (req, res) => {
  var newComment = new Comments({
    todoId: req.params.id,
    comment: req.body.comment
  });
  newComment.save()
    .then(comment => {
      res.redirect('/view/' + req.params.id);
    });
}

exports.delete = (req, res) => {
  Comments.remove({ _id: req.params.commentId })
  .then(comment => {
    res.redirect('/view/' + req.params.todoId);
  });
}