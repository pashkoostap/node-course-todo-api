const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let DB = 'mongodb://ostap:test@ds062339.mlab.com:62339/todo-app';
mongoose.connect(DB);

module.exports = {
  mongoose
}