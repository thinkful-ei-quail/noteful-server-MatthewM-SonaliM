const express = require('express');
const {v4: uuid} = require('uuid');
const xss = require('xss');
const NoteService = require('./notes-service');
const path = require('path');

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
  })
  .post(parseBody, (req, res, next) => {
    const { note_name, content, folder_id } = req.body;
    const newNote = { note_name, content, folder_id};
    for (const [key, value] of Object.entries(newNote))
      if (value == null)
        return res.status(400).json({
          error: {message: `Missing '${key}' in request body`}
        });
    
    NoteService.createNote(req.app.get('db'), newNote)
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNote(note));
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
        res.json(serializeNote(res.note));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const noteId = req.params.noteid;


    NoteService.deleteNote(req.app.get('db'), noteId)
      .then(numRowsAffected => {
        if(!numRowsAffected){
          res.status(404).send({ error: { message: 'Note does not exist' }});
        }
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;