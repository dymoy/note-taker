// Require path and fs packages 
const path = require('path');
const fs = require('fs');

module.exports = app => {
    // Require the JSON file and assign it to a variable called `dbData`
    const dbData = require('../db/db.json');
    
    app.get('/api/notes', (req, res) => {
        // TODO: should read the db.json file and return all saved notes as JSON
        fs.readFile(dbData, 'utf8', (err, data) => {
            console.log('entered');
            if (err) {
                console.log(err);
            } else {
                res.json(data);
            }
        });
    });
    
    app.post('/api/notes', (req, res) => {
        // TODO: should recieve a new note to save on the request body, add it to the db.json file, and return the new note to the client.
        // TODO: You will need to give each note a unique ID when it's saved (look into npm packages that could do this for you)
    })

    // GET /notes should return the notes.html file
    app.get('/notes', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // GET * should return the index.html file
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
}
