import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Seed default admin user if not present
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.find(u => u.email === 'admin@skillswap.com');

    if (!adminExists) {
      const adminUser = {
        id: 'admin-id',
        email: 'admin@skillswap.com',
        password: 'admin123',
        createdAt: new Date().toISOString(),
        name: 'Admin User',
        isAdmin: true,
        isPublic: false,
        skillsOffered: [],
        skillsWanted: [],
        availability: [],
        rating: 0,
        totalRatings: 0,
        isBanned: false,
      };
      users.push(adminUser);
      localStorage.setItem('users', JSON.stringify(users));
    }

    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      isAdmin: userData.email === 'admin@skillswap.com',
      isPublic: true,
      skillsOffered: [],
      skillsWanted: [],
      availability: [],
      rating: 0,
      totalRatings: 0,
      isBanned: false,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updatedData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem('users', JSON.stringify(users));

      const updatedUser = { ...users[userIndex] };
      delete updatedUser.password;
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      return { success: true };
    }

    return { success: false, error: 'User not found' };
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
