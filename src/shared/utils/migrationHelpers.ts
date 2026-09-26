/**
 * Creates a standardized query key for React Query
 * @param feature - The feature name (e.g., "leads", "orders")
 * @param params - Additional parameters to include in the key
 * @returns Array of strings representing the query key
 */
export const createQueryKey = (feature: string, ...params: any[]) => {
  return [feature, ...params.filter(Boolean)];
};

/**
 * Creates mutation options with automatic cache invalidation
 * @param invalidateQueries - Array of query keys to invalidate
 * @param onSuccess - Optional success callback
 * @returns Mutation options object
 */
export const createMutationOptions = (
  invalidateQueries: string[][],
  onSuccess?: (data: any) => void
) => {
  // Note: This function returns mutation options, not a hook
  // The queryClient must be obtained from the calling component/hook
  return {
    onSuccess: (data: any) => {
      // This will be called by React Query, which provides the queryClient context
      // The actual invalidation should be handled in the component using useQueryClient
      onSuccess?.(data);
    },
  };
};

/**
 * Common query key patterns used across the application
 */
export const QUERY_KEYS = {
  // Leads
  LEADS: ["leads"],
  LEADS_BY_AFFILIATE: (affiliateId: number) => [
    "leads",
    "affiliate",
    affiliateId,
  ],
  LEAD_BY_ID: (leadId: number) => ["leads", leadId],
  ELIGIBLE_LEADS: (affiliateId: number) => ["leads", "eligible", affiliateId],

  // Orders
  ORDERS: ["orders"],
  ORDERS_BY_AFFILIATE: (affiliateId: number) => [
    "orders",
    "affiliate",
    affiliateId,
  ],
  ORDER_BY_ID: (orderId: string | number) => ["orders", orderId],
  ORDER_ITEMS: (orderId: string | number) => ["orders", orderId, "items"],
  ORDERS_BY_CUSTOMER: (customerId: number) => [
    "orders",
    "customer",
    customerId,
  ],

  // Affiliates
  AFFILIATES: ["affiliates"],
  AFFILIATE_BY_ID: (affiliateId: number) => ["affiliates", affiliateId],
  AFFILIATE_BY_EMAIL: (email: string) => ["affiliates", "email", email],
  AFFILIATE_STATS: (affiliateId: number) => [
    "affiliates",
    affiliateId,
    "stats",
  ],

  // Products
  PRODUCTS: ["products"],
  PRODUCT_BY_ID: (productId: number) => ["products", productId],
  PRODUCT_CATEGORIES: ["products", "categories"],

  // Parcels
  PARCELS: ["parcels"],
  PARCELS_BY_AFFILIATE: (affiliateId: number) => [
    "parcels",
    "affiliate",
    affiliateId,
  ],
  PARCEL_BY_ID: (parcelId: number) => ["parcels", parcelId],

  // Payouts
  PAYOUTS: ["payouts"],
  PAYOUTS_BY_AFFILIATE: (affiliateId: number) => [
    "payouts",
    "affiliate",
    affiliateId,
  ],
  PAYOUT_BY_ID: (payoutId: number) => ["payouts", payoutId],
  PAYOUT_SUMMARY: (affiliateId: number) => ["payouts", "summary", affiliateId],

  // Commissions
  COMMISSIONS: ["commissions"],
  COMMISSIONS_BY_AFFILIATE: (affiliateId: number) => [
    "commissions",
    "affiliate",
    affiliateId,
  ],
  COMMISSION_SUMMARY: (affiliateId: number) => [
    "commissions",
    "summary",
    affiliateId,
  ],

  // Withdrawals
  WITHDRAWALS: ["withdrawals"],
  WITHDRAWALS_BY_AFFILIATE: (affiliateId: number) => [
    "withdrawals",
    "affiliate",
    affiliateId,
  ],
  WITHDRAWAL_BY_ID: (withdrawalId: number) => ["withdrawals", withdrawalId],
  WITHDRAWAL_SUMMARY: (affiliateId: number) => [
    "withdrawals",
    "summary",
    affiliateId,
  ],

  // Gamification
  GAMIFICATION: ["gamification"],
  AFFILIATE_XP: (affiliateId: number) => ["gamification", "xp", affiliateId],
  AFFILIATE_BADGES: (affiliateId: number) => [
    "gamification",
    "badges",
    affiliateId,
  ],
  AFFILIATE_LEVEL: (affiliateId: number) => [
    "gamification",
    "level",
    affiliateId,
  ],
  AFFILIATE_STREAKS: (affiliateId: number) => [
    "gamification",
    "streaks",
    affiliateId,
  ],
  LEADERBOARD: (type: string, period: string) => [
    "gamification",
    "leaderboard",
    type,
    period,
  ],
  QUESTS: ["gamification", "quests"],
  AFFILIATE_QUESTS: (affiliateId: number) => [
    "gamification",
    "quests",
    affiliateId,
  ],
  AFFILIATE_BONUSES: (affiliateId: number) => [
    "gamification",
    "bonuses",
    affiliateId,
  ],
  BONUS_CONFIGURATIONS: ["gamification", "bonus-configurations"],
} as const;

/**
 * Common cache invalidation patterns
 */
export const INVALIDATION_PATTERNS = {
  // When a lead is created/updated/deleted
  LEAD_CHANGES: (affiliateId?: number) => [
    QUERY_KEYS.LEADS,
    ...(affiliateId ? [QUERY_KEYS.LEADS_BY_AFFILIATE(affiliateId)] : []),
  ],

  // When an order is created/updated/deleted
  ORDER_CHANGES: (affiliateId?: number, orderId?: number) => [
    QUERY_KEYS.ORDERS,
    ...(affiliateId ? [QUERY_KEYS.ORDERS_BY_AFFILIATE(affiliateId)] : []),
    ...(orderId
      ? [QUERY_KEYS.ORDER_BY_ID(orderId), QUERY_KEYS.ORDER_ITEMS(orderId)]
      : []),
  ],

  // When an affiliate is updated
  AFFILIATE_CHANGES: (affiliateId: number) => [
    QUERY_KEYS.AFFILIATES,
    QUERY_KEYS.AFFILIATE_BY_ID(affiliateId),
    QUERY_KEYS.AFFILIATE_STATS(affiliateId),
  ],

  // When a product is created/updated/deleted
  PRODUCT_CHANGES: (productId?: number) => [
    QUERY_KEYS.PRODUCTS,
    ...(productId ? [QUERY_KEYS.PRODUCT_BY_ID(productId)] : []),
  ],

  // When a parcel is created/updated/deleted
  PARCEL_CHANGES: (affiliateId?: number, parcelId?: number) => [
    QUERY_KEYS.PARCELS,
    ...(affiliateId ? [QUERY_KEYS.PARCELS_BY_AFFILIATE(affiliateId)] : []),
    ...(parcelId ? [QUERY_KEYS.PARCEL_BY_ID(parcelId)] : []),
  ],

  // When a payout is created/updated/deleted
  PAYOUT_CHANGES: (affiliateId?: number, payoutId?: number) => [
    QUERY_KEYS.PAYOUTS,
    ...(affiliateId
      ? [
          QUERY_KEYS.PAYOUTS_BY_AFFILIATE(affiliateId),
          QUERY_KEYS.PAYOUT_SUMMARY(affiliateId),
        ]
      : []),
    ...(payoutId ? [QUERY_KEYS.PAYOUT_BY_ID(payoutId)] : []),
  ],

  // When a commission is created/updated/deleted
  COMMISSION_CHANGES: (affiliateId?: number) => [
    QUERY_KEYS.COMMISSIONS,
    ...(affiliateId
      ? [
          QUERY_KEYS.COMMISSIONS_BY_AFFILIATE(affiliateId),
          QUERY_KEYS.COMMISSION_SUMMARY(affiliateId),
        ]
      : []),
  ],

  // When a withdrawal is created/updated/deleted
  WITHDRAWAL_CHANGES: (affiliateId?: number, withdrawalId?: number) => [
    QUERY_KEYS.WITHDRAWALS,
    ...(affiliateId
      ? [
          QUERY_KEYS.WITHDRAWALS_BY_AFFILIATE(affiliateId),
          QUERY_KEYS.WITHDRAWAL_SUMMARY(affiliateId),
        ]
      : []),
    ...(withdrawalId ? [QUERY_KEYS.WITHDRAWAL_BY_ID(withdrawalId)] : []),
  ],
} as const;

/**
 * Helper to create query options with common defaults
 */
export const createQueryOptions = (options?: {
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
  retry?: number;
}) => ({
  staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
  gcTime: options?.gcTime ?? 30 * 60 * 1000, // 30 minutes (replaces cacheTime)
  enabled: options?.enabled ?? true,
  retry: options?.retry ?? 3,
});

/**
 * Helper to create mutation options with common defaults
 */
export const createMutationOptionsWithDefaults = (
  invalidateQueries: string[][],
  options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
    errorMessage?: string;
  }
) => ({
  invalidateQueries,
  onSuccess: options?.onSuccess,
  onError: options?.onError,
  showSuccessToast: options?.showSuccessToast ?? true,
  showErrorToast: options?.showErrorToast ?? true,
  successMessage: options?.successMessage,
  errorMessage: options?.errorMessage,
});

/**
 * Type-safe query key builder
 */
export type QueryKeyBuilder<T extends keyof typeof QUERY_KEYS> =
  T extends "LEADS_BY_AFFILIATE"
    ? (affiliateId: number) => string[]
    : T extends "LEAD_BY_ID"
      ? (leadId: number) => string[]
      : T extends "ELIGIBLE_LEADS"
        ? (affiliateId: number) => string[]
        : T extends "ORDERS_BY_AFFILIATE"
          ? (affiliateId: number) => string[]
          : T extends "ORDER_BY_ID"
            ? (orderId: number) => string[]
            : T extends "ORDER_ITEMS"
              ? (orderId: number) => string[]
              : T extends "AFFILIATE_BY_ID"
                ? (affiliateId: number) => string[]
                : T extends "AFFILIATE_BY_EMAIL"
                  ? (email: string) => string[]
                  : T extends "AFFILIATE_STATS"
                    ? (affiliateId: number) => string[]
                    : T extends "PRODUCT_BY_ID"
                      ? (productId: number) => string[]
                      : T extends "PARCELS_BY_AFFILIATE"
                        ? (affiliateId: number) => string[]
                        : T extends "PARCEL_BY_ID"
                          ? (parcelId: number) => string[]
                          : T extends "PAYOUTS_BY_AFFILIATE"
                            ? (affiliateId: number) => string[]
                            : T extends "PAYOUT_BY_ID"
                              ? (payoutId: number) => string[]
                              : T extends "PAYOUT_SUMMARY"
                                ? (affiliateId: number) => string[]
                                : T extends "COMMISSIONS_BY_AFFILIATE"
                                  ? (affiliateId: number) => string[]
                                  : T extends "COMMISSION_SUMMARY"
                                    ? (affiliateId: number) => string[]
                                    : T extends "WITHDRAWALS_BY_AFFILIATE"
                                      ? (affiliateId: number) => string[]
                                      : T extends "WITHDRAWAL_BY_ID"
                                        ? (withdrawalId: number) => string[]
                                        : T extends "WITHDRAWAL_SUMMARY"
                                          ? (affiliateId: number) => string[]
                                          : () => string[];

/**
 * Utility to check if a query key matches a pattern
 */
export const matchesQueryKey = (queryKey: string[], pattern: string[]) => {
  if (queryKey.length !== pattern.length) return false;

  return queryKey.every((key, index) => {
    const patternKey = pattern[index];
    return patternKey === key || patternKey === "*";
  });
};

/**
 * Utility to extract parameters from a query key
 */
export const extractQueryParams = <T extends Record<string, any>>(
  queryKey: string[],
  pattern: string[]
): Partial<T> => {
  const params: Partial<T> = {};

  pattern.forEach((patternKey, index) => {
    if (patternKey.startsWith(":")) {
      const paramName = patternKey.slice(1);
      params[paramName as keyof T] = queryKey[index] as T[keyof T];
    }
  });

  return params;
};
