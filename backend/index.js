const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

var app = express();
app.use(express.json()); // to handle JSON-encoded request bodies for POST requests, with the appropriate header "Content-type: application/json".
app.use(cors()); // the backend should accept requests cross-origin requests
var port = 2000;

mongoose.connect('mongodb://127.0.0.1:27017/ava_challenge', {
  'useNewUrlParser': true,
  'useUnifiedTopology': true
});

routes(app);

app.listen(port, () => {
  console.log('App is running');
});

app.get('/', (req, res) => {
  res.send('Hello world');
});
