import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const storedRequests = JSON.parse(localStorage.getItem('swapRequests') || '[]');
    const storedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    setUsers(storedUsers);
    setSwapRequests(storedRequests);
    setReviews(storedReviews);
  };

  const getAllUsers = () => {
    return users.filter(u => !u.isBanned);
  };

  const getPublicUsers = () => {
    return users.filter(u => u.isPublic && !u.isBanned && u.id !== user?.id);
  };

  const getUserById = (id) => {
    return users.find(u => u.id === id);
  };

  const searchUsers = (query, filters = {}) => {
    let filteredUsers = getPublicUsers();

    if (query) {
      filteredUsers = filteredUsers.filter(u => 
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.location.toLowerCase().includes(query.toLowerCase()) ||
        u.skillsOffered.some(skill => skill.toLowerCase().includes(query.toLowerCase())) ||
        u.skillsWanted.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (filters.location) {
      filteredUsers = filteredUsers.filter(u => 
        u.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.skill) {
      filteredUsers = filteredUsers.filter(u => 
        u.skillsOffered.some(skill => skill.toLowerCase().includes(filters.skill.toLowerCase()))
      );
    }

    if (filters.availability && filters.availability.length > 0) {
      filteredUsers = filteredUsers.filter(u => 
        filters.availability.some(avail => u.availability.includes(avail))
      );
    }

    return filteredUsers;
  };

  const sendSwapRequest = (toUserId, message, offeredSkill, requestedSkill) => {
    const newRequest = {
      id: Date.now().toString(),
      fromUserId: user.id,
      toUserId,
      message,
      offeredSkill,
      requestedSkill,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedRequests = [...swapRequests, newRequest];
    setSwapRequests(updatedRequests);
    localStorage.setItem('swapRequests', JSON.stringify(updatedRequests));

    return { success: true };
  };

  const updateSwapRequest = (requestId, status) => {
    const updatedRequests = swapRequests.map(req => 
      req.id === requestId ? { ...req, status, updatedAt: new Date().toISOString() } : req
    );
    
    setSwapRequests(updatedRequests);
    localStorage.setItem('swapRequests', JSON.stringify(updatedRequests));

    return { success: true };
  };

  const getUserSwapRequests = (userId) => {
    return swapRequests.filter(req => 
      req.fromUserId === userId || req.toUserId === userId
    );
  };

  const getIncomingRequests = (userId) => {
    return swapRequests.filter(req => req.toUserId === userId && req.status === 'pending');
  };

  const getOutgoingRequests = (userId) => {
    return swapRequests.filter(req => req.fromUserId === userId);
  };

  const submitReview = (swapRequestId, rating, comment) => {
    const swapRequest = swapRequests.find(req => req.id === swapRequestId);
    if (!swapRequest) return { success: false, error: 'Swap request not found' };

    const revieweeId = swapRequest.fromUserId === user.id ? swapRequest.toUserId : swapRequest.fromUserId;
    
    const newReview = {
      id: Date.now().toString(),
      swapRequestId,
      reviewerId: user.id,
      revieweeId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));

    // Update user's average rating
    updateUserRating(revieweeId, rating);

    return { success: true };
  };

  const updateUserRating = (userId, newRating) => {
    const userReviews = reviews.filter(r => r.revieweeId === userId);
    const totalRatings = userReviews.length + 1;
    const totalScore = userReviews.reduce((sum, r) => sum + r.rating, 0) + newRating;
    const averageRating = totalScore / totalRatings;

    const updatedUsers = users.map(u => 
      u.id === userId 
        ? { ...u, rating: Math.round(averageRating * 10) / 10, totalRatings }
        : u
    );

    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const getUserReviews = (userId) => {
    return reviews.filter(r => r.revieweeId === userId);
  };

  const banUser = (userId) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isBanned: true } : u
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const deleteSwapRequest = (requestId) => {
    const updatedRequests = swapRequests.filter(req => req.id !== requestId);
    setSwapRequests(updatedRequests);
    localStorage.setItem('swapRequests', JSON.stringify(updatedRequests));
  };

  const generateReport = () => {
    const report = {
      totalUsers: users.length,
      activeUsers: users.filter(u => !u.isBanned).length,
      bannedUsers: users.filter(u => u.isBanned).length,
      totalSwapRequests: swapRequests.length,
      pendingRequests: swapRequests.filter(r => r.status === 'pending').length,
      completedSwaps: swapRequests.filter(r => r.status === 'completed').length,
      totalReviews: reviews.length,
      averageRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0,
      generatedAt: new Date().toISOString()
    };

    return report;
  };

  const value = {
    users,
    swapRequests,
    reviews,
    getAllUsers,
    getPublicUsers,
    getUserById,
    searchUsers,
    sendSwapRequest,
    updateSwapRequest,
    getUserSwapRequests,
    getIncomingRequests,
    getOutgoingRequests,
    submitReview,
    getUserReviews,
    banUser,
    deleteSwapRequest,
    generateReport,
    loadData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};