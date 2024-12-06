import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', { email, password });  
      localStorage.setItem('userId', response.data.userId);     
      navigate('/student-dashboard', { state: { userId: response.data.userId } });
    } catch (error) {
      console.error(error);
      alert(error.response.data.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      {/* Left Side */}
      <div className="info-section">
        <h1>Welcome Back Student!</h1>
        <p>Access your account to order delicious meals from campus restaurants</p>
        <div className="features-list">
          <div className="feature-item">
            <span>🍔</span> Wide variety of food options
          </div>
          <div className="feature-item">
            <span>⚡</span> Quick ordering process
          </div>
          <div className="feature-item">
            <span>📱</span> Real-time order tracking
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-section">
        <div className="login-box">
          <h2>Student <span className="highlight">Login</span></h2>
          <form onSubmit={handleLogin}>
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
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          <p className="register-text">
            Don't have an account?
            <button 
              onClick={() => navigate('/register')} 
              className="register-link"
            >
              Register Now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
