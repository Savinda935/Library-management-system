import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import LibraryDashboard from './pages/LibraryDashboard';
import Books from './pages/Books';
import Profile from './pages/profile';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const isAuthed = !!localStorage.getItem('token');

  const RequireAuth = ({ children }) => {
    return isAuthed ? children : <Navigate to="/login" replace />;
  };

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<RequireAuth><LibraryDashboard /></RequireAuth>} />
        <Route path="/books" element={<RequireAuth><Books /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;