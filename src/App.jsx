import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Button } from 'react-bootstrap'; // Add this import
import Login from './components/Login';
import InventoryTable from './components/InventoryTable';
import './App.css'; // Optional: Add global styles if needed

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in (e.g., using localStorage)
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); // Persist login state
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false'); // Clear login state
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/inventory" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/inventory"
          element={
            isLoggedIn ? (
              <div>
                <div className="text-end p-3">
                  <Button variant="danger" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
                <InventoryTable />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;