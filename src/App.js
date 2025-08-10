import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Protected from './components/Protected';
import Navbar from './components/Navbar';
import EmailScheduler from './components/EmailScheduler';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('access'));

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setLoggedIn(false);
  };

  return (
    <Router>
      <Navbar loggedIn={loggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
        <Route
          path="/protected"
          element={loggedIn ? <Protected /> : <Navigate to="/login" />}
        />
        <Route
          path="/schedule"
          element={loggedIn ? <EmailScheduler /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
    </Router>
  );
}

export default App;
