import React, { useState, useEffect } from 'react';
import '../styles/Tasks.css';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    status: 'todo',
    createdBy: 'user1'
  });

  const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        fetch(`${API_URL}/api/tasks`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/projects`, { headers: getAuthHeaders() })
      ]);

      if (!tasksRes.ok || !projectsRes.ok) {
        throw new Error(`API error: tasks=${tasksRes.status}, projects=${projectsRes.status}`);
      }

      const tasksData = await tasksRes.json();
      const projectsData = await projectsRes.json();

      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setTasks([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectId) {
      alert('Please select a project');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      setFormData({
        title: '',
        description: '',
        projectId: '',
        priority: 'medium',
        status: 'todo',
        createdBy: 'user1'
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      const updated = await response.json();
      setTasks(tasks.map(t => t._id === taskId ? updated : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getProjectName = (projectId) => {
    return projects.find(p => p._id === projectId)?.name || 'Unknown Project';
  };

  if (loading) return <div className="loading">Loading tasks...</div>;

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const inReviewTasks = tasks.filter(t => t.status === 'in-review');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="tasks-page">
      <div className="header">
        <h1>Tasks</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showForm && (
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <select
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            required
          >
            <option value="">Select a project</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}

      <div className="board">
        <div className="column">
          <div className="column-header">
            <h3>To Do ({todoTasks.length})</h3>
          </div>
          <div className="tasks-list">
            {todoTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                projectName={getProjectName(task.projectId)}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>

        <div className="column">
          <div className="column-header">
            <h3>In Progress ({inProgressTasks.length})</h3>
          </div>
          <div className="tasks-list">
            {inProgressTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                projectName={getProjectName(task.projectId)}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>

        <div className="column">
          <div className="column-header">
            <h3>In Review ({inReviewTasks.length})</h3>
          </div>
          <div className="tasks-list">
            {inReviewTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                projectName={getProjectName(task.projectId)}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>

        <div className="column">
          <div className="column-header">
            <h3>Done ({doneTasks.length})</h3>
          </div>
          <div className="tasks-list">
            {doneTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                projectName={getProjectName(task.projectId)}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, projectName, onStatusChange, onDelete }) {
  const priorityColors = {
    low: '#10b981',
    medium: '#3b82f6',
    high: '#f59e0b',
    urgent: '#ef4444'
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h4>{task.title}</h4>
        <span className="priority" style={{ backgroundColor: priorityColors[task.priority] }}>
          {task.priority}
        </span>
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-meta">
        <small>{projectName}</small>
      </div>
      <div className="task-actions">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="status-select"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="in-review">In Review</option>
          <option value="done">Done</option>
        </select>
        <button className="btn-delete" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </div>
  );
}
