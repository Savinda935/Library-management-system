import React, { useState } from 'react';
import api from '../api';
import lib from '../images/libhome.jpg';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', contact: '', address: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    
    // Check password strength
    if (e.target.name === 'password') {
      const password = e.target.value;
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      setPasswordStrength(strength);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      setMessage('Registration successful');
      setTimeout(() => {
        window.location.href = '/profile';
      }, 1500);
    } catch (err) {
      setMessage('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return '#dc3545';
    if (passwordStrength <= 2) return '#fd7e14';
    if (passwordStrength <= 3) return '#ffc107';
    if (passwordStrength <= 4) return '#20c997';
    return '#28a745';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    if (passwordStrength <= 4) return 'Strong';
    return 'Excellent';
  };

  const pageStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: 'calc(100vh - 120px)'
  };

  const imagePaneStyle = {
    backgroundImage: `url(${lib})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative'
  };

  const containerStyle = {
    maxWidth: '560px',
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
    background: 'linear-gradient(90deg, #28a745, #20c997, #17a2b8)',
    borderRadius: '16px 16px 0 0'
  };

  const headingStyle = {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: '8px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #28a745, #20c997)',
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
    gap: '20px'
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

  const requiredStyle = {
    color: '#dc3545',
    marginLeft: '2px'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '16px',
    backgroundColor: '#ffffff',
    color: '#1a202c',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#28a745',
    outline: 'none',
    boxShadow: '0 0 0 4px rgba(40, 167, 69, 0.1)',
    transform: 'translateY(-1px)'
  };

  const passwordInputStyle = {
    ...inputStyle,
    paddingRight: '60px'
  };

  const passwordToggleStyle = {
    position: 'absolute',
    right: '18px',
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

  const passwordStrengthStyle = {
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const strengthBarStyle = {
    flex: 1,
    height: '4px',
    backgroundColor: '#e5e7eb',
    borderRadius: '2px',
    overflow: 'hidden'
  };

  const strengthFillStyle = {
    height: '100%',
    backgroundColor: getPasswordStrengthColor(),
    width: `${(passwordStrength / 5) * 100}%`,
    transition: 'all 0.3s ease',
    borderRadius: '2px'
  };

  const strengthTextStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: getPasswordStrengthColor(),
    minWidth: '60px'
  };

  const buttonStyle = {
    padding: '18px 24px',
    backgroundColor: loading ? '#6c757d' : '#28a745',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: loading ? '#6c757d' : '#218838',
    transform: loading ? 'none' : 'translateY(-2px)',
    boxShadow: loading ? 'none' : '0 8px 25px rgba(40, 167, 69, 0.4)'
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
    <div style={pageStyle}>
      <div style={imagePaneStyle}></div>
      <div>
        <div style={containerStyle}>
          <div style={backgroundStyle}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={headingStyle}>Create Account</h2>
            <p style={subtitleStyle}>Join us today and get started</p>
            
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
            <label style={labelStyle}>
              Full Name <span style={requiredStyle}>*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Email Address <span style={requiredStyle}>*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              Password <span style={requiredStyle}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={onChange}
                style={passwordInputStyle}
                onFocus={(e) => Object.assign(e.target.style, {...inputFocusStyle, paddingRight: '60px'})}
                onBlur={(e) => Object.assign(e.target.style, passwordInputStyle)}
                placeholder="Create a strong password"
                required
                disabled={loading}
              />
              <button
                type="button"
                style={passwordToggleStyle}
                onClick={() => setShowPassword(!showPassword)}
                onMouseEnter={(e) => e.target.style.color = '#28a745'}
                onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                disabled={loading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {form.password && (
              <div style={passwordStrengthStyle}>
                <div style={strengthBarStyle}>
                  <div style={strengthFillStyle}></div>
                </div>
                <span style={strengthTextStyle}>
                  {getPasswordStrengthText()}
                </span>
              </div>
            )}
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Contact Number</label>
            <input
              name="contact"
              value={form.contact}
              onChange={onChange}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              placeholder="Enter your phone number"
              disabled={loading}
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Address</label>
            <input
              name="address"
              value={form.address}
              onChange={onChange}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              placeholder="Enter your address"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            style={buttonStyle}
            onMouseEnter={(e) => !loading && Object.assign(e.target.style, buttonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
            disabled={loading}
          >
            {loading && <div style={loadingSpinnerStyle}></div>}
            {loading ? 'Creating Account...' : 'Create Account'}
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
                Already have an account?{' '}
                <span style={{
                  color: '#28a745',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Sign in here
                </span>
              </p>
            </div>
          </div>
          
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
        </div>
      </div>
    </div>
  );
};

export default Register;