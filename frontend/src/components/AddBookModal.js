import React, { useState } from 'react';
import { X, Plus, Upload } from 'lucide-react';
import './AddBookModal.css';

const AddBookModal = ({ isOpen, onClose, onBookAdded }) => {
  const [formData, setFormData] = useState({
    bookId: '',
    title: '',
    author: '',
    isbn: '',
    genre: '',
    description: '',
    image: '',
    availableCopies: 1,
    totalCopies: 1,
    publishedYear: '',
    publisher: '',
    language: 'English'
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newBook = await response.json();
        onBookAdded(newBook);
        onClose();
        setFormData({
          bookId: '',
          title: '',
          author: '',
          isbn: '',
          genre: '',
          description: '',
          image: '',
          availableCopies: 1,
          totalCopies: 1,
          publishedYear: '',
          publisher: '',
          language: 'English'
        });
      } else {
        const error = await response.json();
        alert('Error adding book: ' + error.message);
      }
    } catch (error) {
      alert('Error adding book: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Add New Book</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="bookId">Book ID *</label>
              <input
                type="text"
                id="bookId"
                name="bookId"
                value={formData.bookId}
                onChange={handleInputChange}
                required
                placeholder="Enter unique book ID"
              />
            </div>

            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter book title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="author">Author *</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                placeholder="Enter author name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                placeholder="Enter ISBN"
              />
            </div>

            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
              >
                <option value="">Select Genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Thriller">Thriller</option>
                <option value="Biography">Biography</option>
                <option value="History">History</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Children">Children</option>
                <option value="Poetry">Poetry</option>
                <option value="Drama">Drama</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="publisher">Publisher</label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                placeholder="Enter publisher"
              />
            </div>

            <div className="form-group">
              <label htmlFor="publishedYear">Published Year</label>
              <input
                type="number"
                id="publishedYear"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleInputChange}
                placeholder="Enter published year"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Arabic">Arabic</option>
                <option value="Hindi">Hindi</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="totalCopies">Total Copies *</label>
              <input
                type="number"
                id="totalCopies"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="Enter total copies"
              />
            </div>

            <div className="form-group">
              <label htmlFor="availableCopies">Available Copies *</label>
              <input
                type="number"
                id="availableCopies"
                name="availableCopies"
                value={formData.availableCopies}
                onChange={handleInputChange}
                required
                min="0"
                max={formData.totalCopies}
                placeholder="Enter available copies"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="image">Book Cover Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="Enter image URL"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter book description"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal; 