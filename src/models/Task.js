import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Project from "./Project.js";

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  due_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM(
      "to_do",
      "work_in_progress",
      "under_review",
      "completed"
    ),
    defaultValue: "to_do",
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  comments: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  assignees: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  priority: {
    type: DataTypes.ENUM("low", "medium", "high"),
    defaultValue: "medium",
  },
});

Task.belongsTo(Project);
Project.hasMany(Task);

export default Task;
