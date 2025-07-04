import type { Request, Response } from "express";
import { createAccount } from "./accountHandler";
import type { Account } from "../../infrastructure/db/schemas/account";
import * as accountUseCaseModule from "../../application/useCases/accountUseCase";

describe("Account Handler", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseStatus: number | undefined;
  let responseJson: any;

  beforeEach(() => {
    mockRequest = {};

    mockResponse = {
      status: jest.fn().mockImplementation((status) => {
        responseStatus = status;
        return mockResponse;
      }),
      json: jest.fn().mockImplementation((json) => {
        responseJson = json;
        return mockResponse;
      }),
    };

    jest.restoreAllMocks();
  });

  it("should create an account", async () => {
    mockRequest.body = {
      name: "Cash",
      description: "Cash in the bank",
      accountType: "asset",
      ledgerId: "b3b8c7e2-8c2a-4e2a-9b2a-2b2a2b2a2b2a",
    };

    const fakeAccount = { id: 1, ...mockRequest.body } as Account;
    jest
      .spyOn(accountUseCaseModule.default.prototype, "execute")
      .mockResolvedValue(fakeAccount);

    await createAccount(mockRequest as Request, mockResponse as Response);

    expect(responseJson).toEqual({
      message: "Account created successfully",
      data: fakeAccount,
    });
    expect(responseStatus).toBe(201);
  });

  it("should return 400 if the data is invalid", async () => {
    mockRequest.body = {
      name: "Test Account",
      description: "Test Description",
      accountType: "invalid",
      ledgerId: "invalid uuid",
    };

    await createAccount(mockRequest as Request, mockResponse as Response);

    expect(responseJson.message).toEqual("Invalid account data");
    expect(responseStatus).toBe(400);
  });
});
