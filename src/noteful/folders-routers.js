const express = require('express');
const {v4: uuid} = require('uuid');
const xss = require('xss');
const FolderService = require('./folders-service');
const { restart } = require('nodemon');

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
        res.json(folders.map(serializeFolder));
      })
      .catch(next);
  })
  .post(parseBody, (req, res, next) => {
    const { folder_name } = req.body;
    const newFolder = { folder_name };

    FolderService.createNewFolder(req.app.get('db'), folder_name);
  });


foldersRouter
  .route('/folders/:folder_id')
  .get((req, res, next) => {
    const folderId = req.params.folder_id;
    FolderService.getFolderById(req.app.get('db'), folderId)
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: 'Folder does not exist' }
          });
        }
        res.json(serializeFolder(folder));
      })
      .catch(next);
  });

module.exports = foldersRouter;