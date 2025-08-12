import React, { useState, useEffect } from 'react';
import { Search, Book, Users, BookOpen, TrendingUp, Plus, Filter, User, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import './dashboard.css';
import AddBookModal from '../components/AddBookModal';

const LibraryManagementDashboard = () => {
  const [selectedSidebar, setSelectedSidebar] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGenre, setFilterGenre] = useState('');

  const sidebarItems = [
    { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
    { id: 'books', icon: Book, label: 'Books' },
    { id: 'members', icon: Users, label: 'Members' },
    { id: 'issued', icon: BookOpen, label: 'Issued Books' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' }
  ];

  const members = [
    { id: 1, name: 'John Smith', email: 'john@email.com', books: 3, joinDate: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', books: 1, joinDate: '2024-02-20' },
    { id: 3, name: 'Mike Wilson', email: 'mike@email.com', books: 2, joinDate: '2024-01-08' }
  ];

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/books');
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        console.error('Failed to fetch books');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Calculate stats from books data
  const stats = [
    {
      title: 'Total Books',
      value: books.length.toString(),
      change: '+12%',
      color: 'positive'
    },
    {
      title: 'Active Members',
      value: '1,234',
      change: '+8%',
      color: 'positive'
    },
    {
      title: 'Books Issued',
      value: books.filter(book => book.status === 'Issued').length.toString(),
      change: '+15%',
      color: 'warning'
    },
    {
      title: 'Overdue Books',
      value: '23',
      change: '-5%',
      color: 'negative'
    }
  ];

  // Filter books based on search and genre
  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.bookId && book.bookId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGenre = !filterGenre || book.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  // Get issued books
  const issuedBooks = books.filter(book => book.status === 'Issued');

  const SidebarItem = ({ item, isSelected, onClick }) => (
    <div
      className={`sidebar-item ${isSelected ? 'active' : ''}`}
      onClick={() => onClick(item.id)}
    >
      <item.icon className="sidebar-item-icon" />
      <span className="sidebar-item-text">{item.label}</span>
    </div>
  );

  const StatCard = ({ stat }) => (
    <div className="stat-card">
      <div className="stat-header">
        <div>
          <p className="stat-title">{stat.title}</p>
          <p className="stat-value">{stat.value}</p>
        </div>
        <span className={`stat-change ${stat.color}`}>{stat.change}</span>
      </div>
    </div>
  );

  const BookCard = ({ book, showActions = true }) => (
    <div className="book-card">
      <div className="book-header">
        <div className="book-info">
          <img
            src={book.image || 'https://via.placeholder.com/100x150?text=No+Image'}
            alt={book.title}
            className="book-cover"
          />
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">{book.author}</p>
          {book.bookId && <p className="book-id">ID: {book.bookId}</p>}
        </div>
        {showActions && (
          <div className="book-actions">
            <button className="action-btn" title="View Details">
              <Eye size={16} />
            </button>
            <button className="action-btn" title="Edit Book">
              <Edit size={16} />
            </button>
            <button className="action-btn" title="Delete Book">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      <div className="book-footer">
        <span className="book-genre">{book.genre || 'N/A'}</span>
        <div className="book-meta">
          <div className="book-copies">
            <span className="copies-text">
              {book.availableCopies}/{book.totalCopies} available
            </span>
          </div>
          <span
            className={`book-status ${
              book.status === 'Available'
                ? 'status-available'
                : book.status === 'Issued'
                ? 'status-issued'
                : book.status === 'Reserved'
                ? 'status-reserved'
                : 'status-maintenance'
            }`}
          >
            {book.status}
          </span>
        </div>
      </div>
    </div>
  );

  const MemberRow = ({ member }) => (
    <div className="member-card">
      <div className="member-info">
        <div className="member-avatar">
          <User className="avatar-icon" />
        </div>
        <div className="member-details">
          <h4>{member.name}</h4>
          <p className="member-email">{member.email}</p>
        </div>
      </div>
      <div className="member-stats">
        <div className="member-books">
          <span className="member-books-count">{member.books}</span>
          <span className="member-books-label">Books</span>
        </div>
        <div className="member-join-date">
          <Calendar className="calendar-icon" />
          {member.joinDate}
        </div>
      </div>
    </div>
  );

  const handleBookAdded = (newBook) => {
    setBooks(prevBooks => [newBook, ...prevBooks]);
  };

  const handleAddBookClick = () => {
    setIsAddBookModalOpen(true);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <h1 className="sidebar-title">LibraryOS</h1>
          <p className="sidebar-subtitle">Management System</p>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isSelected={selectedSidebar === item.id}
              onClick={setSelectedSidebar}
            />
          ))}
        </nav>

        {/* Premium Section */}
        <div className="sidebar-premium">
          <div className="premium-card">
            <h3 className="premium-title">Premium Features</h3>
            <p className="premium-description">Advanced analytics and reporting</p>
            <button className="premium-button">Upgrade Now</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="header-content">
            <div className="header-info">
              <h2>{selectedSidebar === 'dashboard' ? 'Dashboard Overview' : selectedSidebar}</h2>
              <p>Welcome back! Here's what's happening in your library.</p>
            </div>
            <div className="header-actions">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search books, members..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="add-button" onClick={handleAddBookClick}>
                <Plus className="w-4 h-4" />
                <span>Add Book</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {selectedSidebar === 'dashboard' && (
          <main className="dashboard-main">
            {/* Stats Grid */}
            <div className="stats-grid">{stats.map((stat, index) => <StatCard key={index} stat={stat} />)}</div>

            <div className="content-grid">
              {/* Recent Books */}
              <div>
                <div className="section-header">
                  <h3 className="section-title">Recent Books</h3>
                  <a href="#" className="view-all-link">View All</a>
                </div>
                <div className="books-grid">{books.slice(0, 4).map((book) => <BookCard key={book._id} book={book} />)}</div>
              </div>

              {/* Active Members */}
              <div>
                <div className="section-header">
                  <h3 className="section-title">Active Members</h3>
                  <a href="#" className="view-all-link">View All</a>
                </div>
                <div className="members-list">{members.map((member) => <MemberRow key={member.id} member={member} />)}</div>
              </div>
            </div>
          </main>
        )}

        {/* Books Section */}
        {selectedSidebar === 'books' && (
          <main className="dashboard-main">
            <div className="filter-controls">
              <select
                className="filter-select"
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
              >
                <option value="">All Genres</option>
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
              <button className="filter-button">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading books...</p>
              </div>
            ) : (
              <div className="books-grid">
                {filteredBooks.map((book) => (
                  <BookCard key={book._id} book={book} showActions={true} />
                ))}
              </div>
            )}
          </main>
        )}

        {/* Issued Books Section */}
        {selectedSidebar === 'issued' && (
          <main className="dashboard-main">
            <div className="section-header">
              <h3 className="section-title">Issued Books</h3>
              <span className="issued-count">{issuedBooks.length} books currently issued</span>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading issued books...</p>
              </div>
            ) : issuedBooks.length > 0 ? (
              <div className="books-grid">
                {issuedBooks.map((book) => (
                  <BookCard key={book._id} book={book} showActions={true} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon-container">
                  <BookOpen className="empty-icon" />
                </div>
                <h3 className="empty-title">No Issued Books</h3>
                <p className="empty-description">All books are currently available in the library.</p>
              </div>
            )}
          </main>
        )}

        {/* Members Section */}
        {selectedSidebar === 'members' && (
          <main className="dashboard-main">
            <div className="members-list">
              {members.concat(members, members).map((member, index) => (
                <MemberRow key={`${member.id}-${index}`} member={member} />
              ))}
            </div>
          </main>
        )}

        {/* Analytics Section */}
        {selectedSidebar === 'analytics' && (
          <main className="dashboard-main">
            <div className="empty-state">
              <div className="empty-icon-container">
                <TrendingUp className="empty-icon" />
              </div>
              <h3 className="empty-title">Analytics Dashboard</h3>
              <p className="empty-description">Advanced analytics and reporting features coming soon.</p>
            </div>
          </main>
        )}
      </div>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        onBookAdded={handleBookAdded}
      />
    </div>
  );
};

export default LibraryManagementDashboard;
