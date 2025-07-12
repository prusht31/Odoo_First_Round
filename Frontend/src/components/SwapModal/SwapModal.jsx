import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import './SwapModal.css';

const SwapModal = ({ targetUser, onClose }) => {
  const { user } = useAuth();
  const { sendSwapRequest } = useData();
  const [formData, setFormData] = useState({
    message: '',
    offeredSkill: '',
    requestedSkill: ''
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

    if (!formData.offeredSkill || !formData.requestedSkill || !formData.message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = sendSwapRequest(
        targetUser.id,
        formData.message.trim(),
        formData.offeredSkill,
        formData.requestedSkill
      );

      if (result.success) {
        alert('Swap request sent successfully!');
        onClose();
      } else {
        setError(result.error || 'Failed to send swap request');
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

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} style={{color: 'black'}}>
      <div className="modal swap-modal" style={{color: 'black'}}>
        <div className="modal-header" >
          <h3 style={{color: 'black'}}>Request Skill Swap with {targetUser.name}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="swap-modal-content">
          <div className="target-user-info">
            <div className="user-summary">
              <div className="user-avatar" style={{color: 'black'}}>
                {targetUser.photo ? (
                  <img src={targetUser.photo} alt={targetUser.name} />
                ) : (
                  <div className="avatar-placeholder" style={{color: 'black'}}>
                    {targetUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h4>{targetUser.name}</h4>
                <p className="location" style={{color: 'black'}}>📍 {targetUser.location}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="swap-form">
            <div className="form-group">
              <label className="form-label">I can offer:</label>
              <select
                name="offeredSkill"
                value={formData.offeredSkill}
                onChange={handleInputChange}
                className="form-select"
                style={{color: 'black'}}
                required
              >
                <option value="">Select a skill you offer</option>
                {user.skillsOffered?.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">I want to learn:</label>
              <select
                name="requestedSkill"
                value={formData.requestedSkill}
                onChange={handleInputChange}
                className="form-select"
                style={{color: 'black'}}
                required
              >
                <option value="">Select a skill they offer</option>
                {targetUser.skillsOffered?.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Message:</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="form-input form-textarea"
                style={{color: 'black'}}
                placeholder="Introduce yourself and explain what you'd like to learn..."
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
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SwapModal;