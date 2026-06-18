import { useState } from 'react';
import Comments from './Comments.js';
import '../styles/TaskDetails.css';

export default function TaskDetails({ task, onClose, onStatusChange, currentUserId, onTaskUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const priorityColors = {
    low: '#10b981',
    medium: '#3b82f6',
    high: '#f59e0b',
    urgent: '#ef4444'
  };

  const statusOptions = ['todo', 'in-progress', 'in-review', 'done'];

  const handleStatusChange = (newStatus) => {
    onStatusChange(task._id, newStatus);
    setEditedTask({ ...editedTask, status: newStatus });
  };

  const handleSave = () => {
    const taskToSave = {
      ...editedTask,
      dueDate: editedTask.dueDate ? new Date(editedTask.dueDate).toISOString() : null
    };
    onTaskUpdate(taskToSave);
    setIsEditing(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="task-details-overlay" onClick={onClose}>
      <div className="task-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-details-header">
          <div className="task-details-title">
            {isEditing ? (
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="edit-title-input"
              />
            ) : (
              <h2>{task.title}</h2>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="task-details-body">
          <div className="task-details-main">
            {/* Task Info Grid */}
            <div className="task-info-grid">
              <div className="info-item">
                <label>Status</label>
                <select
                  value={editedTask.status}
                  onChange={(e) => {
                    handleStatusChange(e.target.value);
                    setEditedTask({ ...editedTask, status: e.target.value });
                  }}
                  className="status-select"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="info-item">
                <label>Priority</label>
                <select
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                  disabled={!isEditing}
                  className="priority-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                {editedTask.priority && (
                  <span
                    className="priority-badge"
                    style={{ backgroundColor: priorityColors[editedTask.priority] }}
                  >
                    {editedTask.priority}
                  </span>
                )}
              </div>

              <div className="info-item">
                <label>Created</label>
                <div className="info-value">{formatDate(task.createdAt)}</div>
              </div>

              <div className="info-item">
                <label>Due Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedTask.dueDate ? editedTask.dueDate.split('T')[0] : ''}
                    onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                  />
                ) : (
                  <div className="info-value">
                    {editedTask.dueDate ? formatDate(editedTask.dueDate) : 'Not set'}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <label>Description</label>
              {isEditing ? (
                <textarea
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  rows="4"
                  className="description-edit"
                />
              ) : (
                <div className="description-view">
                  {editedTask.description || 'No description'}
                </div>
              )}
            </div>

            {/* Edit/Save Buttons */}
            <div className="task-actions">
              {isEditing ? (
                <>
                  <button className="btn-save" onClick={handleSave}>Save Changes</button>
                  <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                </>
              ) : (
                <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Task</button>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="task-details-comments">
            <Comments
              taskId={task._id}
              taskTitle={task.title}
              assignedTo={task.assignedTo}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
