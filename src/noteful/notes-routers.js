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

notesRouter
  .route('/notes/:noteid')
  .get((req, res, next) => {
    const { noteid } = req.params;
    NoteService.getNoteById(req.app.get('db'), noteid)
      .then(note => {
        if (!note) {
          return res.status(404).json({error: {message: 'Note does not exist'}});
        }
        res.note = note;
        next();
      });
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note));
  });

module.exports = notesRouter;