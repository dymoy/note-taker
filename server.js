// Import npm dependencies 
const express = require('express');
const path = require('path');

// Instantiate Express app and PORT to listen to 
const app = express();
const PORT = process.env.PORT || 3001;

// Require Routes
require('./routes/routes')(app);

// Add a static middleware for serving assets in the public folder
app.use(express.static('public'));

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}!`)
);
