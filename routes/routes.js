// Require npm package dependencies 
const express = require('express');
const path = require('path');
const fs = require('fs');
const generateUniqueId = require('generate-unique-id');

module.exports = app => {
    // Static middleware for serving assets in the public folder
    app.use(express.static('public'));

    // Middleware for parsing application/json and urlencoded data
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Get all the saved notes from db.json and return the data as JSON
    app.get('/api/notes', (req, res) => {
        console.info(`${req.method} request received to /api/notes endpoint.`);

        fs.readFile('db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                // Successfully read file 
                var notes = JSON.parse(data);

                // Return all the saved notes as JSON
                res.status(201).json(notes);
            }
        });
    });
    
    // Receives a new note to add to db.json file and return the new note to the client.
    app.post('/api/notes', (req, res) => {
        console.info(`${req.method} request received to /api/notes endpoint.`);

        // Destructuring assignment for the items in req.body
        const {title, text} = req.body;

        // Verify title and text is not empty 
        if (title && text) {
            // Create newNote object with req.body values and a new unique ID
            const newNote = {
                title: title,
                text: text,
                id: generateUniqueId({
                    length: 4
                })
            };

            // Add the new note to the db.json file 
            fs.readFile('db/db.json', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    // Successfully read file 
                    const parsedNotes = JSON.parse(data);
                    parsedNotes.push(newNote);
                    
                    // Update the db.json file with updated parseNotes
                    writeToFile(parsedNotes);

                    console.info(`Successfully saved new note titled ${newNote.title}`);
                }
            });

            // Return the new note to the client 
            res.status(201).json(newNote);
        } else { 
            res.status(400).json('Request body must contain a body title and text.');
        }
    })

    // DELETE /api/notes/:id allows users to delete notes
    
    app.delete('/api/notes/:id', (req, res) => {
        const reqId = req.params.id;
        console.info(`${req.method} request received to /api/notes/:id endpoint. Deleting he note with id '${reqId}'...`);

        // Obtain the existing notes
        fs.readFile('db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                // Parse the data as a JSON object after successfully reading the file
                const parsedNotes = JSON.parse(data);
                
                // Filter out the note with the requested id
                const filteredNotes = parsedNotes.filter((note) => {
                    if (note.id !== reqId) {
                        return note;
                    }
                });

                // Update the db.json file with the modified notes object
                writeToFile(filteredNotes);
            }
        });
    });

    // GET /notes should return the notes.html file
    app.get('/notes', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/notes.html'));
    });

    // GET * should return the index.html file
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    /**
     * writeToFile() function will update the 'db/db.json' file with the given parsedNotes parameter
     * @param {*} parsedNotes 
     */
    function writeToFile(parsedNotes) {
        const fileName = 'db/db.json';

        // Write the new JSON object into db.json
        fs.writeFile(
            fileName,
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) => {
              writeErr
                ? console.log(writeErr)
                : console.info(`Successfully updated notes DB in ${fileName}!`);
            }
          );
    }
}
