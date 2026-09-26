import { useStandardMutation } from "@/shared/hooks/useReactQuery";
import type { CreateExpenseInput } from "../domain";
import { expenseApplicationService } from "./services/expenseApplicationService";

const expensesKey = ["expenses"];

export const useCreateExpense = () => {
  return useStandardMutation(
    (input: CreateExpenseInput) =>
      expenseApplicationService.createExpense(input),
    {
      invalidateQueries: [expensesKey],
      successMessage: "Expense added",
      errorMessage: "Failed to add expense",
    }
  );
};
