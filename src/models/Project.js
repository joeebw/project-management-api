import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  startDate: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return this.getDataValue("startDate")
        ? new Date(this.getDataValue("startDate"))
        : null;
    },
    set(value) {
      this.setDataValue(
        "startDate",
        value ? new Date(value).toISOString() : null
      );
    },
  },
  endDate: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return this.getDataValue("endDate")
        ? new Date(this.getDataValue("endDate"))
        : null;
    },
    set(value) {
      this.setDataValue(
        "endDate",
        value ? new Date(value).toISOString() : null
      );
    },
  },
});

export default Project;
