import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import TimelineManager from './components/TimelineManager';
import TimelineView from './components/TimelineView';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/login" 
            element={!token ? <Auth setToken={setToken} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={token ? <TimelineManager onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/timeline/:id" 
            element={token ? <TimelineView onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
