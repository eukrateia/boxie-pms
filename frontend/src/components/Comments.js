import { useState, useEffect } from 'react';
import '../styles/Comments.css';

export default function Comments({ taskId, taskTitle, assignedTo, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const API_URL = process.env.REACT_APP_API_BASE_URL || '/pms/api';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/comments`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch comments');

      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text: newComment })
      });

      if (!response.ok) throw new Error('Failed to add comment');

      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdate = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const response = await fetch(
        `${API_URL}/tasks/${taskId}/comments/${commentId}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ text: editText })
        }
      );

      if (!response.ok) throw new Error('Failed to update comment');

      const updated = await response.json();
      setComments(comments.map(c => c._id === commentId ? updated : c));
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const response = await fetch(
        `${API_URL}/tasks/${taskId}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) throw new Error('Failed to delete comment');

      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diff = Math.floor((now - commentDate) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return commentDate.toLocaleDateString();
  };

  const highlightMentions = (text) => {
    return text.replace(/@([a-zA-Z0-9._@-]+)/g, '<span class="mention">@$1</span>');
  };

  if (loading) return <div className="comments-loading">Loading comments...</div>;

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>Comments ({comments.length})</h3>
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Add a comment... (use @email to mention someone)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="3"
        />
        <button type="submit" className="btn-comment-submit">
          Post Comment
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="empty-comments">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  <strong>{comment.userName}</strong>
                  <span className="comment-time">{formatTime(comment.createdAt)}</span>
                </div>
                {comment.userId === currentUserId && (
                  <div className="comment-actions">
                    {editingId !== comment._id && (
                      <>
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setEditingId(comment._id);
                            setEditText(comment.text);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(comment._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {editingId === comment._id ? (
                <div className="comment-edit">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows="3"
                  />
                  <div className="edit-buttons">
                    <button
                      className="btn-save"
                      onClick={() => handleUpdate(comment._id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => {
                        setEditingId(null);
                        setEditText('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="comment-text"
                  dangerouslySetInnerHTML={{ __html: highlightMentions(comment.text) }}
                />
              )}

              {comment.mentions && comment.mentions.length > 0 && (
                <div className="comment-mentions">
                  Mentions: {comment.mentions.map(m => m.userEmail).join(', ')}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
