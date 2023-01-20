const Sequelize = require("sequelize");

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  host: HOST,
  dialect: mysql,
  operatorsAliases: false,

  pool: {
    max: 5,     
    min: 0,     
    idle: 10000
  }
});

const db = {
    Sequelize,
    sequelize,
};

module.exports = db;