const express = require('express');

const { auth } = require('./routes/user');
const { tags } = require('./routes/Tags');
const { door } = require('./routes/door');


const app = express();

app.use('/auth', auth);
app.use('/tags', tags);
app.use('/door', door);

app.get('/', (req, res) => {
  res.status(200).json({msg: 'Server online'});
});

module.exports = app;