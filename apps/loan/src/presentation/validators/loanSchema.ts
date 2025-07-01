import z from "zod";

export const LOAN_STATUSES = [
  "pending",
  "cancelled",
  "lent",
  "settled",
] as const;

export const loanSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  interestRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Interest rate must be a non-negative number",
  }),
  borrowerId: z.string().uuid({ message: "Invalid borrower id" }),
  status: z.enum(LOAN_STATUSES).optional().default("pending"),
});

export const updateLoanStatusSchema = z.object({
  status: z.enum(LOAN_STATUSES, {
    message: "Invalid loan status",
  }),
});

export type LoanDTO = z.infer<typeof loanSchema>;
export type UpdateLoanStatusDTO = z.infer<typeof updateLoanStatusSchema>;