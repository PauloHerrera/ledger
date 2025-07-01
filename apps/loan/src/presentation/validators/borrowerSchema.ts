import z from "zod";

export const borrowerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  document: z.string().min(1, { message: "Document is required" }),
});

export type BorrowerDTO = z.infer<typeof borrowerSchema>;