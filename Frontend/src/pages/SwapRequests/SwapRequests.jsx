import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import RatingForm from '../../components/RatingForm/RatingForm';
import './SwapRequests.css';

const SwapRequests = () => {
  const { user } = useAuth();
  const { 
    getIncomingRequests, 
    getOutgoingRequests, 
    updateSwapRequest, 
    getUserById,
    deleteSwapRequest
  } = useData();
  
  const [activeTab, setActiveTab] = useState('incoming');
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ratingModalRequest, setRatingModalRequest] = useState(null);

  useEffect(() => {
    loadRequests();
  }, [user]);

  const loadRequests = () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const incoming = getIncomingRequests(user.id);
      const outgoing = getOutgoingRequests(user.id);
      
      setIncomingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAction = (requestId, action) => {
    const result = updateSwapRequest(requestId, action);
    if (result.success) {
      loadRequests();
    }
  };

  const handleDeleteRequest = (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      deleteSwapRequest(requestId);
      loadRequests();
    }
  };

  const handleRateExperience = (request) => {
    setRatingModalRequest(request);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-online';
      case 'rejected': return 'status-offline';
      case 'completed': return 'status-online';
      default: return '';
    }
  };

  const RequestCard = ({ request, isOutgoing = false }) => {
    const otherUserId = isOutgoing ? request.toUserId : request.fromUserId;
    const otherUser = getUserById(otherUserId);
    
    if (!otherUser) return null;

    return (
      <div className="request-card">
        <div className="request-header">
          <div className="user-info">
            <div className="user-avatar">
              {otherUser.photo ? (
                <img src={otherUser.photo} alt={otherUser.name} />
              ) : (
                <div className="avatar-placeholder">
                  {otherUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-details">
              <h4>{otherUser.name}</h4>
              <p className="user-location">📍 {otherUser.location}</p>
              <span className={`status ${getStatusClass(request.status)}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="request-date">
            {formatDate(request.createdAt)}
          </div>
        </div>

        <div className="request-content">
          <div className="skill-exchange">
            <div className="skill-item">
              <span className="skill-label">
                {isOutgoing ? 'You offer:' : 'They offer:'}
              </span>
              <span className="skill-value offered">{request.offeredSkill}</span>
            </div>
            <div className="exchange-arrow">⇄</div>
            <div className="skill-item">
              <span className="skill-label">
                {isOutgoing ? 'You want:' : 'They want:'}
              </span>
              <span className="skill-value wanted">{request.requestedSkill}</span>
            </div>
          </div>

          <div className="request-message">
            <h5>Message:</h5>
            <p>{request.message}</p>
          </div>
        </div>

        <div className="request-actions">
          {!isOutgoing && request.status === 'pending' && (
            <>
              <button 
                className="btn btn-success btn-small"
                onClick={() => handleRequestAction(request.id, 'accepted')}
              >
                Accept
              </button>
              <button 
                className="btn btn-danger btn-small"
                onClick={() => handleRequestAction(request.id, 'rejected')}
              >
                Reject
              </button>
            </>
          )}
          
          {request.status === 'accepted' && (
            <button 
              className="btn btn-primary btn-small"
              onClick={() => handleRequestAction(request.id, 'completed')}
            >
              Mark as Completed
            </button>
          )}

          {request.status === 'completed' && (
            <button 
              className="btn btn-secondary btn-small"
              onClick={() => handleRateExperience(request)}
            >
              Rate Experience
            </button>
          )}

          {isOutgoing && request.status === 'pending' && (
            <button 
              className="btn btn-danger btn-small"
              onClick={() => handleDeleteRequest(request.id)}
            >
              Cancel Request
            </button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="swap-requests-page">
      <div className="container">
        <div className="page-header">
          <h1>Skill Swap Requests</h1>
          <p>Manage your incoming and outgoing skill exchange requests</p>
        </div>

        <div className="requests-tabs">
          <button 
            className={`tab-button ${activeTab === 'incoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('incoming')}
          >
            Incoming Requests ({incomingRequests.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'outgoing' ? 'active' : ''}`}
            onClick={() => setActiveTab('outgoing')}
          >
            Outgoing Requests ({outgoingRequests.length})
          </button>
        </div>

        <div className="requests-content">
          {activeTab === 'incoming' ? (
            <div className="requests-list">
              {incomingRequests.length > 0 ? (
                incomingRequests.map(request => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    isOutgoing={false}
                  />
                ))
              ) : (
                <div className="no-requests">
                  <div className="no-requests-icon">📬</div>
                  <h3>No incoming requests</h3>
                  <p>When people want to swap skills with you, their requests will appear here.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="requests-list">
              {outgoingRequests.length > 0 ? (
                outgoingRequests.map(request => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    isOutgoing={true}
                  />
                ))
              ) : (
                <div className="no-requests">
                  <div className="no-requests-icon">📤</div>
                  <h3>No outgoing requests</h3>
                  <p>
                    You haven't sent any skill swap requests yet. 
                    <br />
                    Visit the <a href="/search">search page</a> to find skill partners.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {ratingModalRequest && (
        <RatingForm 
          swapRequest={ratingModalRequest}
          onClose={() => setRatingModalRequest(null)}
          onSubmit={loadRequests}
        />
      )}
    </div>
  );
};

export default SwapRequests;