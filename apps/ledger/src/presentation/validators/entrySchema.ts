import z from "zod";

const OPERATION_TYPES = ["debit", "credit"] as const;

export const entrySchema = z.object({
  accountId: z.string().uuid({ message: "Invalid account id" }),
  amount: z.number().min(0, { message: "Amount must be greater than 0" }),
  description: z.string(),
  direction: z.enum(OPERATION_TYPES, {
    message: "Invalid operation type",
  }),
  metadata: z.record(z.any()),
});

export type EntryDTO = z.infer<typeof entrySchema>;
