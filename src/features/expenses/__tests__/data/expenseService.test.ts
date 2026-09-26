import { DatabaseWrapper } from "@/shared/utils/databaseWrapper";
import { withPerformanceTracking } from "@/shared/utils/performanceMonitor";
import { SupabaseExpenseService } from "../../data/expenseService";

jest.mock("@/shared/utils/databaseWrapper");
jest.mock("@/shared/utils/performanceMonitor");
jest.mock("@/infrastructure/supabase/client", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockDatabaseWrapper = DatabaseWrapper as jest.Mocked<typeof DatabaseWrapper>;
const mockWithPerformanceTracking =
  withPerformanceTracking as jest.MockedFunction<typeof withPerformanceTracking>;

describe("SupabaseExpenseService", () => {
  let service: SupabaseExpenseService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SupabaseExpenseService();
    mockWithPerformanceTracking.mockImplementation(
      async (_serviceName, _operation, fn) => fn()
    );
  });

  it("maps an inserted expense row to an entity", async () => {
    mockDatabaseWrapper.executeMutation.mockResolvedValue({
      id: 4,
      amount: 250,
      category: "Marketing",
      comment: "Ads",
      corresponding_product: "Banner",
      corresponding_qty: 3,
      created_at: "2026-09-26T00:00:00.000Z",
      department: "Sales",
      type: "Cash",
    });

    const result = await service.create({
      amount: 250,
      category: "marketing",
      type: "variable",
      department: "ecomeast",
      date: "2026-09-26",
      comment: "Ads",
    });

    expect(result).toEqual({
      id: 4,
      amount: 250,
      category: "Marketing",
      comment: "Ads",
      correspondingProduct: "Banner",
      correspondingQty: 3,
      createdAt: "2026-09-26T00:00:00.000Z",
      department: "Sales",
      type: "Cash",
    });
    expect(mockDatabaseWrapper.executeMutation).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        operation: "create",
        table: "expenses",
      })
    );
  });
});
