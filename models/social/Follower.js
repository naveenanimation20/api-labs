// ==================== models/social/Follower.js ====================
const Follower = sequelize.define('Follower', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  followerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  followingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted'),
    defaultValue: 'accepted'
  }
}, {
  tableName: 'followers',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['followerId', 'followingId']
    }
  ]
});

Follower.associate = (models) => {
  Follower.belongsTo(models.User, { foreignKey: 'followerId', as: 'follower' });
  Follower.belongsTo(models.User, { foreignKey: 'followingId', as: 'following' });
};

module.exports = Follower;