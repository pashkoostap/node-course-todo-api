const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

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

app.listen(port, () => {
  console.log(`Started at port ${port}`);
});

module.exports = {
  app
}
