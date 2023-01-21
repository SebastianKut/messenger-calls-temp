const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: 'mysql',
    // operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);

const articles = require('./article.model')(sequelize, Sequelize);

const db = {
  Sequelize,
  sequelize,
  articles,
};

module.exports = db;
