const express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  exphbs = require('express-handlebars'),
  bodyparser = require('body-parser'),
  ta = require('node-time-ago'),
  handlebars = require('handlebars'),
  cookieparser = require('cookie-parser'),
  validator = require('express-validator'),
  flash = require('connect-flash'),
  session = require('express-session'),
  passport = require('passport'),
  localStrategy = require('passport-local').Strategy,
  todo = require('./models/todos'),
  comments = require('./models/comments'),
  user = require('./models/users'),
  routes = require('./routes/routes'),
  app = express();

mongoose.Promise = global.Promise;
mongoose.connection.openUri('mongodb://localhost/todoList');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({extname: 'hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');

// custom helpper for time-ago
handlebars.registerHelper('timeAgo', function (time) {
  return new handlebars.SafeString('<i>' + ta(time) + '</i>');
});
// custom helper for checking status
handlebars.registerHelper('statusCompleted', function (status, options) {
  if (status == "completed")
    return options.fn(this);
  else
    return options.inverse(this);
});
handlebars.registerHelper('statusOngoing', function (status, options) {
  if (status == "ongoing")
    return options.fn(this);
  else
    return options.inverse(this);
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieparser());


// express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// passport init
app.use(passport.initialize());
app.use(passport.session());

// express validator
app.use(validator({
  errorFormatter: (param, msg, value) => {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// connect flash
app.use(flash());

// global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
  console.log('Server started on port ' + app.get('port'));
});
