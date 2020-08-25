const express = require('express');
const {v4: uuid} = require('uuid');
const xss = require('xss');
const NoteService = require('./notes-service');

const notesRouter = express.Router();
const parseBody = express.json();

const serializeNote = note => ({
  id: note.id,
  note_name: xss(note.note_name),
  content: xss(note.content),
  modified: note.modified,
  folder_id: note.folder_id
});

notesRouter
  .route('/notes')
  .get((req, res, next) => {
    NoteService.getAllNotes(req.app.get('db'))
      .then(notes => {
        res.json(notes.map(serializeNote));
      })
      .catch(next);
  });

module.exports = notesRouter;