const express = require('express');
const Student = require('../models/Student');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Get profile
router.get('/me', protect, async (req, res) => {
  res.json(req.student);
});

// Update profile
router.put('/me', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.name = req.body.name || student.name;
    student.contact = req.body.contact || student.contact;
    student.address = req.body.address || student.address;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List borrowed books for current student
router.get('/me/borrowed', protect, async (req, res) => {
  try {
    const Book = require('../models/Book');
    const borrowed = await Book.find({ 'issuedTo.memberId': req.student._id, 'issuedTo.isReturned': false });
    res.json(borrowed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
