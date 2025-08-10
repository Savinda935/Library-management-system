import React, { useState } from 'react';
import { 
  BookOpen, 
  Star
} from 'lucide-react';
import './Homepage.css';

const LibraryHomePage = () => {

  const featuredBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: "Free",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      rating: 4.5,
      category: "Classic Literature"
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: "Free",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      rating: 4.8,
      category: "Fiction"
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      price: "Free",
      image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=600&fit=crop",
      rating: 4.7,
      category: "Dystopian"
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: "Free",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      rating: 4.6,
      category: "Romance"
    },
    {
      id: 5,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      price: "Free",
      image: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=400&h=600&fit=crop",
      rating: 4.3,
      category: "Coming of Age"
    },
    {
      id: 6,
      title: "Harry Potter",
      author: "J.K. Rowling",
      price: "Free",
      image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
      rating: 4.9,
      category: "Fantasy"
    }
  ];

  const newArrivals = [
    {
      id: 7,
      title: "Atomic Habits",
      author: "James Clear",
      price: "Free",
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
      rating: 4.8,
      category: "Self Help"
    },
    {
      id: 8,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      price: "Free",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      rating: 4.5,
      category: "Thriller"
    },
    {
      id: 9,
      title: "Educated",
      author: "Tara Westover",
      price: "Free",
      image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=600&fit=crop",
      rating: 4.7,
      category: "Memoir"
    }
  ];

  const partners = [
    "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=80&fit=crop",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=80&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&h=80&fit=crop",
    "https://images.unsplash.com/photo-1560472355-536de3962603?w=150&h=80&fit=crop",
    "https://images.unsplash.com/photo-1560472354-aaf86ad6bbac?w=150&h=80&fit=crop",
    "https://images.unsplash.com/photo-1560472354-ae1bca0a8051?w=150&h=80&fit=crop"
  ];

  const BookCard = ({ book }) => (
    <div className="book-card">
      <div className="book-img">
        <img src={book.image} alt={book.title} />
      </div>
      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="author">by {book.author}</p>
        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.floor(book.rating) ? 'filled' : 'empty'}
            />
          ))}
          <span className="rating-text">({book.rating})</span>
        </div>
        <div className="category">{book.category}</div>
      </div>
      <div className="book-actions">
        <span className="price">{book.price}</span>
        <button className="borrow-btn">
          <BookOpen size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="library-homepage">

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>
            Your <span>Knowledge</span> <br />
            Is Our <span>Mission</span>
          </h1>
          <p>
            We create an environment where you can explore, learn, and discover 
            new worlds through the power of books
          </p>
          <a href="#books" className="btn">Browse Books</a>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="books-section" id="books">
        <div className="section-header">
          <span className="section-subtitle">Featured Collection</span>
          <h2>Browse Books</h2>
        </div>
        <div className="books-grid">
          {featuredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="new-arrivals" id="new">
        <div className="section-header">
          <span className="section-subtitle">New Collection</span>
          <h2>Latest Additions</h2>
        </div>
        <div className="books-grid">
          {newArrivals.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-image">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop" 
            alt="Library Interior" 
          />
        </div>
        <div className="about-content">
          <span className="section-subtitle">About Us</span>
          <h2>
            Books are an important part <br />
            of your personal growth
          </h2>
          <p>
            We spend a significant portion of our lives seeking knowledge and understanding. 
            Our library is where you can expand your horizons, gain new perspectives, and fuel your curiosity.
          </p>
          <p>
            Investing time in reading is an investment in your future. It's about creating 
            opportunities for learning that will last a lifetime and open doors to new possibilities.
          </p>
          <a href="#books" className="btn">Explore More</a>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section" id="partners">
        <div className="section-header">
          <span className="section-subtitle">Partners</span>
          <h2>Our Publishing Partners</h2>
        </div>
        <div className="partners-grid">
          {partners.map((partner, index) => (
            <div key={index} className="partner-logo">
              <img src={partner} alt={`Partner ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section" id="contact">
        <h2>Subscribe to Our Newsletter</h2>
        <div className="newsletter-form">
          <input 
            type="email" 
            placeholder="Enter your email address"
          />
          <button className="btn">Subscribe</button>
        </div>
      </section>
    </div>
  );
};

export default LibraryHomePage;