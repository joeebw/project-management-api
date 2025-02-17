import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Task from "./Task.js";

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.TEXT,
    defaultValue: () => new Date().toISOString(),
  },
  updatedAt: {
    type: DataTypes.TEXT,
    defaultValue: () => new Date().toISOString(),
  },
});

Comment.belongsTo(User);
Comment.belongsTo(Task);
Task.hasMany(Comment);
User.hasMany(Comment);

export default Comment;
