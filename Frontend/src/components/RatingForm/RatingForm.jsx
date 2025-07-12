import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import './RatingForm.css';

const RatingForm = ({ swapRequest, onClose, onSubmit }) => {
  const { submitReview } = useData();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoveredRating(value);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please provide a comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = submitReview(swapRequest.id, rating, comment.trim());
      
      if (result.success) {
        onSubmit();
        onClose();
      } else {
        setError(result.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isActive = i <= (hoveredRating || rating);
      stars.push(
        <button
          key={i}
          type="button"
          className={`star-button ${isActive ? 'active' : ''}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal rating-modal">
        <div className="modal-header">
          <h3>Rate Your Skill Swap Experience</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="rating-form-content">
          <div className="swap-summary">
            <p><strong>Skill Offered:</strong> {swapRequest.offeredSkill}</p>
            <p><strong>Skill Learned:</strong> {swapRequest.requestedSkill}</p>
          </div>

          <form onSubmit={handleSubmit} className="rating-form">
            <div className="form-group">
              <label className="form-label">How would you rate this experience?</label>
              <div className="star-rating">
                {renderStars()}
              </div>
              {rating > 0 && (
                <p className="rating-text" style={{color: 'black'}}>
                  {rating} star{rating !== 1 ? 's' : ''} - {
                    rating === 1 ? 'Poor' :
                    rating === 2 ? 'Fair' :
                    rating === 3 ? 'Good' :
                    rating === 4 ? 'Very Good' :
                    'Excellent'
                  }
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Share your experience:</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-input form-textarea"
                style={{color: 'black'}}
                placeholder="Tell others about your skill swap experience..."
                rows="4"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingForm;