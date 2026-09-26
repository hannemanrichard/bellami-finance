export interface Expense {
  id: number;
  amount: number | null;
  category: string | null;
  comment: string | null;
  correspondingProduct: string | null;
  correspondingQty: number | null;
  createdAt: string;
  department: string | null;
  type: string | null;
}

export interface CreateExpenseInput {
  amount: number;
  category: string;
  type: string;
  department: string;
  date: string;
  comment?: string;
}
