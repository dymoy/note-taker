// Require path and fs packages 
const express = require('express');
const path = require('path');
const fs = require('fs');
const generateUniqueId = require('generate-unique-id');

module.exports = app => {
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
                res.json(notes);
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
                noteId: generateUniqueId({
                    length: 5,
                    useLetters: false,
                }),
            };

            // Add the new note to the db.json file 
            fs.readFile('db/db.json', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    // Successfully read file 
                    const parsedNotes = JSON.parse(data);
                    parsedNotes.push(newNote);
                    
                    // Write the new JSON object into db.json
                    fs.writeFile(
                        './db/db.json',
                        JSON.stringify(parsedNotes, '\t'),
                        (writeErr) => {
                          writeErr
                            ? console.log(writeErr)
                            : console.info('Successfully updated notes DB!');
                        }
                      );
                }
            });

            // Return the new note to the client 
            res.status(201).json(newNote);
        } else { 
            res.status(400).json('Request body must contain a body title and text.');
        }
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
