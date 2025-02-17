import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const RefreshToken = sequelize.define("RefreshToken", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return this.getDataValue("expiresAt")
        ? new Date(this.getDataValue("expiresAt"))
        : null;
    },
    set(value) {
      this.setDataValue(
        "expiresAt",
        value ? new Date(value).toISOString() : null
      );
    },
  },
});

RefreshToken.belongsTo(User);
User.hasMany(RefreshToken);

export default RefreshToken;
