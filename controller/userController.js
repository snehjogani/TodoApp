const mongoose = require('mongoose'),
  passport = require('passport'),
  localStrategy = require('passport-local').Strategy,
  User = require('../models/users');

exports.registerGet = (req, res) => {
  res.render('register');
}

exports.loginGet = (req, res) => {
  res.render('login');
}

exports.isLogin = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  else
    res.redirect('/login');  
} 

exports.registerPost = (req, res) => {
  // Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passowrds do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    res.render('register', { errors: errors });
  } else {
    var newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    User.createUser(newUser, (err, user) => {
      if (err) throw err;
    });
    req.flash('success_msg', 'You are registerd and can now login');
    res.redirect('/login');
  }
}

exports.loginPost = (req, res) => {
  res.redirect('/');
}  

exports.logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
}

