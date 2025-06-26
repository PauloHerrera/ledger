import express from "express";
import {
  getAccount,
  createAccount,
  getAccounts,
} from "../handlers/accountHandler";

const apiRoutes = express.Router();

apiRoutes.post("/account", createAccount);
apiRoutes.get("/account/:id", getAccount);
apiRoutes.get("/accounts", getAccounts);

export default apiRoutes;
