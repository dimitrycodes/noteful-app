'use strict';

const express = require('express');
const xss = require('xss');

const FolderServices = require('../services/folder');

const router = express.Router();
const bodyParser = express.json();

const serializeFolder = (folder) => ({
  id: folder.id,
  name: xss(folder.name),
});

router
  .route('/')
  .get((req, res, next) => {
    FolderServices.getAllFolders(req.app.get('db'))
      .then((folders) => {
        res.json(folders.map(serializeFolder));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { name } = req.body;

    const newFolder = { name };

    if (!name) {
      return res.status(400).send(`folder name is required`);
    }

    FolderServices.insertFolder(req.app.get('db'), newFolder)
      .then((folder) => {
        res
          .status(201)
          .location(`${req.originalUrl}/${folder.id}`)
          .json(serializeFolder(folder));
      })
      .catch((err) => {
        if (err.code === 11000) {
          err = new Error('Folder name already exists');
          err.status = 400;
        }
        next(err);
      });
  });

router.route('/:id').delete((req, res, next) => {
  const { id } = req.params;
  FolderServices.deleteFolder(req.app.get('db'), id)
    .then((numRowsAffected) => {
      logger.info(`Folder with id ${bookmark_id} deleted.`);
      res.status(204).end();
    })
    .catch(next);
});

module.exports = router;
