// ==================== models/social/Like.js ====================
const Like = sequelize.define('Like', {
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
    allowNull: true,
    references: { model: 'posts', key: 'id' }
  },
  commentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'comments', key: 'id' }
  }
}, {
  tableName: 'likes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'postId'],
      where: { postId: { [require('sequelize').Op.ne]: null } }
    },
    {
      unique: true,
      fields: ['userId', 'commentId'],
      where: { commentId: { [require('sequelize').Op.ne]: null } }
    }
  ]
});

Like.associate = (models) => {
  Like.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Like.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
  Like.belongsTo(models.Comment, { foreignKey: 'commentId', as: 'comment' });
};

module.exports = Like;