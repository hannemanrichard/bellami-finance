import { supabase } from "@/infrastructure/supabase/client";
import type { Database } from "@/infrastructure/supabase/types";
import { DatabaseWrapper } from "@/shared/utils/databaseWrapper";
import { withPerformanceTracking } from "@/shared/utils/performanceMonitor";
import type { CreateExpenseInput, Expense } from "../domain";
import type { ExpenseRepository } from "../domain/repositories";

type ExpenseRow = Database["public"]["Tables"]["expenses"]["Row"];
type ExpenseInsert = Database["public"]["Tables"]["expenses"]["Insert"];

export class SupabaseExpenseService implements ExpenseRepository {
  private readonly tableName = "expenses" as const;

  async create(input: CreateExpenseInput): Promise<Expense> {
    return withPerformanceTracking("ExpenseService", "create", async () => {
      const payload: ExpenseInsert = {
        amount: input.amount,
        category: input.category,
        type: input.type,
        department: input.department,
        comment: input.comment ?? null,
        created_at: input.date,
      };

      const row = await DatabaseWrapper.executeMutation<ExpenseRow>(
        async () => {
          const { data, error } = await supabase
            .from(this.tableName)
            .insert(payload)
            .select("*")
            .single();

          if (error) throw error;
          return { data, error };
        },
        {
          operation: "create",
          table: this.tableName,
          metadata: { category: input.category, type: input.type },
          auditLog: {
            enabled: true,
            action: "INSERT",
            newValues: payload,
          },
        }
      );

      return this.mapRowToEntity(row);
    });
  }

  private mapRowToEntity = (row: ExpenseRow): Expense => ({
    id: row.id,
    amount: row.amount,
    category: row.category,
    comment: row.comment,
    correspondingProduct: row.corresponding_product,
    correspondingQty: row.corresponding_qty,
    createdAt: row.created_at,
    department: row.department,
    type: row.type,
  });
}
