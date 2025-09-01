import React, { useState, useEffect } from 'react';
import { Search, Book, Users, BookOpen, TrendingUp, Plus, Filter, User, Calendar, Eye, Edit, Trash2, FileText, Bell, Download, BarChart3, PieChart } from 'lucide-react';
import './dashboard.css';
import AddBookModal from '../components/AddBookModal';
import api from '../api';

const LibraryManagementDashboard = () => {
  const [selectedSidebar, setSelectedSidebar] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGenre, setFilterGenre] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [reportType, setReportType] = useState('books');
  const [reportDateRange, setReportDateRange] = useState('month');
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);

  const sidebarItems = [
    { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
    { id: 'books', icon: Book, label: 'Books' },
    { id: 'members', icon: Users, label: 'Members' },
    { id: 'issued', icon: BookOpen, label: 'Issued Books' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' }
  ];

  // Mock notifications
  useEffect(() => {
    setNotifications([
      { id: 1, type: 'warning', message: '5 books are overdue', time: '2 hours ago', read: false },
      { id: 2, type: 'info', message: 'New member registration: Sarah Wilson', time: '4 hours ago', read: false },
      { id: 3, type: 'success', message: 'Monthly report generated successfully', time: '1 day ago', read: true },
      { id: 4, type: 'error', message: 'Book "The Great Gatsby" needs maintenance', time: '2 days ago', read: false }
    ]);
  }, []);

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

  // Fetch members (students) from API
  const fetchMembers = async () => {
    try {
      setMembersLoading(true);
      const response = await fetch('http://localhost:5000/api/users');
      if (response.ok) {
        const data = await response.json();
        // Transform student data to include join date and books count
        const transformedMembers = data.map(student => ({
          ...student,
          joinDate: student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'Unknown',
          books: 0 // This will be updated when we implement book borrowing tracking
        }));
        setMembers(transformedMembers);
      } else {
        console.error('Failed to fetch members');
        setMembers([]);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchMembers();
  }, []);

  // Calculate stats from real data
  const stats = [
    {
      title: 'Total Books',
      value: books.length.toString(),
      change: '+12%',
      color: 'positive'
    },
    {
      title: 'Active Members',
      value: members.length.toString(),
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

  // Generate report data
  const generateReport = () => {
    const reportData = {
      books: {
        total: books.length,
        available: books.filter(b => b.status === 'Available').length,
        issued: books.filter(b => b.status === 'Issued').length,
        byGenre: books.reduce((acc, book) => {
          acc[book.genre || 'Unknown'] = (acc[book.genre || 'Unknown'] || 0) + 1;
          return acc;
        }, {})
      },
      members: {
        total: members.length,
        active: members.filter(m => m.books > 0).length
      },
      dateRange: reportDateRange
    };

    // Create downloadable report
    const reportContent = `
Library Management System Report
Generated on: ${new Date().toLocaleDateString()}
Date Range: ${reportDateRange}

BOOKS SUMMARY:
- Total Books: ${reportData.books.total}
- Available: ${reportData.books.available}
- Issued: ${reportData.books.issued}

BOOKS BY GENRE:
${Object.entries(reportData.books.byGenre).map(([genre, count]) => `- ${genre}: ${count}`).join('\n')}

MEMBERS SUMMARY:
- Total Members: ${reportData.members.total}
- Active Members: ${reportData.members.active}

MEMBER DETAILS:
${members.map(member => `- ${member.name} (${member.email}) - Joined: ${member.joinDate}`).join('\n')}

NOTIFICATIONS:
${notifications.filter(n => !n.read).map(n => `- ${n.message}`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `library-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    // Add success notification
    setNotifications(prev => [{
      id: Date.now(),
      type: 'success',
      message: 'Report generated and downloaded successfully',
      time: 'Just now',
      read: false
    }, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
            {book.status === 'Issued' && (
              <button 
                className="action-btn return-btn" 
                title="Return Book"
                onClick={() => handleReturnBook(book._id)}
                style={{ backgroundColor: '#dc2626', color: 'white' }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
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
          <h4>{member.name || 'Unknown Name'}</h4>
          <p className="member-email">{member.email}</p>
          {member.contact && <p className="member-contact">📞 {member.contact}</p>}
          {member.address && <p className="member-address">📍 {member.address}</p>}
        </div>
      </div>
      <div className="member-stats">
        <div className="member-books">
          <span className="member-books-count">{member.books || 0}</span>
          <span className="member-books-label">Books</span>
        </div>
        <div className="member-join-date">
          <Calendar className="calendar-icon" />
          {member.joinDate || 'Unknown'}
        </div>
      </div>
    </div>
  );

  const NotificationItem = ({ notification }) => (
    <div 
      className={`notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`}
      onClick={() => markNotificationAsRead(notification.id)}
    >
      <div className="notification-icon">
        {notification.type === 'success' && '✅'}
        {notification.type === 'warning' && '⚠️'}
        {notification.type === 'error' && '❌'}
        {notification.type === 'info' && 'ℹ️'}
      </div>
      <div className="notification-content">
        <p className="notification-message">{notification.message}</p>
        <span className="notification-time">{notification.time}</span>
      </div>
      {!notification.read && <div className="notification-dot"></div>}
    </div>
  );

  const handleBookAdded = (newBook) => {
    setBooks(prevBooks => [newBook, ...prevBooks]);
  };

  const handleAddBookClick = () => {
    setIsAddBookModalOpen(true);
  };

  const handleReturnBook = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${bookId}/return`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh books list
        fetchBooks();
        
        // Add success notification
        setNotifications(prev => [{
          id: Date.now(),
          type: 'success',
          message: 'Book returned successfully',
          time: 'Just now',
          read: false
        }, ...prev]);
      } else {
        const error = await response.json();
        setNotifications(prev => [{
          id: Date.now(),
          type: 'error',
          message: error.message || 'Failed to return book',
          time: 'Just now',
          read: false
        }, ...prev]);
      }
    } catch (error) {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'error',
        message: 'Failed to return book',
        time: 'Just now',
        read: false
      }, ...prev]);
    }
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
              
              {/* Notifications */}
              <div className="notifications-container">
                <button 
                  className="notification-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="notification-icon" />
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </button>
                
                {showNotifications && (
                  <div className="notifications-dropdown">
                    <div className="notifications-header">
                      <h3>Notifications</h3>
                      <span className="notifications-count">{notifications.length}</span>
                    </div>
                    <div className="notifications-list">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <NotificationItem key={notification.id} notification={notification} />
                        ))
                      ) : (
                        <div className="no-notifications">No notifications</div>
                      )}
                    </div>
                  </div>
                )}
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
                <div className="members-list">
                  {membersLoading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>Loading members...</p>
                    </div>
                  ) : (
                    members.slice(0, 3).map((member) => <MemberRow key={member._id} member={member} />)
                  )}
                </div>
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

        {/* Reports Section */}
        {selectedSidebar === 'reports' && (
          <main className="dashboard-main">
            <div className="section-header">
              <h3 className="section-title">Generate Reports</h3>
              <p>Create comprehensive reports for your library operations</p>
            </div>

            <div className="reports-container">
              <div className="report-options">
                <div className="report-option">
                  <label>Report Type:</label>
                  <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className="report-select"
                  >
                    <option value="books">Books Summary</option>
                    <option value="members">Members Summary</option>
                    <option value="circulation">Circulation Report</option>
                    <option value="comprehensive">Comprehensive Report</option>
                  </select>
                </div>

                <div className="report-option">
                  <label>Date Range:</label>
                  <select 
                    value={reportDateRange} 
                    onChange={(e) => setReportDateRange(e.target.value)}
                    className="report-select"
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              </div>

              <div className="report-preview">
                <h4>Report Preview</h4>
                <div className="preview-stats">
                  <div className="preview-stat">
                    <span className="preview-label">Total Books:</span>
                    <span className="preview-value">{books.length}</span>
                  </div>
                  <div className="preview-stat">
                    <span className="preview-label">Available:</span>
                    <span className="preview-value">{books.filter(b => b.status === 'Available').length}</span>
                  </div>
                  <div className="preview-stat">
                    <span className="preview-label">Issued:</span>
                    <span className="preview-value">{books.filter(b => b.status === 'Issued').length}</span>
                  </div>
                  <div className="preview-stat">
                    <span className="preview-label">Members:</span>
                    <span className="preview-value">{members.length}</span>
                  </div>
                </div>
              </div>

              <div className="report-actions">
                <button className="generate-report-btn" onClick={generateReport}>
                  <FileText className="w-4 h-4" />
                  <span>Generate Report</span>
                </button>
                <button className="export-btn">
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </button>
              </div>
            </div>
          </main>
        )}

        {/* Members Section */}
        {selectedSidebar === 'members' && (
          <main className="dashboard-main">
            <div className="section-header">
              <h3 className="section-title">Library Members</h3>
              <span className="members-count">{members.length} registered members</span>
            </div>
            
            {membersLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading members...</p>
              </div>
            ) : members.length > 0 ? (
              <div className="members-list">
                {members.map((member) => (
                  <MemberRow key={member._id} member={member} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon-container">
                  <Users className="empty-icon" />
                </div>
                <h3 className="empty-title">No Members Found</h3>
                <p className="empty-description">No students have registered yet.</p>
              </div>
            )}
          </main>
        )}

        {/* Analytics Section */}
        {selectedSidebar === 'analytics' && (
          <main className="dashboard-main">
            <div className="analytics-container">
              <div className="analytics-header">
                <h3>Library Analytics</h3>
                <p>Visual insights into your library operations</p>
              </div>
              
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  <h4>Book Circulation Trends</h4>
                  <p>Track borrowing patterns over time</p>
                  <div className="analytics-chart-placeholder">
                    📊 Chart visualization coming soon
                  </div>
                </div>
                
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <PieChart className="w-8 h-8" />
                  </div>
                  <h4>Genre Distribution</h4>
                  <p>See popular book categories</p>
                  <div className="analytics-chart-placeholder">
                    🥧 Pie chart coming soon
                  </div>
                </div>
                
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h4>Member Growth</h4>
                  <p>Monitor library membership trends</p>
                  <div className="analytics-chart-placeholder">
                    📈 Growth chart coming soon
                  </div>
                </div>
              </div>
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
