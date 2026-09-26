"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

export default function SignOutPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    signOut(() => router.push("/sign-in"));
  }, [signOut, router]);

  return <div className="text-center p-8">Signing out...</div>;
}
