import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SkillTag from '../../components/SkillTag/SkillTag';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    photo: user?.photo || '',
    isPublic: user?.isPublic !== false,
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    availability: user?.availability || []
  });
  const [newSkill, setNewSkill] = useState('');
  const [skillType, setSkillType] = useState('offered');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const availabilityOptions = [
    'Weekdays (9AM-5PM)',
    'Weekday Evenings',
    'Weekends',
    'Weekend Mornings',
    'Weekend Evenings',
    'Flexible Schedule'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAvailabilityChange = (option) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(a => a !== option)
        : [...prev.availability, option]
    }));
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;

    const skillKey = skillType === 'offered' ? 'skillsOffered' : 'skillsWanted';
    const normalizedSkill = newSkill.trim().toLowerCase();

    // Check for duplicates
    if (formData[skillKey].some(skill => skill.toLowerCase() === normalizedSkill)) {
      setError('This skill is already in your list');
      return;
    }

    setFormData(prev => ({
      ...prev,
      [skillKey]: [...prev[skillKey], newSkill.trim()]
    }));
    setNewSkill('');
    setError('');
  };

  const removeSkill = (skillToRemove, skillKey) => {
    setFormData(prev => ({
      ...prev,
      [skillKey]: prev[skillKey].filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const result = updateProfile(formData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      location: user?.location || '',
      photo: user?.photo || '',
      isPublic: user?.isPublic !== false,
      skillsOffered: user?.skillsOffered || [],
      skillsWanted: user?.skillsWanted || [],
      availability: user?.availability || []
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>Your Profile</h1>
          {!isEditing && (
            <button 
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        {(error || success) && (
          <div className={`message ${error ? 'error' : 'success'}`}>
            {error || success}
          </div>
        )}

        <div className="profile-content">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section" >
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label"style={{color: 'white'}}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{color: 'white'}}>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{color: 'white'}}>Profile Photo URL</label>
                    <input
                      type="url"
                      name="photo"
                      value={formData.photo}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-checkbox">
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleInputChange}
                      />
                      Make my profile public
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Skills</h3>
                <div className="skills-form">
                  <div className="add-skill"style={{display: 'flex' , flexDirection: 'colume'}}>
                    <div className="skill-input-group" >
                      <select
                        value={skillType}
                        onChange={(e) => setSkillType(e.target.value)}
                        className="form-select skill-type-select"
                        style={{color: 'black'}}
                      >
                        <option value="offered">I can teach</option>
                        <option value="wanted">I want to learn</option>
                      </select>
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="form-input"
                        placeholder="Enter a skill"
                        style={{width: '10vw'}}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="btn btn-secondary"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="skills-display">
                    <div className="skill-category">
                      <h4>Skills I Can Teach</h4>
                      <div className="skills-list">
                        {formData.skillsOffered.length > 0 ? (
                          formData.skillsOffered.map((skill, index) => (
                            <SkillTag
                              key={index}
                              skill={skill}
                              type="removable"
                              onRemove={(skillToRemove) => removeSkill(skillToRemove, 'skillsOffered')}
                            />
                          ))
                        ) : (
                          <span className="no-skills">No skills added yet</span>
                        )}
                      </div>
                    </div>

                    <div className="skill-category">
                      <h4>Skills I Want to Learn</h4>
                      <div className="skills-list">
                        {formData.skillsWanted.length > 0 ? (
                          formData.skillsWanted.map((skill, index) => (
                            <SkillTag
                              key={index}
                              skill={skill}
                              type="removable"
                              onRemove={(skillToRemove) => removeSkill(skillToRemove, 'skillsWanted')}
                            />
                          ))
                        ) : (
                          <span className="no-skills">No skills added yet</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Availability</h3>
                <div className="availability-options">
                  {availabilityOptions.map((option) => (
                    <label key={option} className="form-checkbox availability-option">
                      <input
                        type="checkbox"
                        checked={formData.availability.includes(option)}
                        onChange={() => handleAvailabilityChange(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-display">
              <div className="profile-card">
                <div className="profile-info">
                  <div className="profile-avatar">
                    {user.photo ? (
                      <img src={user.photo} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="profile-details">
                    <h2>{user.name}</h2>
                    <p className="location">📍 {user.location}</p>
                    <div className="profile-status">
                      <span className={`status ${user.isPublic ? 'status-online' : 'status-offline'}`}>
                        {user.isPublic ? 'Public Profile' : 'Private Profile'}
                      </span>
                    </div>
                    {user.rating > 0 && (
                      <div className="profile-rating">
                        <span className="rating">⭐ {user.rating.toFixed(1)}</span>
                        <span className="rating-count">({user.totalRatings} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="profile-skills">
                  <div className="skill-section">
                    <h3>Skills I Can Teach</h3>
                    <div className="skills-list">
                      {user.skillsOffered?.length > 0 ? (
                        user.skillsOffered.map((skill, index) => (
                          <SkillTag key={index} skill={skill} type="offered" />
                        ))
                      ) : (
                        <span className="no-skills">No skills added yet</span>
                      )}
                    </div>
                  </div>

                  <div className="skill-section">
                    <h3>Skills I Want to Learn</h3>
                    <div className="skills-list">
                      {user.skillsWanted?.length > 0 ? (
                        user.skillsWanted.map((skill, index) => (
                          <SkillTag key={index} skill={skill} type="wanted" />
                        ))
                      ) : (
                        <span className="no-skills">No skills added yet</span>
                      )}
                    </div>
                  </div>
                </div>

                {user.availability?.length > 0 && (
                  <div className="profile-availability">
                    <h3>My Availability</h3>
                    <div className="availability-list">
                      {user.availability.map((time, index) => (
                        <span key={index} className="availability-tag">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;