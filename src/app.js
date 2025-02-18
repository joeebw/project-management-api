import process from "process";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { setupRoutes } from "./routes/index.js";
import sequelize from "./config/database.js";
import dotenv from "dotenv";
import keepAliveService from "./services/keepAlive.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));

// Routes
setupRoutes(app);

// Keep-alive endpoint
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

console.log("process.env.DB_NAME", process.env.DB_NAME);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await sequelize.sync({ force: false });
    console.log("Synchronized database");

    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);

      const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;
      keepAliveService.start(`${serverUrl}/ping`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

console.log("running app.js");

startServer();
