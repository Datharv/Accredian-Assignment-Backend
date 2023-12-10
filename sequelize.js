const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("LMS", "root", "MYSQLath@2024", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
