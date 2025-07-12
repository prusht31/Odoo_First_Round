import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Search from './pages/Search/Search';
import SwapRequests from './pages/SwapRequests/SwapRequests';
import { useEffect } from "react";
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';

function App() {

  useEffect(() => {
    const script = document.createElement("script");
    script.id = "3Lrm8TDSDZYJIYtvXR6QB";
    script.src = "https://www.chatbase.co/embed.min.js";
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);
  }, []);
  
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/search" 
                  element={
                    <ProtectedRoute>
                      <Search />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/swap-requests" 
                  element={
                    <ProtectedRoute>
                      <SwapRequests />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;