import { expenseFormSchema, getTodayDateInputValue } from "../../domain/validations";
import {
  expenseCategories,
  findExpenseCategory,
  getExpenseCategoriesByDepartment,
} from "../../domain/expenseCategories";

describe("expense categories", () => {
  it("lists the ecomeast and garment-factory categories", () => {
    expect(
      getExpenseCategoriesByDepartment("ecomeast").map((entry) => entry.category)
    ).toEqual([
      "salary",
      "transport",
      "billing",
      "marketing",
      "software",
      "packaging",
      "investment",
      "media",
      "other",
    ]);

    expect(
      getExpenseCategoriesByDepartment("garment-factory").map(
        (entry) => entry.category
      )
    ).toEqual([
      "salary",
      "textile",
      "transport",
      "mercerie",
      "investment",
      "avance",
      "location",
      "billing",
      "other",
    ]);
  });

  it("infers type and department from the selected category", () => {
    expect(findExpenseCategory("ecomeast", "software")).toEqual({
      category: "software",
      type: "fixed",
      department: "ecomeast",
    });
    expect(findExpenseCategory("garment-factory", "textile")).toEqual({
      category: "textile",
      type: "variable",
      department: "garment-factory",
    });
    expect(expenseCategories).toHaveLength(18);
  });
});

describe("expenseFormSchema", () => {
  it("accepts an expense and keeps the comment only as entered text", () => {
    const result = expenseFormSchema.safeParse({
      date: "2026-09-26",
      department: "ecomeast",
      category: "marketing",
      amount: "1500",
      comment: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        date: "2026-09-26",
        department: "ecomeast",
        category: "marketing",
        amount: 1500,
        comment: undefined,
      });
    }
  });

  it("rejects a category that does not belong to the department", () => {
    const result = expenseFormSchema.safeParse({
      date: "2026-09-26",
      department: "ecomeast",
      category: "textile",
      amount: 10,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a missing amount", () => {
    const result = expenseFormSchema.safeParse({
      date: "2026-09-26",
      department: "garment-factory",
      category: "salary",
      amount: 0,
    });

    expect(result.success).toBe(false);
  });
});

describe("getTodayDateInputValue", () => {
  it("returns the local calendar date", () => {
    const value = getTodayDateInputValue(new Date("2026-09-26T15:00:00.000Z"));

    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
