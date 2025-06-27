import z from "zod";

export const accountType = [
  "asset",
  "liability",
  "equity",
  "revenue",
  "expense",
] as const;

export const accountSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  accountType: z.enum(accountType, {
    message: "Invalid account type",
  }),
  ledgerId: z.string().uuid({ message: "Invalid ledger id" }),
});

export type AccountDTO = z.infer<typeof accountSchema>;
