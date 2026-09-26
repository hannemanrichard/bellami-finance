export class ExpenseError extends Error {
  constructor(message: string, public readonly code: string = "EXPENSE_ERROR") {
    super(message);
    this.name = "ExpenseError";
  }
}
