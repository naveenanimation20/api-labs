// controllers/socialController.js
const { Op } = require('sequelize');
const { Post, Comment, Like, Follower, Message, Notification, User } = require('../models');

// ============= POSTS =============
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      limit: parseInt(limit),
      offset,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      posts: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'avatar'] },
        { model: Comment, as: 'comments' }
      ]
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create post' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    await post.update(req.body);
    res.json({ message: 'Post updated', post });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']]
    });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
};

// ============= COMMENTS =============
exports.getPostComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

exports.createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      ...req.body,
      userId: req.user.id,
      postId: req.params.postId
    });

    // Increment comment count
    await Post.increment('commentsCount', { where: { id: req.params.postId } });

    res.status(201).json({ message: 'Comment created', comment });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create comment' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    await comment.update(req.body);
    res.json({ message: 'Comment updated', comment });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update comment' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    
    // Decrement comment count
    await Post.decrement('commentsCount', { where: { id: comment.postId } });
    
    await comment.destroy();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

// ============= LIKES =============
exports.likePost = async (req, res) => {
  try {
    const existing = await Like.findOne({
      where: { userId: req.user.id, postId: req.params.postId }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Post already liked' });
    }

    await Like.create({
      userId: req.user.id,
      postId: req.params.postId
    });

    // Increment likes count
    await Post.increment('likesCount', { where: { id: req.params.postId } });

    res.json({ message: 'Post liked' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to like post' });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const like = await Like.findOne({
      where: { userId: req.user.id, postId: req.params.postId }
    });
    
    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }

    await like.destroy();
    
    // Decrement likes count
    await Post.decrement('likesCount', { where: { id: req.params.postId } });

    res.json({ message: 'Post unliked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlike post' });
  }
};

exports.getPostLikes = async (req, res) => {
  try {
    const likes = await Like.findAll({
      where: { postId: req.params.postId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }]
    });
    res.json({ likes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const existing = await Like.findOne({
      where: { userId: req.user.id, commentId: req.params.commentId }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Comment already liked' });
    }

    await Like.create({
      userId: req.user.id,
      commentId: req.params.commentId
    });

    // Increment likes count
    await Comment.increment('likesCount', { where: { id: req.params.commentId } });

    res.json({ message: 'Comment liked' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to like comment' });
  }
};

exports.unlikeComment = async (req, res) => {
  try {
    const like = await Like.findOne({
      where: { userId: req.user.id, commentId: req.params.commentId }
    });
    
    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }

    await like.destroy();
    
    // Decrement likes count
    await Comment.decrement('likesCount', { where: { id: req.params.commentId } });

    res.json({ message: 'Comment unliked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlike comment' });
  }
};

// ============= FOLLOWERS =============
exports.followUser = async (req, res) => {
  try {
    if (req.user.id === req.params.userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const existing = await Follower.findOne({
      where: { followerId: req.user.id, followingId: req.params.userId }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    await Follower.create({
      followerId: req.user.id,
      followingId: req.params.userId
    });

    res.json({ message: 'User followed' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to follow user' });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const follower = await Follower.findOne({
      where: { followerId: req.user.id, followingId: req.params.userId }
    });
    
    if (!follower) {
      return res.status(404).json({ error: 'Not following this user' });
    }

    await follower.destroy();
    res.json({ message: 'User unfollowed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const followers = await Follower.findAll({
      where: { followingId: req.params.userId },
      include: [{ model: User, as: 'follower', attributes: ['id', 'name', 'avatar'] }]
    });
    res.json({ followers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const following = await Follower.findAll({
      where: { followerId: req.params.userId },
      include: [{ model: User, as: 'following', attributes: ['id', 'name', 'avatar'] }]
    });
    res.json({ following });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch following' });
  }
};

// ============= MESSAGES =============
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      order: [['createdAt', 'DESC']]
    });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id, receiverId: req.params.userId },
          { senderId: req.params.userId, receiverId: req.user.id }
        ]
      },
      order: [['createdAt', 'ASC']]
    });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      senderId: req.user.id,
      receiverId: req.body.receiverId,
      content: req.body.content
    });

    // Real-time notification
    const io = req.app.get('io');
    io.to(`user_${req.body.receiverId}`).emit('message_received', message);

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    res.status(400).json({ error: 'Failed to send message' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findOne({
      where: { id: req.params.id, senderId: req.user.id }
    });
    if (!message) return res.status(404).json({ error: 'Message not found' });
    await message.destroy();
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findOne({
      where: { id: req.params.id, receiverId: req.user.id }
    });
    if (!message) return res.status(404).json({ error: 'Message not found' });
    message.isRead = true;
    message.readAt = new Date();
    await message.save();
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};

// ============= NOTIFICATIONS =============
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

exports.clearAllNotifications = async (req, res) => {
  try {
    await Notification.destroy({
      where: { userId: req.user.id }
    });
    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
};



