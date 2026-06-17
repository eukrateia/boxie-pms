import React, { useState } from 'react';
import './App.css';
import Projects from './pages/Projects.js';
import Tasks from './pages/Tasks.js';

function App() {
  const [currentPage, setCurrentPage] = useState('projects');

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

export default App;
