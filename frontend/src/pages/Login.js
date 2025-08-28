import React, { useState } from 'react';
import api from '../api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      setMessage('Login successful');
      setTimeout(() => {
        window.location.href = '/profile';
      }, 1000);
    } catch (err) {
      setMessage('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '420px',
    margin: '40px auto',
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #007bff, #0056b3, #004085)',
    borderRadius: '16px 16px 0 0'
  };

  const headingStyle = {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: '8px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #007bff, #0056b3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#718096',
    textAlign: 'center',
    marginBottom: '32px',
    fontWeight: '400'
  };

  const messageStyle = {
    margin: '0 0 24px 0',
    padding: '16px 20px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: message.includes('successful') ? '#d4edda' : '#f8d7da',
    color: message.includes('successful') ? '#155724' : '#721c24',
    border: `2px solid ${message.includes('successful') ? '#c3e6cb' : '#f5c6cb'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const formStyle = {
    display: 'grid',
    gap: '24px'
  };

  const inputGroupStyle = {
    position: 'relative'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    transition: 'color 0.2s ease'
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    backgroundColor: '#ffffff',
    color: '#1a202c',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#007bff',
    outline: 'none',
    boxShadow: '0 0 0 4px rgba(0, 123, 255, 0.1)',
    transform: 'translateY(-2px)'
  };

  const passwordInputStyle = {
    ...inputStyle,
    paddingRight: '60px'
  };

  const passwordToggleStyle = {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    padding: '4px',
    borderRadius: '4px',
    transition: 'color 0.2s ease'
  };

  const buttonStyle = {
    padding: '18px 24px',
    backgroundColor: loading ? '#6c757d' : '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    position: 'relative',
    overflow: 'hidden'
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: loading ? '#6c757d' : '#0056b3',
    transform: loading ? 'none' : 'translateY(-2px)',
    boxShadow: loading ? 'none' : '0 8px 25px rgba(0, 123, 255, 0.4)'
  };

  const loadingSpinnerStyle = {
    width: '20px',
    height: '20px',
    border: '2px solid transparent',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle}></div>
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={headingStyle}>Welcome Back</h2>
        <p style={subtitleStyle}>Sign in to your account</p>
        
        {message && (
          <div style={messageStyle}>
            <span style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: message.includes('successful') ? '#28a745' : '#dc3545',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              lineHeight: '20px',
              textAlign: 'center'
            }}>
              {message.includes('successful') ? '✓' : '!'}
            </span>
            {message}
          </div>
        )}
        
        <form onSubmit={onSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={onChange}
                style={passwordInputStyle}
                onFocus={(e) => Object.assign(e.target.style, {...inputFocusStyle, paddingRight: '60px'})}
                onBlur={(e) => Object.assign(e.target.style, passwordInputStyle)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                style={passwordToggleStyle}
                onClick={() => setShowPassword(!showPassword)}
                onMouseEnter={(e) => e.target.style.color = '#007bff'}
                onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                disabled={loading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => !loading && Object.assign(e.target.style, buttonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
            disabled={loading}
          >
            {loading && <div style={loadingSpinnerStyle}></div>}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          padding: '20px 0',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}>
            Don't have an account?{' '}
            <span style={{
              color: '#007bff',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Sign up here
            </span>
          </p>
        </div>
      </div>
      
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
};

export default Login;