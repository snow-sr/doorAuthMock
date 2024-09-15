const express = require('express');

const { auth } = require('./routes/User');
const { tags } = require('./routes/Tags');

const app = express();

app.use('/auth', auth);
app.use('/tags', tags);

app.get('/', (req, res) => {
  res.status(200).json({msg: 'Server online'});
});

module.exports = app;