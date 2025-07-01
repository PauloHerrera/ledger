import z from "zod";

export const LOAN_STATUSES = [
  "pending",
  "cancelled",
  "lent",
  "settled",
] as const;

export const loanSchema = z.object({
  amount: z.number().positive({ message: "Amount must be a positive number" }),
  interestRate: z
    .number()
    .min(0, { message: "Interest rate must be a non-negative number" }),
  borrowerId: z.string().uuid({ message: "Invalid borrower id" }),
  borrowerName: z.string().min(1, { message: "Borrower name is required" }),
  borrowerDocument: z
    .string()
    .min(1, { message: "Borrower document is required" }),
  status: z.enum(LOAN_STATUSES).optional().default("pending"),
});

export const updateLoanStatusSchema = z.object({
  status: z.enum(LOAN_STATUSES, {
    message: "Invalid loan status",
  }),
});

export type LoanDTO = z.infer<typeof loanSchema>;
export type UpdateLoanStatusDTO = z.infer<typeof updateLoanStatusSchema>;
