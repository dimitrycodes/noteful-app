'use strict';

const express = require('express');
const xss = require('xss');

const NoteServices = require('../services/notes');

const router = express.Router();
const bodyParser = express.json();

const serializeNote = (note) => ({
  id: note.id,
  title: xss(note.title),
  content: xss(note.content),
  folderId: note.folderid,
});

router
  .route('/')
  .get((req, res, next) => {
    NoteServices.getAllNotes(req.app.get('db'))
      .then((notes) => {
        res.json(notes.map(serializeNote));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { title, content, folderId } = req.body;

    const newNote = { title, content, folderid: folderId };

    if (!title) {
      return res.status(400).send('Missing `title` in request body');
    }

    NoteServices.insertNote(req.app.get('db'), newNote)
      .then((note) => {
        res
          .status(201)
          .location(`${req.originalUrl}/${note.id}`)
          .json(serializeNote(note));
      })
      .catch(next);
  });

router
  .route('/:id')
  .delete((req, res, next) => {
    const { id } = req.params;
    NoteServices.deleteNote(req.app.get('db'), id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const { id } = req.params;
    NoteServices.getById(req.app.get('db'), id)
      .then((note) => {
        if (note) {
          res.json(serializeNote(note));
        } else {
          next();
        }
      })
      .catch(next);
  });

module.exports = router;
