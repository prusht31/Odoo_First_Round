import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import SkillTag from '../SkillTag/SkillTag';
import SwapModal from '../SwapModal/SwapModal';
import './UserCard.css';

const UserCard = ({ user, showSwapButton = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getUserReviews } = useData();

  const reviews = getUserReviews(user.id);
  const averageRating = user.rating || 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  return (
    <>
      <div className="user-card">
        <div className="user-card-header">
          <div className="user-avatar">
            {user.photo ? (
              <img src={user.photo} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-info">
            <h3 className="user-name">{user.name}</h3>
            <p className="user-location">📍 {user.location}</p>
            <div className="user-rating">
              <div className="stars">
                {renderStars(averageRating)}
              </div>
              <span className="rating-text">
                {averageRating.toFixed(1)} ({user.totalRatings || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="user-skills">
          <div className="skills-section">
            <h4>Offers:</h4>
            <div className="skills-list">
              {user.skillsOffered?.length > 0 ? (
                user.skillsOffered.map((skill, index) => (
                  <SkillTag key={index} skill={skill} type="offered" />
                ))
              ) : (
                <span className="no-skills">No skills offered yet</span>
              )}
            </div>
          </div>

          <div className="skills-section">
            <h4>Wants:</h4>
            <div className="skills-list">
              {user.skillsWanted?.length > 0 ? (
                user.skillsWanted.map((skill, index) => (
                  <SkillTag key={index} skill={skill} type="wanted" />
                ))
              ) : (
                <span className="no-skills">No skills wanted yet</span>
              )}
            </div>
          </div>
        </div>

        {user.availability?.length > 0 && (
          <div className="user-availability">
            <h4>Available:</h4>
            <div className="availability-list">
              {user.availability.map((time, index) => (
                <span key={index} className="availability-tag">
                  {time}
                </span>
              ))}
            </div>
          </div>
        )}

        {showSwapButton && (
          <div className="user-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              Request Skill Swap
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <SwapModal
          targetUser={user}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default UserCard;