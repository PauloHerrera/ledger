import express from "express";
import {
  getAccount,
  createAccount,
  getAccounts,
} from "../handlers/accountHandler";
import { createLedger, getLedger, getLedgers } from "../handlers/ledgerHandler";
import { createJournal } from "../handlers/journalHandler";

const apiRoutes = express.Router();

// Account Routes
apiRoutes.post("/account", (req, res) => {
  createAccount(req, res);
});
apiRoutes.get("/account/:id", (req, res) => {
  getAccount(req, res);
});
apiRoutes.get("/accounts", (req, res) => {
  getAccounts(req, res);
});

// Ledger Routes
apiRoutes.post("/ledger", (req, res) => {
  createLedger(req, res);
});
apiRoutes.get("/ledger/:id", (req, res) => {
  getLedger(req, res);
});
apiRoutes.get("/ledgers", (req, res) => {
  getLedgers(req, res);
});

// Journal Routes
apiRoutes.post("/journal", (req, res) => {
  createJournal(req, res);
});

export default apiRoutes;
