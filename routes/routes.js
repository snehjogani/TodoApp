const express = require('express'),
  router = express.Router(),  
  passport = require('passport'),
  localStrategy = require('passport-local').Strategy,
  User = require('../models/users'),
  todoController = require('../controller/todoController'),
  commentController = require('../controller/commentsController'),
  userController = require('../controller/userController');

router.get('/register', userController.registerGet);
router.get('/login', userController.loginGet);

passport.use(new localStrategy(
  (username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: 'Unknown User' });
      }
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        }
        else {
          return done(null, false, { message: 'Invalid Password' });
        }
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/register', userController.registerPost);

router.post('/login', passport.authenticate('local', {
  successReidrect: '/',
  failureRedirect: '/login',
  failureFlash: true
}), userController.loginPost);

router.get('/logout', userController.logout);

router.get('/', userController.isLogin, todoController.list);
router.post('/', todoController.update);

router.get('/create', todoController.create);

router.get('/view/:id', todoController.read);
router.post('/view/:id', commentController.create);
router.post('/delete/:id', todoController.delete);

router.get('/edit/:id', todoController.edit);

router.get('/delete/:todoId/:commentId', commentController.delete);

module.exports = router;
