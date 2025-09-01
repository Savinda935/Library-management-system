import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [user] = useState({ name: "John Doe", id: "M001", email: "john@email.com" }); // Mock user
  const isLoggedIn = !!localStorage.getItem('token');

  // Fetch books from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setLoading(false);
      });
  }, []);

  // Get unique categories from books
  const categories = [...new Set(books.map(book => book.category || book.genre).filter(Boolean))];

  // Filtered books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter
      ? book.category === categoryFilter || book.genre === categoryFilter
      : true;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const availableBooks = books.filter(book => book.status === "Available" || !book.status).length;
  const totalBorrowed = borrowedBooks.length;

  const handleBorrowBook = (book) => {
    setSelectedBook(book);
    setShowBorrowModal(true);
  };

  const confirmBorrow = async () => {
    if (!selectedBook) return;
    try {
      const { data } = await api.post(`/books/${selectedBook._id}/borrow`);
      setBorrowedBooks(prev => [...prev, {
        ...selectedBook,
        borrowDate: new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()
      }]);
      // Refresh book list to reflect availability changes
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (e) {
      console.error('Borrow error:', e?.response?.status, e?.response?.data || e.message);
      if (e?.response?.status === 401) {
        alert('Please login to borrow books. Redirecting to login...');
        window.location.href = '/login';
      } else {
        alert(e?.response?.data?.message || 'Borrow failed. Please try again.');
      }
    } finally {
      setShowBorrowModal(false);
      setSelectedBook(null);
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      await api.post(`/books/${bookId}/return`);
      
      // Remove the book from borrowed list
      setBorrowedBooks(prev => prev.filter(book => book._id !== bookId));
      
      // Refresh book list to reflect availability changes
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
      
      alert('Book returned successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to return book');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ fontSize: '18px', margin: 0 }}>Loading library books...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
     
      {/* Quick Stats */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>{books.length}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Books</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(67, 233, 123, 0.3)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>{availableBooks}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Available Now</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(250, 112, 154, 0.3)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>{categories.length}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Categories</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: '#333',
            padding: '25px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(168, 237, 234, 0.3)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '5px' }}>{totalBorrowed}</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>My Borrowed Books</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Browse Books</h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
              <svg style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#999'
              }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '15px 15px 15px 45px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '15px 20px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '180px'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
            Showing {filteredBooks.length} of {books.length} books
          </div>
        </div>

        {/* Book Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '25px'
        }}>
          {filteredBooks.map((book) => (
            <div
              key={book._id}
              style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid #f1f5f9'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}
            >
              {/* Book Cover */}
              <div style={{
                position: 'relative',
                height: '220px',
                backgroundImage: `url(${book.image || "https://via.placeholder.com/320x220?text=No+Image"})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)'
                }}></div>
                
                {/* Availability Badge */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: book.status === "Available" || !book.status ? '#10b981' : '#ef4444',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {book.status === "Available" || !book.status ? 'Available' : 'Checked Out'}
                </div>
              </div>

              {/* Book Info */}
              <div style={{ padding: '25px' }}>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  color: '#1a202c',
                  marginBottom: '8px',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {book.title}
                </h3>

                {book.author && (
                  <p style={{
                    color: '#718096',
                    marginBottom: '15px',
                    fontSize: '16px',
                    fontStyle: 'italic'
                  }}>
                    by {book.author}
                  </p>
                )}

                {(book.category || book.genre) && (
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{
                      padding: '6px 16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      borderRadius: '20px',
                      display: 'inline-block'
                    }}>
                      {book.category || book.genre}
                    </span>
                  </div>
                )}

                {book.description && (
                  <p style={{
                    color: '#718096',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {book.description}
                  </p>
                )}

                {/* Borrow Button */}
                <button
                  onClick={() => isLoggedIn ? handleBorrowBook(book) : window.location.href = '/login'}
                  disabled={book.status === "Issued" || borrowedBooks.some(b => b._id === book._id)}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: book.status === "Issued" || borrowedBooks.some(b => b._id === book._id) 
                      ? '#e2e8f0' 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: book.status === "Issued" || borrowedBooks.some(b => b._id === book._id) ? '#a0aec0' : 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: book.status === "Issued" || borrowedBooks.some(b => b._id === book._id) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (book.status !== "Issued" && !borrowedBooks.some(b => b._id === book._id)) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {borrowedBooks.some(b => b._id === book._id) ? (
                    <button
                      onClick={() => handleReturnBook(book._id)}
                      style={{
                        width: '100%',
                        padding: '12px 20px',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#b91c1c';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 20px rgba(220, 38, 38, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#dc2626';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      Return Book
                    </button>
                  ) : book.status === "Issued" ? (
                    "Not Available"
                  ) : (
                    <>
                      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {isLoggedIn ? 'Borrow Book' : 'Login to Borrow'}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Borrow Confirmation Modal */}
      {showBorrowModal && selectedBook && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
              Confirm Book Borrowing
            </h3>
            
            <div style={{ marginBottom: '25px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '10px' }}>
                {selectedBook.title}
              </h4>
              <p style={{ color: '#666', marginBottom: '10px' }}>by {selectedBook.author}</p>
              <p style={{ color: '#666', fontSize: '14px' }}>
                <strong>Due Date:</strong> {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setShowBorrowModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: '#e2e8f0',
                  color: '#4a5568',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmBorrow}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Confirm Borrow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}