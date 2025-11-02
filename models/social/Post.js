// ==================== models/social/Post.js ====================
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  commentsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'posts',
  timestamps: true
});

Post.associate = (models) => {
  Post.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Post.hasMany(models.Comment, { foreignKey: 'postId', as: 'comments' });
  Post.hasMany(models.Like, { foreignKey: 'postId', as: 'likes' });
};

module.exports = Post;