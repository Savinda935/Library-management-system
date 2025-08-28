const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const protect = require('../middleware/authMiddleware');

// 📌 Add a new book
router.post('/', async (req, res) => {
    try {
        const { bookId, title, author, availableCopies, image } = req.body;

        const newBook = new Book({ bookId, title, author, availableCopies, image });
        await newBook.save();

        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 📌 Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Get book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Update book
router.put('/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 📌 Delete book
router.delete('/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 📌 Borrow a book (student)
router.post('/:id/borrow', protect, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        if (book.status === 'Issued' || book.availableCopies <= 0) {
            return res.status(400).json({ message: 'Book not available' });
        }

        book.issuedTo.push({ memberId: req.student._id, issueDate: new Date(), isReturned: false });
        book.availableCopies = Math.max(0, (book.availableCopies || 1) - 1);
        if (book.availableCopies === 0) book.status = 'Issued';

        const updated = await book.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
