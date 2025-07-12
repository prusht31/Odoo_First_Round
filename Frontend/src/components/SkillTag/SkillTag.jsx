import React from 'react';
import './SkillTag.css';

const SkillTag = ({ skill, type = 'neutral', onRemove = null }) => {
  const getTagClass = () => {
    switch (type) {
      case 'offered':
        return 'skill-tag-offered';
      case 'wanted':
        return 'skill-tag-wanted';
      case 'removable':
        return 'skill-tag-removable';
      default:
        return 'skill-tag-neutral';
    }
  };

  return (
    <span className={`skill-tag ${getTagClass()}`}>
      {skill}
      {onRemove && (
        <button 
          className="skill-tag-remove"
          onClick={() => onRemove(skill)}
          aria-label={`Remove ${skill}`}
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillTag;