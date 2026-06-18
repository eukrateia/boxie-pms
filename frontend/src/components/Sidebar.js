import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

export default function Sidebar({ currentPage, onPageChange, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: 'projects', label: '📁 Projects', icon: '📁' },
    { id: 'tasks', label: '✓ Tasks', icon: '✓' },
  ];

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">📋 PMS</div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => {
                onPageChange(item.id);
                setIsOpen(false);
              }}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">{user?.name?.[0]?.toUpperCase() || '?'}</div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}
