const express = require('express');
const {v4: uuid} = require('uuid');
const xss = require('xss');
const NoteService = require('./notes-service');

const notesRouter = express.Router();
const parseBody = express.json();

const serializeNote = note => ({
  id: note.id,
  folder_name: xss(note.folder_name),
});

notesRouter
  .route('/notes')
  .get((req, res, next) => {
    NoteService.getAllFolders(req.app.get('db'))
      .then(notes => {
        res.json(notes.map(serializeNote));
      })
      .catch(next);
  });

module.exports = notesRouter;