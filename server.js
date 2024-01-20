// Import npm dependencies 
const express = require('express');
const path = require('path');
const fs = require('fs');

// Instantiate Express app and PORT to listen to 
const app = express();
const PORT = process.env.PORT || 3001;

// Require Routes
require('./routes/routes')(app);

// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing urlencoded data 
app.use(express.urlencoded({ extended: true }));

// // Add a static middleware for serving assets in the public folder
app.use(express.static('public'));

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}!`)
);
