import express from "express";
import apiRoutes from "./routes/apiRoutes";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.ADMIN_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

apiRoutes.get("/", (req, res) => {
  res.send("SERVER_IS_READY");
});

app.use("/api", apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
