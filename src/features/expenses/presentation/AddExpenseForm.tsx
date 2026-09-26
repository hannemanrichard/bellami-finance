"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignOutButton } from "@/shared/components/auth";
import { Button } from "@/shared/components/ui/button";
import { Combobox } from "@/shared/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useCreateExpense } from "../application";
import {
  expenseDepartments,
  findExpenseCategory,
  getExpenseCategoriesByDepartment,
  type ExpenseDepartment,
} from "../domain/expenseCategories";
import {
  expenseFormSchema,
  getTodayDateInputValue,
  isOtherCategory,
} from "../domain/validations";

interface ExpenseFormInput {
  date: string;
  department: ExpenseDepartment;
  category: string;
  amount: string;
  comment: string;
}

const departmentLabels: Record<ExpenseDepartment, string> = {
  ecomeast: "Ecomeast",
  "garment-factory": "Garment factory",
};

const formatCategoryLabel = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const fieldClassName =
  "h-24 rounded-2xl border border-[#D5E4F2] bg-white px-4 text-3xl text-[#003087] shadow-none placeholder:text-[#8AA4BE] focus-visible:border-[#0070BA] focus-visible:ring-2 focus-visible:ring-[#0070BA]/30";

const getDefaultFormValues = (): ExpenseFormInput => ({
  date: getTodayDateInputValue(),
  department: "ecomeast",
  category: "",
  amount: "",
  comment: "",
});

export const AddExpenseForm = () => {
  const createExpenseMutation = useCreateExpense();
  const form = useForm<ExpenseFormInput>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: getDefaultFormValues(),
    mode: "onChange",
  });

  const selectedDepartment = form.watch("department");
  const selectedCategory = form.watch("category");
  const showComment = isOtherCategory(selectedCategory);

  const categoryOptions = useMemo(
    () =>
      getExpenseCategoriesByDepartment(selectedDepartment).map((entry) => ({
        value: entry.category,
        label: formatCategoryLabel(entry.category),
      })),
    [selectedDepartment]
  );

  const handleDepartmentChange = (department: ExpenseDepartment) => {
    form.setValue("department", department, { shouldValidate: true });
    form.setValue("category", "", { shouldValidate: true });
    form.setValue("comment", "");
  };

  const handleSubmit = (values: ExpenseFormInput) => {
    const parsed = expenseFormSchema.parse(values);
    const categoryRecord = findExpenseCategory(parsed.department, parsed.category);

    if (!categoryRecord) {
      return;
    }

    createExpenseMutation.mutate(
      {
        amount: parsed.amount,
        category: categoryRecord.category,
        type: categoryRecord.type,
        department: categoryRecord.department,
        date: parsed.date,
        comment: isOtherCategory(categoryRecord.category)
          ? parsed.comment
          : undefined,
      },
      {
        onSuccess: () => {
          form.reset(getDefaultFormValues());
        },
      }
    );
  };

  const isBusy = createExpenseMutation.isPending || form.formState.isSubmitting;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#F4F8FB]">
      <header className="bg-[#E4EDF5] px-5 pb-7 pt-[max(1.25rem,env(safe-area-inset-top))] text-[#003087]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-base text-[#003087]/70">bellami-finance</p>
            <h1 className="text-3xl font-semibold tracking-tight">Add expense</h1>
          </div>
          <SignOutButton className="text-lg text-[#003087] hover:bg-[#003087]/10 hover:text-[#003087]" />
        </div>
      </header>

      <Form {...form}>
        <form
          className="flex flex-1 flex-col gap-5 px-6 pb-6 pt-6"
          aria-label="Add expense"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-2xl font-semibold text-[#003087]">
                  Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    aria-label="Date"
                    className={fieldClassName}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-lg" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-2xl font-semibold text-[#003087]">
                  Department
                </FormLabel>
                <FormControl>
                  <fieldset className="grid grid-cols-2 gap-1 rounded-2xl bg-white p-1 shadow-sm">
                    <legend className="sr-only">Department</legend>
                    {expenseDepartments.map((department) => {
                      const isSelected = field.value === department;

                      return (
                        <label
                          key={department}
                          className={`flex min-h-20 cursor-pointer items-center justify-center rounded-xl px-3 text-center text-2xl font-medium ${
                            isSelected
                              ? "bg-[#0070BA] text-white shadow-sm"
                              : "text-[#003087]"
                          }`}
                        >
                          <input
                            type="radio"
                            name={field.name}
                            value={department}
                            checked={isSelected}
                            className="sr-only"
                            aria-label={departmentLabels[department]}
                            onChange={() => handleDepartmentChange(department)}
                            onBlur={field.onBlur}
                          />
                          {departmentLabels[department]}
                        </label>
                      );
                    })}
                  </fieldset>
                </FormControl>
                <FormMessage className="text-lg" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-2xl font-semibold text-[#003087]">
                  Category
                </FormLabel>
                <FormControl>
                  <Combobox
                    options={categoryOptions}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (!isOtherCategory(value)) {
                        form.setValue("comment", "");
                      }
                    }}
                    placeholder="Search category"
                    emptyText="No category found."
                    className={`${fieldClassName} justify-between font-normal hover:bg-white`}
                  />
                </FormControl>
                <FormMessage className="text-lg" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-2xl font-semibold text-[#003087]">
                  Amount
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    enterKeyHint="done"
                    placeholder="0.00"
                    aria-label="Amount"
                    className={`${fieldClassName} text-4xl font-semibold`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-lg" />
              </FormItem>
            )}
          />

          {showComment ? (
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-2xl font-semibold text-[#003087]">
                    Comment
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this expense"
                      aria-label="Comment"
                      className="min-h-40 rounded-2xl border border-[#D5E4F2] bg-white px-4 py-4 text-3xl text-[#003087] shadow-none placeholder:text-[#8AA4BE] focus-visible:border-[#0070BA] focus-visible:ring-2 focus-visible:ring-[#0070BA]/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-lg" />
                </FormItem>
              )}
            />
          ) : null}

          <div className="sticky bottom-0 mt-auto bg-[#F4F8FB]/95 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
            <Button
              type="submit"
              className="h-24 w-full rounded-2xl bg-[#0070BA] text-3xl font-semibold text-white shadow-[0_10px_24px_rgba(0,112,186,0.35)] hover:bg-[#003087]"
              disabled={isBusy || !form.formState.isValid}
              aria-label="Add expense"
            >
              {isBusy ? "Adding expense..." : "Add expense"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
