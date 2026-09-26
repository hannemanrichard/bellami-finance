import { SupabaseExpenseService } from "../../data";
import type { CreateExpenseInput, Expense } from "../../domain";
import { ExpenseError } from "../../domain";
import type { ExpenseRepository } from "../../domain/repositories";

export class ExpenseApplicationService {
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  async createExpense(input: CreateExpenseInput): Promise<Expense> {
    try {
      return await this.expenseRepository.create(input);
    } catch (error) {
      if (error instanceof ExpenseError) {
        throw error;
      }

      throw new ExpenseError("Failed to add expense", "EXPENSE_CREATE_FAILED");
    }
  }
}

const expenseService = new SupabaseExpenseService();

export const expenseApplicationService = new ExpenseApplicationService(
  expenseService
);
