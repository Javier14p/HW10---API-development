const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('brujitas', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log
});

const db = require('./database');


module.exports = sequelize;
