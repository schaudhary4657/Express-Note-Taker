// setting dependencies 
// ===================================================
// express to interact with the front end
const express = require("express");
// path for filename paths
const path = require("path");
// fs to read and write to files
const fs = require("fs");

// setting up the express app
const app = express();
const port = 8080;
const mainDir = path.join(__dirname, "/public");

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// getting HTML Routes
// ===================================================
// displays the notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(mainDir, "notes.html"));
});

// getting API Routes
// ===================================================
// api call response for all the notes
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

// read the file where the notes are stored, create array to save the notes, and displays the api route
app.get("/api/notes/:id", (req, res) => {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

// displays the index page if no matching route is found
app.get("*", (req, res) => {
    res.sendFile(path.join(mainDir, "index.html"));
});

// creating new note
// ===================================================
app.post("/api/notes", (req, res) => {
    // reads db.json file and converts the note strings into an object
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    // creates new note object
    let newNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    // writes to the db.json file
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(savedNotes);
});

// deletes the note by the id in the db.json file
app.delete("/api/notes/:id", (req, res) => {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    });
    
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
});

// starts the server on the port
app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
});