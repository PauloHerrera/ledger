import express from "express";
import apiRoutes from "./presentation/routes/apiRoutes";
import cors from "cors";
import { env } from "./config/env";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.ADMIN_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("SERVER_IS_READY");
  });

  app.use("/api", apiRoutes);

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
};

createApp();
