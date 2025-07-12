import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import UserCard from '../../components/UserCard/UserCard';
import './Search.css';

const Search = () => {
  const { searchUsers } = useData();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    skill: '',
    availability: []
  });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const availabilityOptions = [
    'Weekdays (9AM-5PM)',
    'Weekday Evenings',
    'Weekends',
    'Weekend Mornings',
    'Weekend Evenings',
    'Flexible Schedule'
  ];

  useEffect(() => {
    // Load initial users
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = searchUsers(query, filters);
      setUsers(results);
    } catch (error) {
      console.error('Search failed:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'availability') {
      setFilters(prev => ({
        ...prev,
        availability: prev.availability.includes(value)
          ? prev.availability.filter(a => a !== value)
          : [...prev.availability, value]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  const clearFilters = () => {
    setQuery('');
    setFilters({
      location: '',
      skill: '',
      availability: []
    });
  };

  const hasActiveFilters = query || filters.location || filters.skill || filters.availability.length > 0;

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h1>Find Skill Partners</h1>
          <p>Discover people who can teach you new skills or learn from your expertise</p>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              placeholder="Search by name, location, or skill..."
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="btn btn-primary search-button"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="filters-section">
            <h3>Filters</h3>
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="form-input"
                  placeholder="Filter by location"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Skill</label>
                <input
                  type="text"
                  value={filters.skill}
                  onChange={(e) => handleFilterChange('skill', e.target.value)}
                  className="form-input"
                  placeholder="Filter by skill"
                />
              </div>

              <div className="filter-group availability-filter">
                <label className="filter-label">Availability</label>
                <div className="availability-checkboxes">
                  {availabilityOptions.map((option) => (
                    <label key={option} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.availability.includes(option)}
                        onChange={() => handleFilterChange('availability', option)}
                      />
                      <span className="checkbox-text">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="filter-actions">
              <button 
                className="btn btn-secondary"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
              >
                Clear Filters
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSearch}
                disabled={isLoading}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <div className="search-results">
          <div className="results-header">
            <h2>
              {hasSearched ? (
                users.length > 0 ? (
                  `Found ${users.length} skill partner${users.length !== 1 ? 's' : ''}`
                ) : (
                  'No skill partners found'
                )
              ) : (
                'Available Skill Partners'
              )}
            </h2>
            {hasActiveFilters && (
              <div className="active-filters">
                {query && <span className="filter-tag">Search: "{query}"</span>}
                {filters.location && <span className="filter-tag">Location: {filters.location}</span>}
                {filters.skill && <span className="filter-tag">Skill: {filters.skill}</span>}
                {filters.availability.map(avail => (
                  <span key={avail} className="filter-tag">{avail}</span>
                ))}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Searching for skill partners...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="users-grid">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ) : hasSearched ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No skill partners found</h3>
              <p>
                {hasActiveFilters 
                  ? 'Try adjusting your search criteria or filters'
                  : 'There are no available skill partners at the moment'
                }
              </p>
              {hasActiveFilters && (
                <button 
                  className="btn btn-primary"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Search;