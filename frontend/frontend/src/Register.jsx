import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phNo: '',
    type: 'Hostel Student', // Default value for type
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/studentregister', formData);
      navigate('/login');
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'Registration failed');
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="left-section">
        <div className="welcome-content">
          <h1>Join Campus Bites</h1>
          <p>Create your student account and enjoy delicious meals from campus restaurants</p>
          <div className="features">
            <div className="feature-item">
              <span className="feature-icon">🎓</span>
              <span>Exclusive student discounts</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <span>Easy mobile ordering</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🍽️</span>
              <span>Access to all campus restaurants</span>
            </div>
          </div>
        </div>
      </div>

      <div className="right-section">
        <div className="auth-form">
          <h2>Student <span className="highlight">Registration</span></h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <FaUser className="input-icon" />
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="input-container">
              <FaEnvelope className="input-icon" />
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="input-container">
              <FaLock className="input-icon" />
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="input-container">
              <FaPhone className="input-icon" />
              <input 
                type="tel" 
                name="phNo" 
                placeholder="Mobile Number" 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="input-container">
              <label htmlFor="type">User Type</label>
              <select 
                id="type" 
                name="type" 
                value={formData.type} 
                onChange={handleChange} 
                required
              >
                <option value="Hostel Student">Hostel Student</option>
                <option value="Day Scholar">Dayscholar</option>
              </select>
            </div>
            <button type="submit" className="submit-button">
              Create Account
            </button>
          </form>
          <div className="auth-footer">
            <p>Already have an account?</p>
            <button 
              onClick={() => navigate('/login')} 
              className="link-button"
            >
              Login Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
