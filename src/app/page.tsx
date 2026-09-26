import type { Metadata } from "next";
import { AddExpenseForm } from "@/features/expenses/presentation";

export const metadata: Metadata = {
  title: "Add expense",
  description: "Add a new expense",
};

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-[#F4F8FB]">
      <AddExpenseForm />
    </main>
  );
}
