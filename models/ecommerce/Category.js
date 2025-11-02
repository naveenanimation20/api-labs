// models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'categories',
  timestamps: true,
  hooks: {
    beforeCreate: (category) => {
      if (!category.slug) {
        category.slug = category.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    }
  }
});

// Associations
Category.associate = (models) => {
  Category.hasMany(models.Product, {
    foreignKey: 'categoryId',
    as: 'products'
  });
  Category.belongsTo(models.Category, {
    foreignKey: 'parentId',
    as: 'parent'
  });
  Category.hasMany(models.Category, {
    foreignKey: 'parentId',
    as: 'children'
  });
};

module.exports = Category;