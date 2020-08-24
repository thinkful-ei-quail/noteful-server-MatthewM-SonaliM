const express = require('express');
const {v4: uuid} = require('uuid');
const xss = require('xss');
const FolderService = require('./folders-service');

const foldersRouter = express.Router();
const parseBody = express.json();

const serializeFolder = folder => ({
  id: folder.id,
  folder_name: xss(folder.folder_name),
});

foldersRouter
  .route('/folders')
  .get((req, res, next) => {
    FolderService.getAllFolders(req.app.get('db'))
      .then(folders => {
        res.json(folders.map({serializeFolder}));
      })
      .catch(next);
  });

module.exports = foldersRouter;