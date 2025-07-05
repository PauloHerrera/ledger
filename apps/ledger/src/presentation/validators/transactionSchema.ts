import { z } from "zod";

export const transactionSchema = z.object({
  eventType: z.string().min(1, { message: "Event type is required" }),
  description: z.string().optional(),
  ledgerId: z.string().uuid({ message: "Invalid ledger id" }),
  status: z.enum(["active", "inactive", "deleted"]).default("active"),
  entries: z.array(
    z.object({
      accountId: z.string().uuid({ message: "Invalid account id" }),
      direction: z.enum(["debit", "credit"]),
      amountField: z.string().min(1, { message: "Amount field is required" }),
    })
  ),
});

export type TransactionDTO = z.infer<typeof transactionSchema>;
