import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Share Skills, Learn Together
            </h1>
            <p className="hero-subtitle">
              Connect with people in your community to exchange skills and knowledge. 
              Teach what you know, learn what you want.
            </p>
            {!user ? (
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="hero-actions">
                <Link to="/search" className="btn btn-primary">
                  Find Skills
                </Link>
                <Link to="/profile" className="btn btn-outline">
                  Your Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="features-title">How SkillSwap Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>Create Your Profile</h3>
              <p>List the skills you can teach and the skills you want to learn. Set your availability and location.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Find Perfect Matches</h3>
              <p>Search for people who offer the skills you want to learn and are interested in what you can teach.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Exchange Skills</h3>
              <p>Send swap requests, arrange meetups, and start learning from each other in a mutually beneficial way.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Build Your Reputation</h3>
              <p>Rate your experiences and build a trusted profile in the skill-sharing community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Learning?</h2>
            <p>Join thousands of people who are already sharing and learning new skills together.</p>
            {!user && (
              <Link to="/register" className="btn btn-primary">
                Join SkillSwap Today
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;