const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const { authenticate } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req.body)
  const todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then(
    (todos) => {
      res.send({ todos })
    }, (err) => {
      res.status(400).send(err);
    })
});

app.get('/todos/:id', (req, res) => {
  let todoID = req.params.id;
  if (!ObjectID.isValid(todoID)) {
    return res.status(404).send();
  }
  Todo.findById(todoID).then(
    (todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    }).catch((err) => {
      res.status(404).send();
    })
})

app.delete('/todos/:id', (req, res) => {
  let todoID = req.params.id;
  if (!ObjectID.isValid(todoID)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(todoID).then(
    (todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    }).catch((err) => {
      res.status(404).send();
    })
})

app.patch('/todos/:id', (req, res) => {
  let todoID = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(todoID)) {
    return res.status(404).send();
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(todoID,
    { $set: body },
    { new: true }).then((todo) => {
      if (!todo) {
        res.status(404).send();
      }
      res.send({ todo });
    }).catch((err) => res.status(404).send());
})

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    res.status(404).send(err);
  })
})

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Started at port ${port}`);
});

module.exports = {
  app
}
