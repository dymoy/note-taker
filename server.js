// Import npm dependencies 
const express = require('express');

// Instantiate Express app and PORT to listen to 
const app = express();
const PORT = process.env.PORT || 3001;

// Require Routes
require('./routes/routes')(app);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}!`)
);
