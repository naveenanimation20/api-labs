// ==================== models/social/Comment.js ====================
const Comment = sequelize.define('Comment', {
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
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'posts', key: 'id' }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  parentCommentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'comments', key: 'id' }
  }
}, {
  tableName: 'comments',
  timestamps: true
});

Comment.associate = (models) => {
  Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Comment.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
  Comment.belongsTo(models.Comment, { foreignKey: 'parentCommentId', as: 'parentComment' });
  Comment.hasMany(models.Comment, { foreignKey: 'parentCommentId', as: 'replies' });
  Comment.hasMany(models.Like, { foreignKey: 'commentId', as: 'likes' });
};

module.exports = Comment;