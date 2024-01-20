// Require path and fs packages 
const path = require('path');
const fs = require('fs');

module.exports = app => {
    // Get all the saved notes from db.json and return the data as JSON
    app.get('/api/notes', (req, res) => {
        fs.readFile('db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                // Successfully read file 
                var notes = JSON.parse(data);
                console.log(notes);

                // return all the saved notes as JSON
                res.json(notes);
            }
        });
    });
    
    app.post('/api/notes', (req, res) => {
        // TODO: should recieve a new note to save on the request body, add it to the db.json file, and return the new note to the client.
        // TODO: You will need to give each note a unique ID when it's saved (look into npm packages that could do this for you)
    })

    // GET /notes should return the notes.html file
    app.get('/notes', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/notes.html'));
    });

    // GET * should return the index.html file
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
}
