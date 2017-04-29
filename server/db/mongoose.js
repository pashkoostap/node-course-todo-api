const mongoose = require('mongoose');

let DB;
if (process.env.PORT) {
  DB = 'mongodb://ostap:test@ds062339.mlab.com:62339/todo-app';
} else {
  DB = 'mongodb://localhost:27017/todo-app';
}

mongoose.Promise = global.Promise;
mongoose.connect(DB);

module.exports = {
  mongoose
}