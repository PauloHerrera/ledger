import { z } from "zod";

export const eventSchema = z.object({
  transactionId: z.string().uuid({ message: "Invalid transaction id" }),
  event: z.string().min(1, { message: "Event is required" }),
  timestamp: z.string().datetime({ message: "Invalid timestamp" }),
  data: z.record(z.any()),
});

export type EventDTO = z.infer<typeof eventSchema>;
