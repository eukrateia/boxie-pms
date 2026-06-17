import React from 'react';
import '../styles/NotificationDisplay.css';

export function NotificationDisplay({ notification, onClose }) {
  if (!notification) return null;

  return (
    <div className={`notification-display ${notification.type}`}>
      <div className="notification-content">
        {notification.type === 'error' && <span>❌</span>}
        {notification.type === 'success' && <span>✅</span>}
        {notification.type === 'warning' && <span>⚠️</span>}
        <span>{notification.message}</span>
      </div>
      <button className="notification-close" onClick={onClose}>×</button>
    </div>
  );
}
