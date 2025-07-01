import express from "express";
import {
  createBorrower,
  getBorrower,
  getBorrowers,
} from "../handlers/borrowerHandler";
import {
  createLoan,
  getLoan,
  getLoans,
  updateLoanStatus,
} from "../handlers/loanHandler";

const apiRoutes = express.Router();

// Borrower Routes
apiRoutes.post("/borrower", (req, res) => {
  createBorrower(req, res);
});
apiRoutes.get("/borrower/:id", (req, res) => {
  getBorrower(req, res);
});
apiRoutes.get("/borrowers", (req, res) => {
  getBorrowers(req, res);
});

// Loan Routes
apiRoutes.post("/loan", (req, res) => {
  createLoan(req, res);
});
apiRoutes.get("/loan/:id", (req, res) => {
  getLoan(req, res);
});
apiRoutes.get("/loan", (req, res) => {
  getLoans(req, res);
});
apiRoutes.put("/loan/:id/status", (req, res) => {
  updateLoanStatus(req, res);
});

export default apiRoutes;
