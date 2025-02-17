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
  start_date: {
    type: DataTypes.TEXT,
    defaultValue: () => new Date().toISOString(),
    get() {
      return this.getDataValue("start_date")
        ? new Date(this.getDataValue("start_date"))
        : null;
    },
    set(value) {
      this.setDataValue(
        "start_date",
        value ? new Date(value).toISOString() : null
      );
    },
  },
  end_date: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return this.getDataValue("end_date")
        ? new Date(this.getDataValue("end_date"))
        : null;
    },
    set(value) {
      this.setDataValue(
        "end_date",
        value ? new Date(value).toISOString() : null
      );
    },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "to_do",
    validate: {
      isIn: [["to_do", "work_in_progress", "under_review", "completed"]],
    },
  },
  tags: {
    type: DataTypes.TEXT,
    defaultValue: "[]",
    get() {
      const rawValue = this.getDataValue("tags");
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue("tags", JSON.stringify(value));
    },
  },
  assignees: {
    type: DataTypes.TEXT,
    defaultValue: "[]",
    get() {
      const rawValue = this.getDataValue("assignees");
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue("assignees", JSON.stringify(value));
    },
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: "medium",
    validate: {
      isIn: [["low", "medium", "high"]],
    },
  },
});

Task.belongsTo(Project);
Project.hasMany(Task);
export default Task;
