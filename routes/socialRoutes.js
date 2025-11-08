// routes/socialRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');

const {
  postValidation,
  commentValidation,
  messageValidation
} = require('../middleware/validators');


const {
  // Posts
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  // Comments
  getPostComments,
  createComment,
  updateComment,
  deleteComment,
  // Likes
  likePost,
  unlikePost,
  getPostLikes,
  likeComment,
  unlikeComment,
  // Followers
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  // Messages
  getAllMessages,
  getConversation,
  sendMessage,
  deleteMessage,
  markAsRead,
  // Notifications
  getAllNotifications,
  markNotificationRead,
  clearAllNotifications
} = require('../controllers/socialController');

// ============= POSTS ROUTES =============

/**
 * @swagger
 * /api/v1/social/posts:
 *   get:
 *     summary: Get all posts (feed)
 *     tags: [Social Media - Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get('/posts', optionalAuth, getAllPosts);
router.head('/posts', optionalAuth, getAllPosts);

router.get('/posts/:id', optionalAuth, getPostById);
router.post('/posts', authenticate, postValidation, createPost);
router.put('/posts/:id', authenticate, updatePost);
router.patch('/posts/:id', authenticate, updatePost);
router.delete('/posts/:id', authenticate, deletePost);
router.get('/users/:userId/posts', optionalAuth, getUserPosts);
router.options('/posts', (req, res) => res.sendStatus(200));

// ============= COMMENTS ROUTES =============

router.get('/posts/:postId/comments', optionalAuth, getPostComments);
router.post('/posts/:postId/comments', authenticate, commentValidation, createComment);
router.put('/comments/:id', authenticate, updateComment);
router.patch('/comments/:id', authenticate, updateComment);
router.delete('/comments/:id', authenticate, deleteComment);
router.options('/posts/:postId/comments', (req, res) => res.sendStatus(200));

// ============= LIKES ROUTES =============

router.post('/posts/:postId/like', authenticate, likePost);
router.delete('/posts/:postId/like', authenticate, unlikePost);
router.get('/posts/:postId/likes', optionalAuth, getPostLikes);
router.post('/comments/:commentId/like', authenticate, likeComment);
router.delete('/comments/:commentId/like', authenticate, unlikeComment);
router.options('/posts/:postId/like', (req, res) => res.sendStatus(200));

// ============= FOLLOWERS ROUTES =============

/**
 * @swagger
 * /api/v1/social/users/{userId}/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Social Media - Followers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User followed
 */
router.post('/users/:userId/follow', authenticate, followUser);
router.delete('/users/:userId/follow', authenticate, unfollowUser);
router.get('/users/:userId/followers', optionalAuth, getFollowers);
router.get('/users/:userId/following', optionalAuth, getFollowing);
router.options('/users/:userId/follow', (req, res) => res.sendStatus(200));

// ============= MESSAGES ROUTES =============

router.get('/messages', authenticate, getAllMessages);
router.get('/messages/:userId', authenticate, getConversation);
router.post('/messages', authenticate, messageValidation, sendMessage);
router.delete('/messages/:id', authenticate, deleteMessage);
router.patch('/messages/:id/read', authenticate, markAsRead);
router.options('/messages', (req, res) => res.sendStatus(200));

// ============= NOTIFICATIONS ROUTES =============

router.get('/notifications', authenticate, getAllNotifications);
router.patch('/notifications/:id/read', authenticate, markNotificationRead);
router.delete('/notifications', authenticate, clearAllNotifications);
router.options('/notifications', (req, res) => res.sendStatus(200));

module.exports = router;