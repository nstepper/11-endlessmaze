const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Read notes from the db.json file
function getNotes() {
  const notesData = fs.readFileSync('./db/db.json', 'utf8');
  return JSON.parse(notesData);
}

// Write notes to the db.json file
function writeNotes(notes) {
  fs.writeFileSync('./db/db.json', JSON.stringify(notes), 'utf8');
}

// GET /api/notes - Get all notes
app.get('/api/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

// POST /api/notes - Create a new note
app.post('/api/notes', (req, res) => {
  const notes = getNotes();
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };
  notes.push(newNote);
  writeNotes(notes);
  res.json(newNote);
});

// DELETE /api/notes/:id - Delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const notes = getNotes();
  const noteId = req.params.id;
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  writeNotes(updatedNotes);
  res.json({ success: true });
});

// GET /notes - Return the notes.html file
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// GET * - Return the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
