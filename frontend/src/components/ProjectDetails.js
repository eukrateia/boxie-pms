import { useState, useEffect } from 'react';
import '../styles/ProjectDetails.css';

export default function ProjectDetails({ project, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const statusOptions = ['planning', 'active', 'on-hold', 'completed', 'archived'];

  useEffect(() => {
    fetchProjectTasks();
  }, [project._id]);

  const fetchProjectTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks?projectId=${project._id}`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');

      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    onUpdate(editedProject);
    setIsEditing(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length
    };
  };

  const stats = getTaskStats();

  return (
    <div className="project-details-overlay" onClick={onClose}>
      <div className="project-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="project-details-header">
          <div className="project-header-info">
            {isEditing ? (
              <input
                type="text"
                value={editedProject.name}
                onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                className="edit-name-input"
              />
            ) : (
              <h2>{project.name}</h2>
            )}
            <div className="project-status-badge" style={{ borderTopColor: project.color }}>
              {project.status}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="project-details-body">
          {/* Project Info */}
          <div className="project-info-section">
            <div className="info-grid">
              <div className="info-item">
                <label>Status</label>
                {isEditing ? (
                  <select
                    value={editedProject.status}
                    onChange={(e) => setEditedProject({ ...editedProject, status: e.target.value })}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                ) : (
                  <div className="info-value">{project.status}</div>
                )}
              </div>

              <div className="info-item">
                <label>Color</label>
                {isEditing ? (
                  <input
                    type="color"
                    value={editedProject.color}
                    onChange={(e) => setEditedProject({ ...editedProject, color: e.target.value })}
                  />
                ) : (
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: project.color }}
                  />
                )}
              </div>

              <div className="info-item">
                <label>Created</label>
                <div className="info-value">{formatDate(project.createdAt)}</div>
              </div>

              <div className="info-item">
                <label>Owner</label>
                <div className="info-value">{project.owner}</div>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <label>Description</label>
              {isEditing ? (
                <textarea
                  value={editedProject.description}
                  onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                  rows="3"
                />
              ) : (
                <div className="description-view">
                  {project.description || 'No description'}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="project-actions">
              {isEditing ? (
                <>
                  <button className="btn-save" onClick={handleSave}>Save Changes</button>
                  <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Project</button>
                  <button className="btn-delete" onClick={() => {
                    if (window.confirm('Delete this project?')) {
                      onDelete(project._id);
                    }
                  }}>Delete Project</button>
                </>
              )}
            </div>
          </div>

          {/* Project Stats & Tasks */}
          <div className="project-tasks-section">
            <div className="tasks-header">
              <h3>Tasks</h3>
              <div className="task-stats">
                <span className="stat">
                  <strong>{stats.total}</strong> Total
                </span>
                <span className="stat">
                  <strong>{stats.todo}</strong> To Do
                </span>
                <span className="stat">
                  <strong>{stats.inProgress}</strong> In Progress
                </span>
                <span className="stat done">
                  <strong>{stats.done}</strong> Done
                </span>
              </div>
            </div>

            {loading ? (
              <div className="loading-tasks">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="empty-tasks">No tasks in this project yet</div>
            ) : (
              <div className="tasks-list">
                {tasks.map(task => (
                  <div key={task._id} className="task-item">
                    <div className="task-item-header">
                      <h4>{task.title}</h4>
                      <span className={`status-tag status-${task.status}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="task-item-desc">{task.description}</p>
                    <div className="task-item-meta">
                      <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
