"use client";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/utils";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface SignOutButtonProps {
  className?: string;
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = () => {
    signOut(() => router.push("/sign-in"));
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="ghost"
      className={cn("h-11 px-3 text-base", className)}
    >
      Sign out
    </Button>
  );
}
