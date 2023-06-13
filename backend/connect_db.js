/**
 * Requiring this file will connect to the database and return the
 * Sequelize database connection object.
 */

const Sequelize = require('sequelize');

const dbConfig = {
  host: process.env.MYSQL_REMOTE_HOST,
  port: process.env.MYSQL_REMOTE_PORT,
  // here we are selecting mysql as the database type we will be using
  dialect: 'mysql'
};

// Here we connect to the database
const db = new Sequelize(
  'development_db',
  process.env.MYSQL_USER,
  process.env.MYSQL_PASS,
  dbConfig);

module.exports = db;
