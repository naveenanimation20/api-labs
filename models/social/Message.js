// ==================== models/social/Message.js ====================
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'messages',
  timestamps: true
});

Message.associate = (models) => {
  Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
  Message.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
};

module.exports = Message;