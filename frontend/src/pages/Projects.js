import React, { useState, useEffect } from 'react';
import '../styles/Projects.css';
import ProjectDetails from '../components/ProjectDetails.js';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', owner: 'user1' });
  const [selectedProject, setSelectedProject] = useState(null);

  const API_URL = process.env.REACT_APP_API_BASE_URL || '/pms/api';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.error('API returned non-array data:', data);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      const newProject = await response.json();
      setProjects([newProject, ...projects]);
      setFormData({ name: '', description: '', owner: 'user1' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      setProjects(projects.filter(p => p._id !== id));
      setSelectedProject(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleProjectUpdate = async (updatedProject) => {
    try {
      const response = await fetch(`${API_URL}/api/projects/${updatedProject._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedProject)
      });
      const updated = await response.json();
      setProjects(projects.map(p => p._id === updatedProject._id ? updated : p));
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="projects-page">
      <div className="header">
        <h1>Projects</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <form className="project-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}

      <div className="projects-grid">
        {projects.length === 0 ? (
          <p className="empty">No projects yet. Create one to get started!</p>
        ) : (
          projects.map(project => (
            <div
              key={project._id}
              className="project-card"
              onClick={() => setSelectedProject(project)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-header" style={{ borderTopColor: project.color }}>
                <h3>{project.name}</h3>
                <span className={`status status-${project.status}`}>{project.status}</span>
              </div>
              <p className="description">{project.description}</p>
              <div className="card-footer">
                <small>Owner: {project.owner}</small>
                <div className="actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-small" onClick={() => setSelectedProject(project)}>View</button>
                  <button className="btn-small btn-danger" onClick={() => handleDelete(project._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={handleProjectUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
