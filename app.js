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
const port = process.env.PORT || 8080;
const mainDir = path.join(__dirname, "/public");

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// getting HTML Routes
// ===================================================
// displays the index page
app.get("*", (req, res) => {
    res.sendFile(path.join(mainDir, "index.html"));
});

// displays the notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(mainDir, "notes.html"));
});