import { router as authRouter } from "./auth.router.js";
import { router as taskRouter } from "./task.router.js";
import { router as projectRouter } from "./project.router.js";

export const setupRoutes = (app) => {
  app.use("/auth", authRouter);
  app.use("/task", taskRouter);
  app.use("/project", projectRouter);
};
