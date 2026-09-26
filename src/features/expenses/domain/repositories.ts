import type { CreateExpenseInput, Expense } from "./entities";

export interface ExpenseRepository {
  create(input: CreateExpenseInput): Promise<Expense>;
}
