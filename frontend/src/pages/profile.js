import React, { useEffect, useState } from 'react';
import api from '../api';

const Profile = () => {
  const [form, setForm] = useState({ name: '', email: '', contact: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [borrowed, setBorrowed] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile/me');
        setForm({
          name: data.name || '',
          email: data.email || '',
          contact: data.contact || '',
          address: data.address || ''
        });
        const borrowedRes = await api.get('/profile/me/borrowed');
        setBorrowed(borrowedRes.data || []);
      } catch (err) {
        setMessage('Failed to load profile. Please login.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setUpdating(true);
    
    try {
      const { data } = await api.put('/profile/me', {
        name: form.name,
        contact: form.contact,
        address: form.address,
      });
      setForm({
        name: data.name || '',
        email: data.email || '',
        contact: data.contact || '',
        address: data.address || ''
      });
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      setMessage('');
      await api.post(`/books/${bookId}/return`);
      
      // Remove the book from borrowed list
      setBorrowed(prev => prev.filter(book => book._id !== bookId));
      
      setMessage('Book returned successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to return book');
      
      // Clear error message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{
            fontSize: '18px',
            color: '#64748b',
            fontWeight: '500'
          }}>
            Loading your profile...
          </div>
        </div>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#3b82f6',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            {form.name.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 style={{
              margin: '0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              Profile Settings
            </h1>
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '14px',
              color: '#64748b'
            }}>
              Manage your account information and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Borrowed Books Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            padding: '24px 32px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              margin: '0 0 8px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: '#1e293b'
            }}>
              Borrowed Books
            </h2>
            <p style={{
              margin: '0',
              fontSize: '14px',
              color: '#64748b'
            }}>
              Books you have currently borrowed
            </p>
          </div>

          <div style={{ padding: '24px 32px' }}>
            {borrowed.length === 0 ? (
              <div style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                border: '1px dashed #e2e8f0',
                borderRadius: '8px',
                color: '#64748b',
                textAlign: 'center'
              }}>
                You have no borrowed books.
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '16px'
              }}>
                {borrowed.map((book) => (
                  <div key={book._id} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff'
                  }}>
                    <div style={{ height: '140px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${book.image || 'https://via.placeholder.com/320x220?text=No+Image'})` }} />
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{book.title}</div>
                      {book.author && <div style={{ fontSize: '14px', color: '#6b7280' }}>by {book.author}</div>}
                      {book.genre && <div style={{ marginTop: 6, fontSize: '12px', color: '#1d4ed8', background: '#eff6ff', padding: '2px 8px', display: 'inline-block', borderRadius: '9999px' }}>{book.genre}</div>}
                      
                      {/* Return Book Button */}
                      <button
                        onClick={() => handleReturnBook(book._id)}
                        style={{
                          marginTop: '12px',
                          width: '100%',
                          padding: '8px 16px',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                      >
                        Return Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '32px',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Sidebar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginBottom: '16px'
                }}>
                  {form.name.charAt(0).toUpperCase() || 'U'}
                </div>
                <h3 style={{
                  margin: '0 0 4px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  {form.name || 'User'}
                </h3>
                <p style={{
                  margin: '0',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  {form.email}
                </p>
              </div>
            </div>

            <nav style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                color: '#1d4ed8',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid #dbeafe'
              }}>
                📝 Personal Information
              </div>
              <div style={{
                padding: '12px 16px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                borderRadius: '8px',
                marginTop: '4px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                🔒 Security Settings
              </div>
              <div style={{
                padding: '12px 16px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                borderRadius: '8px',
                marginTop: '4px'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                🔔 Notifications
              </div>
            </nav>
          </div>

          {/* Main Form */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '20px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Personal Information
              </h2>
              <p style={{
                margin: '0',
                fontSize: '14px',
                color: '#64748b'
              }}>
                Update your personal details and contact information
              </p>
            </div>

            <div style={{
              padding: '32px'
            }}>
              {message && (
                <div style={{
                  padding: '16px 20px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: message.includes('success') ? '#f0fdf4' : '#fef2f2',
                  color: message.includes('success') ? '#166534' : '#b91c1c',
                  border: `1px solid ${message.includes('success') ? '#bbf7d0' : '#fecaca'}`
                }}>
                  <span style={{
                    fontSize: '16px'
                  }}>
                    {message.includes('success') ? '✅' : '❌'}
                  </span>
                  {message}
                </div>
              )}

              <form onSubmit={onSubmit} style={{
                display: 'grid',
                gap: '24px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      required
                      placeholder="Enter your full name"
                      style={{
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'all 0.2s ease',
                        backgroundColor: '#ffffff',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Email Address
                    </label>
                    <input
                      name="email"
                      value={form.email}
                      disabled
                      placeholder="Your email address"
                      style={{
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        backgroundColor: '#f9fafb',
                        color: '#6b7280',
                        cursor: 'not-allowed',
                        fontFamily: 'inherit'
                      }}
                    />
                    <span style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      Email address cannot be changed
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Contact Number
                    </label>
                    <input
                      name="contact"
                      value={form.contact}
                      onChange={onChange}
                      placeholder="Enter your phone number"
                      style={{
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'all 0.2s ease',
                        backgroundColor: '#ffffff',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      Address
                    </label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={onChange}
                      placeholder="Enter your address"
                      style={{
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'all 0.2s ease',
                        backgroundColor: '#ffffff',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '24px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px'
                }}>
                  <button
                    type="button"
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'white',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.borderColor = '#9ca3af';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#d1d5db';
                    }}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={updating}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: updating ? '#9ca3af' : '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: updating ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      if (!updating) {
                        e.target.style.backgroundColor = '#2563eb';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!updating) {
                        e.target.style.backgroundColor = '#3b82f6';
                        e.target.style.transform = 'none';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {updating && (
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid #ffffff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                    )}
                    {updating ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
          }
          @media (max-width: 768px) {
            .grid-responsive {
              grid-template-columns: 1fr !important;
            }
            .form-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Profile;