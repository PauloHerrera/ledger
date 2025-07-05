import express from "express";
import {
  getAccount,
  createAccount,
  getAccounts,
} from "../handlers/accountHandler";
import { getAccountBalances } from "../handlers/accountBalanceHandler";
import { createLedger, getLedger, getLedgers } from "../handlers/ledgerHandler";
import {
  createJournal,
  getJournal,
  getJournals,
} from "../handlers/journalHandler";
import { createLoanEvent } from "../handlers/loanEventHandler";
import {
  createTransaction,
  getTransaction,
  getTransactions,
} from "../handlers/transactionHandler";

const apiRoutes = express.Router();

// Account Routes
apiRoutes.post("/account", (req, res) => {
  createAccount(req, res);
});
apiRoutes.get("/account/:id", (req, res) => {
  getAccount(req, res);
});
apiRoutes.get("/account", (req, res) => {
  getAccounts(req, res);
});

// Ledger Routes
apiRoutes.post("/ledger", (req, res) => {
  createLedger(req, res);
});
apiRoutes.get("/ledger/:id", (req, res) => {
  getLedger(req, res);
});
apiRoutes.get("/ledger", (req, res) => {
  getLedgers(req, res);
});

// Journal Routes
apiRoutes.post("/journal", (req, res) => {
  createJournal(req, res);
});
apiRoutes.get("/journal/:id", (req, res) => {
  getJournal(req, res);
});
apiRoutes.get("/journal", (req, res) => {
  getJournals(req, res);
});

// Account Balance Routes
apiRoutes.get("/account-balance", (req, res) => {
  getAccountBalances(req, res);
});

// Loan Event Routes
apiRoutes.post("/loan-event", (req, res) => {
  createLoanEvent(req, res);
});

// Transaction Routes
apiRoutes.post("/transaction", (req, res) => {
  createTransaction(req, res);
});
apiRoutes.get("/transaction/:id", (req, res) => {
  getTransaction(req, res);
});
apiRoutes.get("/transaction", (req, res) => {
  getTransactions(req, res);
});

export default apiRoutes;
