import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsSubmitting(true);

  try {
    const result = login(formData.email, formData.password);

    if (result.success) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser?.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/search');
      }
    } else {
      setError(result.error);
    }
  } catch (err) {
    setError('An error occurred. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="login-page" >
      <div className="container" style={{width: '200vw'}}>
        <div className="login-container" >
          <div className="login-card">
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your SkillSwap account</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input kdfixer"
                  style={{ height: '5vh' }}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit" 
                className="btn btn-primary login-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="login-footer">
              <p>
                Don't have an account? {' '}
                <Link to="/register" className="link">
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="demo-accounts">
              <h4>Demo Accounts</h4>
              <div className="demo-buttons">
                <button 
                  className="btn btn-secondary btn-small"
                  onClick={() => setFormData({ email: 'admin@skillswap.com', password: 'admin123' })}
                >
                  Admin Demo
                </button>
                <button 
                  className="btn btn-secondary btn-small"
                  onClick={() => setFormData({ email: 'user@example.com', password: 'password123' })}
                >
                  User Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;