import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { 
    getAllUsers, 
    swapRequests, 
    reviews, 
    banUser, 
    deleteSwapRequest, 
    generateReport 
  } = useData();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
    
    const report = generateReport();
    setStats(report);
  };

  const handleBanUser = (userId) => {
    if (window.confirm('Are you sure you want to ban this user?')) {
      banUser(userId);
      loadDashboardData();
    }
  };

  const handleDeleteSwapRequest = (requestId) => {
    if (window.confirm('Are you sure you want to delete this swap request?')) {
      deleteSwapRequest(requestId);
      loadDashboardData();
    }
  };

  const downloadReport = (format) => {
    const report = generateReport();
    const filename = `skillswap-report-${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'json') {
      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
    } else if (format === 'csv') {
      const csvData = [
        ['Metric', 'Value'],
        ['Total Users', report.totalUsers],
        ['Active Users', report.activeUsers],
        ['Banned Users', report.bannedUsers],
        ['Total Swap Requests', report.totalSwapRequests],
        ['Pending Requests', report.pendingRequests],
        ['Completed Swaps', report.completedSwaps],
        ['Total Reviews', report.totalReviews],
        ['Average Rating', report.averageRating.toFixed(2)],
        ['Generated At', report.generatedAt]
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );

  const UserRow = ({ user }) => (
    <tr>
      <td>
        <div className="user-cell">
          <div className="user-avatar">
            {user.photo ? (
              <img src={user.photo} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
  {(user.name?.charAt(0) || '?').toUpperCase()}
</div>
            )}
          </div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </div>
      </td>
      <td>{user.location}</td>
      <td>{user.skillsOffered?.length || 0}</td>
      <td>{user.skillsWanted?.length || 0}</td>
      <td>
        <span className={`status ${user.isPublic ? 'status-online' : 'status-offline'}`}>
          {user.isPublic ? 'Public' : 'Private'}
        </span>
      </td>
      <td>{formatDate(user.createdAt)}</td>
      <td>
        {!user.isBanned ? (
          <button 
            className="btn btn-danger btn-small"
            onClick={() => handleBanUser(user.id)}
          >
            Ban User
          </button>
        ) : (
          <span className="status status-offline">Banned</span>
        )}
      </td>
    </tr>
  );

  const SwapRequestRow = ({ request }) => {
    const fromUser = users.find(u => u.id === request.fromUserId);
    const toUser = users.find(u => u.id === request.toUserId);
    
    return (
      <tr>
        <td>{fromUser?.name || 'Unknown'}</td>
        <td>{toUser?.name || 'Unknown'}</td>
        <td>{request.offeredSkill}</td>
        <td>{request.requestedSkill}</td>
        <td>
          <span className={`status ${
            request.status === 'pending' ? 'status-pending' :
            request.status === 'accepted' ? 'status-online' :
            request.status === 'completed' ? 'status-online' :
            'status-offline'
          }`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </td>
        <td>{formatDate(request.createdAt)}</td>
        <td>
          <button 
            className="btn btn-danger btn-small"
            onClick={() => handleDeleteSwapRequest(request.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage users, monitor activity, and generate reports</p>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`tab-button ${activeTab === 'swaps' ? 'active' : ''}`}
            onClick={() => setActiveTab('swaps')}
          >
            Swap Requests
          </button>
          <button 
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="stats-grid">
                <StatCard 
                  title="Total Users" 
                  value={stats.totalUsers || 0} 
                  icon="👥" 
                  color="primary"
                />
                <StatCard 
                  title="Active Users" 
                  value={stats.activeUsers || 0} 
                  icon="✅" 
                  color="success"
                />
                <StatCard 
                  title="Swap Requests" 
                  value={stats.totalSwapRequests || 0} 
                  icon="🔄" 
                  color="info"
                />
                <StatCard 
                  title="Completed Swaps" 
                  value={stats.completedSwaps || 0} 
                  icon="🎯" 
                  color="warning"
                />
                <StatCard 
                  title="Total Reviews" 
                  value={stats.totalReviews || 0} 
                  icon="⭐" 
                  color="secondary"
                />
                <StatCard 
                  title="Average Rating" 
                  value={stats.averageRating?.toFixed(1) || '0.0'} 
                  icon="📊" 
                  color="info"
                />
              </div>

              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-cards">
                  <div className="activity-card">
                    <h4>New Users This Week</h4>
                    <p className="activity-value">
                      {users.filter(u => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(u.createdAt) > weekAgo;
                      }).length}
                    </p>
                  </div>
                  <div className="activity-card">
                    <h4>Pending Requests</h4>
                    <p className="activity-value">{stats.pendingRequests || 0}</p>
                  </div>
                  <div className="activity-card">
                    <h4>Banned Users</h4>
                    <p className="activity-value">{stats.bannedUsers || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <h3>User Management</h3>
                <div className="user-stats">
                  <span>Total: {users.length}</span>
                  <span>Active: {users.filter(u => !u.isBanned).length}</span>
                  <span>Banned: {users.filter(u => u.isBanned).length}</span>
                </div>
              </div>
              
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Location</th>
                      <th>Skills Offered</th>
                      <th>Skills Wanted</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <UserRow key={user.id} user={user} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'swaps' && (
            <div className="swaps-section">
              <div className="section-header">
                <h3>Swap Request Management</h3>
                <div className="swap-stats">
                  <span>Total: {swapRequests.length}</span>
                  <span>Pending: {swapRequests.filter(r => r.status === 'pending').length}</span>
                  <span>Completed: {swapRequests.filter(r => r.status === 'completed').length}</span>
                </div>
              </div>
              
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>From User</th>
                      <th>To User</th>
                      <th>Offered Skill</th>
                      <th>Requested Skill</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {swapRequests.map(request => (
                      <SwapRequestRow key={request.id} request={request} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-section">
              <h3>Generate Reports</h3>
              <div className="reports-content">
                <div className="report-options">
                  <div className="report-card">
                    <h4>Activity Report</h4>
                    <p>Comprehensive report including user statistics, swap data, and platform metrics.</p>
                    <div className="report-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => downloadReport('json')}
                      >
                        Download JSON
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => downloadReport('csv')}
                      >
                        Download CSV
                      </button>
                    </div>
                  </div>
                </div>

                <div className="report-preview">
                  <h4>Report Preview</h4>
                  <div className="report-data">
                    <pre>{JSON.stringify(stats, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;