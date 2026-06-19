import React from 'react';
import '../styles/SidePanel.css';

export default function SidePanel({ isOpen, onClose, children, title }) {
  return (
    <>
      {isOpen && <div className="side-panel-overlay" onClick={onClose} />}
      <div className={`side-panel ${isOpen ? 'open' : ''}`}>
        <div className="side-panel-header">
          <h2>{title}</h2>
          <button className="side-panel-close" onClick={onClose}>✕</button>
        </div>
        <div className="side-panel-content">
          {children}
        </div>
      </div>
    </>
  );
}
