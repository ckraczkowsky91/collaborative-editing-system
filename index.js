const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

var app = express();
const port = process.env.PORT
//const port = 4000;
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use(express.json()); // to handle JSON-encoded request bodies for POST requests, with the appropriate header "Content-type: application/json".
app.use(cors()); // the backend should accept requests cross-origin requests

// Local deploy
// mongoose.connect('mongodb://127.0.0.1:27017/ava_challenge', {
//   'useNewUrlParser': true,
//   'useUnifiedTopology': true
// });

// Heroku deploy
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  }, function (err, res) {
      if (err) {
      console.log (err);
      } else {
      console.log ('Successfully connected to MongoDB!');
      }
    }
  );

routes(app);

app.listen(port, () => {
  console.log('App is running');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
});
