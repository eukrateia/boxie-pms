import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Projects from './pages/Projects.js';
import Tasks from './pages/Tasks.js';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js';
import Notifications from './components/Notifications.js';

export const AuthContext = React.createContext(null);

function AppContent() {
  const [currentPage, setCurrentPage] = useState('projects');
  const [user, setUser] = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-logo">📋 PMS</h1>
          <ul className="nav-menu">
            <li>
              <button
                className={`nav-link ${currentPage === 'projects' ? 'active' : ''}`}
                onClick={() => setCurrentPage('projects')}
              >
                Projects
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${currentPage === 'tasks' ? 'active' : ''}`}
                onClick={() => setCurrentPage('tasks')}
              >
                Tasks
              </button>
            </li>
            <li>
              <Notifications />
            </li>
            <li className="user-info">
              {user && (
                <>
                  <span>{user.name}</span>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'projects' && <Projects />}
        {currentPage === 'tasks' && <Tasks />}
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={[user, setUser]}>
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<AppContent />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login onLogin={setUser} />} />
              <Route path="/signup" element={<Signup onLogin={setUser} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
