const mongoose = require('mongoose'),
  bcrypt = require('bcryptjs'),  
  schema = mongoose.Schema;

var userSchema = new schema({
  name: String,
  username: {
    type: String,
    index: true
  },
  email: String,
  password: String
});
  
var User = module.exports = mongoose.model('Users', userSchema);

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.getUserByUsername = (username, callback) => {
  User.findOne({ username: username }, callback);
}

module.exports.comparePassword = (password, hash, callback) => {
  bcrypt.compare(password, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}