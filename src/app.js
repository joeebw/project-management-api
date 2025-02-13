import process from "process";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { setupRoutes } from "./routes/index.js";
import sequelize from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
setupRoutes(app);

console.log("process.env.DB_NAME", process.env.DB_NAME);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await sequelize.sync({ force: false });
    console.log("Synchronized database");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

console.log("running app.js");

startServer();
