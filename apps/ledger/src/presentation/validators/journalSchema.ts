import { z } from "zod";
import { entrySchema } from "./entrySchema";

export const journalSchema = z.object({
  transactionId: z.string().uuid({ message: "Invalid transaction uuid" }),
  ledgerId: z.string().uuid({ message: "Invalid ledger uuid" }),
  name: z.string().min(1, { message: "Name is required" }),
  event: z.string().min(1, { message: "Event is required" }),
  description: z.string(),
  postingDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
      "Invalid datetime format. Expected YYYY-MM-DD HH:MM:SS"
    ),
  amount: z.number().gt(0, { message: "Amount must be greater than 0" }),
  metadata: z.record(z.any()).optional(),
  entries: z.array(entrySchema),
});

export type JournalDTO = z.infer<typeof journalSchema>;
