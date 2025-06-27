import { z } from "zod";

export const ledgerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  metadata: z.record(z.any()),
});

export type LedgerDTO = z.infer<typeof ledgerSchema>;
