import { z } from "zod";
import { entrySchema } from "./entrySchema";

export const journalSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  event: z.string().min(1, { message: "Event is required" }),
  description: z.string(),
  postingDate: z.date({ message: "Invalid posting date" }),
  amount: z.number().gt(0, { message: "Amount must be greater than 0" }),
  metadata: z.record(z.any()).optional(),
  entries: z.array(entrySchema),
});

export type JournalDTO = z.infer<typeof journalSchema>;
