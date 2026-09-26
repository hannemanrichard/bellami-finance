"use client";

import { ClerkProvider } from "@clerk/nextjs";

interface ConditionalClerkProviderProps {
  children: React.ReactNode;
}

export const ConditionalClerkProvider = ({
  children,
}: ConditionalClerkProviderProps) => {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      {children}
    </ClerkProvider>
  );
};
