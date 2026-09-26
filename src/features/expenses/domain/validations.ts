import { z } from "zod";
import {
  expenseDepartments,
  findExpenseCategory,
} from "./expenseCategories";

const optionalComment = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

export const expenseFormSchema = z
  .object({
    date: z.string().trim().min(1, "Date is required"),
    department: z.enum(expenseDepartments),
    category: z.string().trim().min(1, "Category is required"),
    amount: z.coerce
      .number({ invalid_type_error: "Amount must be a number" })
      .positive("Amount must be greater than 0"),
    comment: optionalComment,
  })
  .superRefine((values, context) => {
    const categoryRecord = findExpenseCategory(
      values.department,
      values.category
    );

    if (!categoryRecord) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["category"],
        message: "Choose a category for this department",
      });
    }
  });

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export const getTodayDateInputValue = (now = new Date()): string => {
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
};

export const isOtherCategory = (category: string): boolean => {
  return category.trim().toLowerCase() === "other";
};
