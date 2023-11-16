const { Sequelize, DataTypes } = require('sequelize');
const db = require('../database');

const Post = db.define('publicacion', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cuerpo: {
    type: DataTypes.TEXT,
    allowNull: false
  },tipo: {
    type: DataTypes.TEXT,
    allowNull: false
  },fecha: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }, imagen: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'publicaciones',  // Agregamos esta línea
  timestamps: false
});

module.exports = Post;
