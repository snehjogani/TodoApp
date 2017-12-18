const mongoose = require('mongoose'),
	Todo = mongoose.model('Todos'),
  Comments = mongoose.model('Comments');

exports.list = (req, res) => {
  Todo.find({userId: req.user._id})
    .then(todo => {
      var user = req.user.name;
      var n = user.indexOf(' ');
      if (n > 0)  
        user = user.slice(0, n);  
      res.render('home', {
        user: user,
        todo: todo
      });
    });
}

exports.create = (req, res) => {
  res.render('create');
}

exports.update = (req, res) => {
  if (req.body.id) {
    Todo.update({ _id: req.body.id }, { $set: req.body })  
      .then(todo => {
        res.redirect('/');
      });
  }
  else {
    var newTodo = new Todo({
      userId: req.user,
      name: req.body.name,
      desc: req.body.desc,
      status: req.body.status
    });
    newTodo.save()
      .then(todo => {
        res.redirect('/');
      });
  }
}

exports.read = (req, res) => {
  Todo.findById(req.params.id)
    .then(todo => {
      Comments.find({ todoId: req.params.id }).sort({time: -1})
        .then(comments => {
          res.render('view', {
            todo: todo,
            comment: comments
          });
        });     
    });  
}

exports.edit = (req, res) => {
  Todo.findById(req.params.id)
    .then(todo => {
      res.render('edit', { todo: todo });
    }); 
}

exports.delete = (req, res) => {
  Todo.findByIdAndRemove(req.params.id)
    .then(todo => {
      res.redirect('/');
    });
}