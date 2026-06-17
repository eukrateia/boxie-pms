import express from 'express';
import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { createNotification } from './notifications.js';

const router = express.Router({ mergeParams: true });

// Get all comments for a task
router.get('/', async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await Comment.find({ taskId })
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create comment
router.post('/', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text required' });
    }

    // Get user info
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get task to find who to notify
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Extract mentions from text (format: @userId or @email)
    const mentionRegex = /@([a-zA-Z0-9._@-]+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const mention = match[1];
      // Try to find user by email or username
      const mentionedUser = await User.findOne({
        $or: [
          { email: mention },
          { name: mention }
        ]
      });

      if (mentionedUser) {
        mentions.push({
          userId: mentionedUser._id,
          userEmail: mentionedUser.email
        });
      }
    }

    const comment = new Comment({
      taskId,
      userId: req.userId,
      userName: user.name,
      userEmail: user.email,
      text,
      mentions
    });

    await comment.save();

    // Notify task assignee
    if (task.assignedTo && task.assignedTo.toString() !== req.userId) {
      await createNotification(task.assignedTo, {
        type: 'task-comment',
        title: `${user.name} commented on "${task.title}"`,
        message: text.substring(0, 100),
        relatedTaskId: task._id,
        relatedProjectId: task.projectId,
        createdBy: user.email
      });
    }

    // Notify mentioned users
    for (const mention of mentions) {
      if (mention.userId.toString() !== req.userId) {
        await createNotification(mention.userId, {
          type: 'task-mentioned',
          title: `${user.name} mentioned you in "${task.title}"`,
          message: text.substring(0, 100),
          relatedTaskId: task._id,
          relatedProjectId: task.projectId,
          createdBy: user.email
        });
      }
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update comment
router.put('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text required' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Only comment author can edit
    if (comment.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to edit this comment' });
    }

    comment.text = text;
    comment.updatedAt = new Date();
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete comment
router.delete('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Only comment author can delete
    if (comment.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
