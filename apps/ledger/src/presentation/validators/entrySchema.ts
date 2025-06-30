import z from "zod";

const OPERATION_TYPES = ["debit", "credit"] as const;

export const entrySchema = z.object({
  accountId: z.string().uuid({ message: "Invalid account id" }),
  amount: z.number().gt(0, { message: "Amount must be greater than 0" }),
  description: z.string().optional(),
  direction: z.enum(OPERATION_TYPES, {
    message: "Invalid operation type",
  }),
  metadata: z.record(z.any()).optional(),
});

export type EntryDTO = z.infer<typeof entrySchema>;
