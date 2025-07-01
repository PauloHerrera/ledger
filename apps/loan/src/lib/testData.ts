export const sampleBorrower = {
  name: "John Doe",
  document: "123456789",
};

export const sampleLoan = {
  amount: "10000.00",
  interestRate: "0.05",
  borrowerId: "", // This will be set after creating a borrower
  status: "pending" as const,
};