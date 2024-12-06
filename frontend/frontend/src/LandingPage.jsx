import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { FaUserGraduate, FaStore, FaArrowRight, FaUtensils, FaPhoneAlt, FaInfoCircle, FaHeart, FaQuoteLeft, FaGithub, FaGoogle, FaLinkedin } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out'
    });
  }, []);

  const handleStudentLogin = () => {
    navigate('/login');
  };

  const handleOwnerLogin = () => {
    navigate('/owner-login');
  };

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-brand">
          <FaUtensils className="nav-logo" />
          <span>Campus Bites</span>
        </div>
        <div className="nav-links">
          <a href="#features"><FaInfoCircle /> Features</a>
          <a href="#about"><FaHeart /> About</a>
          <a href="#contact"><FaPhoneAlt /> Contact</a>
        </div>
      </nav>

      <div className="decoration decoration-1" />
      <div className="decoration decoration-2" />
      <div className="decoration decoration-3" />
      
      <div className="landing-content">
        {/* Left Side Content */}
        <div className="content-side" data-aos="fade-right">
          <h1 className="landing-title">
            Welcome to <span className="highlight">Campus Bites</span>
          </h1>
          <p className="landing-subtitle">
            Your digital gateway to convenient and delicious campus dining. 
            Order, manage, and enjoy your meals with just a few clicks.
          </p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🍔</span>
              <span>Wide variety of campus restaurants</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Quick and easy ordering</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <span>Real-time order tracking</span>
            </div>
          </div>
        </div>

        {/* Right Side Buttons */}
        <div className="buttons-side" data-aos="fade-left">
          <button 
            className="login-button student-button floating"
            onClick={handleStudentLogin}
          >
            <div className="button-content">
              <FaUserGraduate className="button-icon" />
              <span className="button-text">Student Portal</span>
              <FaArrowRight className="arrow-icon" />
            </div>
          </button>
          <button 
            className="login-button owner-button floating"
            onClick={handleOwnerLogin}
          >
            <div className="button-content">
              <FaStore className="button-icon" />
              <span className="button-text">Owner Portal</span>
              <FaArrowRight className="arrow-icon" />
            </div>
          </button>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="why-choose-us" data-aos="fade-up">
        <h2>Why Students Choose Campus Bites</h2>
        <div className="benefits-grid">
          <div className="benefit-card" data-aos="zoom-in" data-aos-delay="100">
            <div className="benefit-icon">🕒</div>
            <h3>Time-Saving</h3>
            <p>Skip the lines and order ahead for pickup or delivery</p>
          </div>
          <div className="benefit-card" data-aos="zoom-in" data-aos-delay="200">
            <div className="benefit-icon">💰</div>
            <h3>Student Discounts</h3>
            <p>Exclusive deals and promotions for students</p>
          </div>
          <div className="benefit-card" data-aos="zoom-in" data-aos-delay="300">
            <div className="benefit-icon">🎯</div>
            <h3>Convenience</h3>
            <p>Order from anywhere on campus with ease</p>
          </div>
          <div className="benefit-card" data-aos="zoom-in" data-aos-delay="400">
            <div className="benefit-icon">🌟</div>
            <h3>Loyalty Rewards</h3>
            <p>Earn points with every order and get rewards</p>
          </div>
        </div>
      </section>

      {/* Student Testimonials Section */}
      <section className="testimonials" data-aos="fade-up">
        <h2>What Our Students Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card" data-aos="flip-left" data-aos-delay="100">
            <FaQuoteLeft className="quote-icon" />
            <p className="testimonial-text">
              "Campus Bites has made my lunch breaks so much more efficient. I can order ahead and pick up my food without waiting in long lines!"
            </p>
            <div className="testimonial-author">
              <img src="https://i.pravatar.cc/150?img=1" alt="Sarah" className="author-image" />
              <div className="author-info">
                <h4>Sarah Johnson</h4>
                <p>Computer Science Major</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card" data-aos="flip-left" data-aos-delay="200">
            <FaQuoteLeft className="quote-icon" />
            <p className="testimonial-text">
              "The student discounts and loyalty rewards are amazing! I save money while enjoying great food from campus restaurants."
            </p>
            <div className="testimonial-author">
              <img src="https://i.pravatar.cc/150?img=2" alt="Mike" className="author-image" />
              <div className="author-info">
                <h4>Mike Chen</h4>
                <p>Business Major</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card" data-aos="flip-left" data-aos-delay="300">
            <FaQuoteLeft className="quote-icon" />
            <p className="testimonial-text">
              "The real-time tracking feature is fantastic! I know exactly when my order will be ready. It's super convenient!"
            </p>
            <div className="testimonial-author">
              <img src="https://i.pravatar.cc/150?img=3" alt="Emily" className="author-image" />
              <div className="author-info">
                <h4>Emily Rodriguez</h4>
                <p>Engineering Major</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section" data-aos="fade-up">
        <div className="social-links">
          <a href="https://github.com/your-github" 
             className="social-link animate-hover" 
             target="_blank" 
             rel="noopener noreferrer">
            <FaGithub className="social-icon" />
          </a>
          <a href="https://google.com" className="social-link animate-hover" target="_blank" rel="noopener noreferrer">
            <FaGoogle className="social-icon" />
          </a>
          <a href="https://linkedin.com/your-linkedin" className="social-link animate-hover" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="social-icon" />
          </a>
        </div>
        <div className="copyright">
          <p>© 2024 Campus Bites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;