const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 5);
        user.password = hashedPassword;
      },
    },
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("Tables synced.");
  })
  .catch((error) => {
    console.error("Error syncing tables:", error);
  });

module.exports = User;
