const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String },
  genre: { type: String },
  description: { type: String },
  image: { type: String },
  availableCopies: { type: Number, default: 1 },
  totalCopies: { type: Number, default: 1 },
  publishedYear: { type: Number },
  publisher: { type: String },
  language: { type: String, default: 'English' },
  status: { type: String, enum: ['Available', 'Issued', 'Reserved', 'Maintenance'], default: 'Available' },
  issuedTo: [{ 
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    issueDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    isReturned: { type: Boolean, default: false }
  }],
  rating: { type: Number, default: 0 },
  reviews: [{ 
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
