import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';

function OwnerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/ownerlogin', { email, password });
      if (response.data.success) {
        navigate('/owner-dashboard',{ state: { ownerId: response.data.ownerId } });
      } else {
        setError(response.data.message || 'Invalid credentials! Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed! Please try again.');
    }
  };

  return (
    <div className="login-container owner-theme">
      {/* Left Side */}
      <div className="info-section">
        <h1>Restaurant Owner Portal</h1>
        <p>Manage your restaurant and orders efficiently through our platform</p>
        <div className="features-list">
          <div className="feature-item">
            <span>📊</span> Track your sales
          </div>
          <div className="feature-item">
            <span>🔔</span> Real-time order notifications
          </div>
          <div className="feature-item">
            <span>⚙️</span> Easy menu management
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-section">
        <div className="login-box">
          <h2>Owner <span className="highlight">Login</span></h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          <p className="register-text">
            Don't have a restaurant account?
            <button 
              onClick={() => navigate('/owner-register')} 
              className="register-link"
            >
              Register Restaurant
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OwnerLogin;
