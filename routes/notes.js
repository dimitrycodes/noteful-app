'use strict';

const express = require('express');
const xss = require('xss');

const NoteServices = require('../services/notes');

const router = express.Router();
const bodyParser = express.json();

const serializeFolder = (note) => ({
  id: note.id,
  title: xss(note.title),
  content: xss(note.content),
  folderId: note.folderId,
});

router
  .route('/')
  .get((req, res, next) => {
    NoteServices.getAllNotes(req.app.get('db'))
      .then((notes) => {
        res.json(notes.map(serializeFolder));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { title, content, folderId } = req.body;

    const newNote = { title, content, folderId: parseInt(folderId) };

    if (!title) {
      const err = new Error('Missing `title` in request body');
      err.status = 400;
      return next(err);
    }

    NoteServices.insertNote(req.app.get('db'), newNote)
      .then((note) => {
        res
          .status(201)
          .location(`${req.originalUrl}/${note.id}`)
          .json(serializeFolder(note));
      })
      .catch((err) => {
        if (err === 'InvalidFolder') {
          err = new Error('The folder is not valid');
          err.status = 400;
        }
        next(err);
      });
  });

router.route('/:id').delete((req, res, next) => {
  const { id } = req.params;
  NoteServices.deleteNote(req.app.get('db'), id)
    .then((numRowsAffected) => {
      logger.info(`Folder with id ${bookmark_id} deleted.`);
      res.status(204).end();
    })
    .catch(next);
});

module.exports = router;
