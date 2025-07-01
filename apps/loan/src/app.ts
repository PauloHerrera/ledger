import express from "express";
import apiRoutes from "./presentation/routes/apiRoutes";
import cors from "cors";
import { env } from "./config/env";

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
  res.send("LOAN_SERVICE_IS_READY");
});

app.use("/api", apiRoutes);

app.listen(env.PORT, () => {
  console.log(`Loan service is running on port ${env.PORT}`);
});