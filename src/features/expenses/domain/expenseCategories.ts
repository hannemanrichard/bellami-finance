import expenseCategoriesJson from "../data/expenseCategories.json";

export const expenseDepartments = ["ecomeast", "garment-factory"] as const;

export type ExpenseDepartment = (typeof expenseDepartments)[number];
export type ExpenseType = "fixed" | "variable";

export interface ExpenseCategoryRecord {
  category: string;
  type: ExpenseType;
  department: ExpenseDepartment;
}

export const expenseCategories = expenseCategoriesJson as ExpenseCategoryRecord[];

export const getExpenseCategoriesByDepartment = (
  department: ExpenseDepartment
): ExpenseCategoryRecord[] => {
  return expenseCategories.filter((entry) => entry.department === department);
};

export const findExpenseCategory = (
  department: ExpenseDepartment,
  category: string
): ExpenseCategoryRecord | undefined => {
  return expenseCategories.find(
    (entry) => entry.department === department && entry.category === category
  );
};
