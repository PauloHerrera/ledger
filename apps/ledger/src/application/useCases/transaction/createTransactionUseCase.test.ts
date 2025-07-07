import CreateTransactionUseCase from "./createTransactionUseCase";
import type { ITransactionRepository } from "../../../infrastructure/repositories/transactionRepository";
import type { ITransactionEntryRepository } from "../../../infrastructure/repositories/transactionEntryRepository";
import type { IAccountRepository } from "../../../infrastructure/repositories/accountRepository";
import type { TransactionDTO } from "../../../presentation/validators/transactionSchema";
import type { Account } from "../../../infrastructure/db/schemas/account";
import type { Transaction } from "../../../infrastructure/db/schemas/transaction";

describe("CreateTransactionUseCase", () => {
  let createTransactionUseCase: CreateTransactionUseCase;
  let mockTransactionRepository: jest.Mocked<ITransactionRepository>;
  let mockTransactionEntryRepository: jest.Mocked<ITransactionEntryRepository>;
  let mockAccountRepository: jest.Mocked<IAccountRepository>;

  beforeEach(() => {
    mockTransactionRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByEventType: jest.fn(),
    };

    mockTransactionEntryRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      createBatch: jest.fn(),
    };

    mockAccountRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    createTransactionUseCase = new CreateTransactionUseCase(
      mockTransactionRepository,
      mockTransactionEntryRepository,
      mockAccountRepository
    );
  });

  describe("execute", () => {
    it("should create a transaction when all accounts exist", async () => {
      const transactionDTO: TransactionDTO = {
        eventType: "test-event",
        description: "Test transaction",
        ledgerId: "ledger-123",
        status: "active",
        entries: [
          {
            accountId: "account-123",
            direction: "debit",
            amountField: "amount",
          },
          {
            accountId: "account-456",
            direction: "credit",
            amountField: "amount",
          },
        ],
      };

      const mockAccount: Account = {
        id: "account-123",
        name: "Test Account",
        description: "Test",
        accountType: "asset",
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ledgerId: "ledger-123",
      };

      const mockTransaction: Transaction = {
        id: "transaction-123",
        eventType: "test-event",
        description: "Test transaction",
        ledgerId: "ledger-123",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAccountRepository.findById.mockResolvedValue(mockAccount);
      mockTransactionRepository.create.mockResolvedValue(mockTransaction);
      mockTransactionEntryRepository.createBatch.mockResolvedValue();

      const result = await createTransactionUseCase.execute(transactionDTO);

      expect(mockAccountRepository.findById).toHaveBeenCalledWith("account-123");
      expect(mockAccountRepository.findById).toHaveBeenCalledWith("account-456");
      expect(mockTransactionRepository.create).toHaveBeenCalled();
      expect(mockTransactionEntryRepository.createBatch).toHaveBeenCalled();
      expect(result).toBe(mockTransaction);
    });

    it("should throw an error when an account does not exist", async () => {
      const transactionDTO: TransactionDTO = {
        eventType: "test-event",
        description: "Test transaction",
        ledgerId: "ledger-123",
        status: "active",
        entries: [
          {
            accountId: "non-existent-account",
            direction: "debit",
            amountField: "amount",
          },
        ],
      };

      mockAccountRepository.findById.mockResolvedValue(null);

      await expect(createTransactionUseCase.execute(transactionDTO)).rejects.toThrow(
        "Failed to create transaction: Account with ID non-existent-account not found"
      );

      expect(mockAccountRepository.findById).toHaveBeenCalledWith("non-existent-account");
      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
      expect(mockTransactionEntryRepository.createBatch).not.toHaveBeenCalled();
    });

    it("should validate unique account IDs only once", async () => {
      const transactionDTO: TransactionDTO = {
        eventType: "test-event",
        description: "Test transaction",
        ledgerId: "ledger-123",
        status: "active",
        entries: [
          {
            accountId: "account-123",
            direction: "debit",
            amountField: "amount",
          },
          {
            accountId: "account-123", // Same account ID
            direction: "credit",
            amountField: "amount",
          },
        ],
      };

      const mockAccount: Account = {
        id: "account-123",
        name: "Test Account",
        description: "Test",
        accountType: "asset",
        metadata: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ledgerId: "ledger-123",
      };

      const mockTransaction: Transaction = {
        id: "transaction-123",
        eventType: "test-event",
        description: "Test transaction",
        ledgerId: "ledger-123",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAccountRepository.findById.mockResolvedValue(mockAccount);
      mockTransactionRepository.create.mockResolvedValue(mockTransaction);
      mockTransactionEntryRepository.createBatch.mockResolvedValue();

      await createTransactionUseCase.execute(transactionDTO);

      // Should only be called once for the unique account ID
      expect(mockAccountRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockAccountRepository.findById).toHaveBeenCalledWith("account-123");
    });
  });
});