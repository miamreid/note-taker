const express = require('express');

const path = require('path');

const app = express();

const PORT = process.env.PORT || 3001;
const fs = require('fs');

const notesBody = require('./db/db.json');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api/notes', (req, res) => {
    res.json(notesBody.slice(1));
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public.index.html'));
});

function newNote(body, notes) {
    const note = body;
    if(!Array.isArray(notes))
    notes = [];

    if (notes.length === 0)
    notes.push(0);

    body.id = notes[0];
    notes[0]++;

    notes.push(note);
    fs.writeFileSync(
        path.join(__dirname, '/db/db.json'),
        JSON.stringify(notes, null, 2)
    );
    return note;
}

app.post('/api/notes', (req, res) => {
    const note = newNote(req.body, notesBody);
    res.json(note);
});

function deleteNotes(id, notes) {
    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];

        if (note.id == id) {
            notes.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notes, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNotes(req.params.id, notesBody);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`Successfully connected to port ${PORT}. Woohoo!`);
});