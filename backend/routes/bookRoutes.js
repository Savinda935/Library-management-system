const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// Add book (Librarian only)
router.post('/', async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
});

// Get all books
router.get('/', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Update book (Librarian only)
router.put('/:id', async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
});

// Delete book
router.delete('/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book deleted' });
});

module.exports = router;
