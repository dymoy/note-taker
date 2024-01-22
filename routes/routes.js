/* Required npm package dependencies */
const express = require('express');
const path = require('path');
const fs = require('fs');
const generateUniqueId = require('generate-unique-id');

module.exports = app => {
    /* Add static middleware for serving assets in the public folder */
    app.use(express.static('public'));

    /* Add middleware for parsing application/json and urlencoded data */
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    /**
     * GET route to read the 'db.json' file and return all saved notes as JSON.
     * 
     * @name get/api/notes
     * @param {string} path - Express path
     * @param {callback} middleware - Express middleware
     * @yields {Object} parsedNotes - All the existing notes in JSON format
     */
    app.get('/api/notes', (req, res) => {
        // Log the request to the terminal 
        console.info(`${req.method} request received to /api/notes endpoint.`);

        // Obtain the existing notes 
        fs.readFile('db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                // Parse the data as a JSON object after successfully reading the file
                var parsedNotes = JSON.parse(data);

                // Return all the saved notes as JSON with status code 200 
                res.status(200).json(parsedNotes);
            }
        });
    });
    
    /**
     * POST route will add the new note recieved via the request body to 'db.json' and return the new note to the client.
     * 
     * @name post/api/notes
     * @param {string} path - Express path
     * @param {callback} middleware - Express middleware
     * @yields {Object} newNote - the requested note to save
     * @see writeToFile
     */
    app.post('/api/notes', (req, res) => {
        // Destructuring assignment for the items in req.body
        const {title, text} = req.body;

        // Log the request to the terminal 
        console.info(`${req.method} request received to /api/notes endpoint. Creating a new note with title '${title}'...`);

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

            // Obtain the existing notes
            fs.readFile('db/db.json', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    // Add newNote to the end of the the parsedNotes array 
                    const parsedNotes = JSON.parse(data);
                    parsedNotes.push(newNote);
                    
                    // Update the db.json file with updated parseNotes
                    writeToFile(parsedNotes);
                }
            });

            // Return the new note to the client with status code 201 Created
            const response = {
                status: 'success',
                message: 'Your new note was successfully created!',
                body: newNote,
            };

            res.status(201).json(response);
        } else { 
            // Return a status code 400 Bad Request if request body is empty
            res.status(400).json('Request body must contain a body title and text.');
        }
    });

    /**
     * DELETE route should receive a query parameter that contains the id of a note to delete. 
     * 
     * @name delete/api/notes/:id
     * @param {string} path - Express path
     * @param {callback} middleware - Express middleware
     * @yields {Object} filteredNotes - The existing notes after removing the requested id
     * @see writeToFile
     */
    app.delete('/api/notes/:id', (req, res) => {
        // Store the requested ID to delete 
        const reqId = req.params.id;

        // Log the request to the terminal
        console.info(`${req.method} request received to /api/notes/:id endpoint. Deleting the note with id '${reqId}'...`);

        // Obtain the existing notes
        fs.readFile('db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const parsedNotes = JSON.parse(data);
                
                // Filter out the note with the requested id
                const filteredNotes = parsedNotes.filter((note) => {
                    if (note.id !== reqId) {
                        return note;
                    }
                });

                // Update the db.json file with the modified notes object
                writeToFile(filteredNotes);

                // Send a message to the client 
                const response = {
                    status: 'success',
                    message: `The note with id '${reqId}' was successfully deleted!`,
                    body: filteredNotes
                }

                res.status(200).json(response);
            }
        });
    });

    /* GET route should return the notes.html file to present existing notes */
    app.get('/notes', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/notes.html'));
    });

    /* GET route should return the index.html file to present the landing page */
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    /**
     * @function writeToFile will update the 'db/db.json' file with the given parsedNotes parameter
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
