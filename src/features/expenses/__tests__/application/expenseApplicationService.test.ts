import { ExpenseApplicationService } from "../../application/services/expenseApplicationService";
import { ExpenseError } from "../../domain";
import type { Expense, ExpenseRepository } from "../../domain";

const createExpenseRepositoryMock = (): jest.Mocked<ExpenseRepository> => ({
  create: jest.fn(),
});

describe("ExpenseApplicationService", () => {
  let repository: jest.Mocked<ExpenseRepository>;
  let service: ExpenseApplicationService;

  const createdExpense: Expense = {
    id: 1,
    amount: 100,
    category: "Office",
    comment: null,
    correspondingProduct: null,
    correspondingQty: null,
    createdAt: "2026-09-26T00:00:00.000Z",
    department: "Admin",
    type: "Card",
  };

  beforeEach(() => {
    repository = createExpenseRepositoryMock();
    service = new ExpenseApplicationService(repository);
  });

  it("creates an expense through the repository", async () => {
    repository.create.mockResolvedValue(createdExpense);

    const result = await service.createExpense({
      amount: 100,
      category: "Office",
      type: "fixed",
      department: "ecomeast",
      date: "2026-09-26",
    });

    expect(repository.create).toHaveBeenCalledWith({
      amount: 100,
      category: "Office",
      type: "fixed",
      department: "ecomeast",
      date: "2026-09-26",
    });
    expect(result).toEqual(createdExpense);
  });

  it("wraps repository failures in an expense error", async () => {
    repository.create.mockRejectedValue(new Error("db down"));

    await expect(
      service.createExpense({
        amount: 100,
        category: "Office",
        type: "fixed",
        department: "ecomeast",
        date: "2026-09-26",
      })
    ).rejects.toEqual(
      new ExpenseError("Failed to add expense", "EXPENSE_CREATE_FAILED")
    );
  });
});
