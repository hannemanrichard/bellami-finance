"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

export default function SignOutPage() {
  const { signOut } = useClerk();

  useEffect(() => {
    void signOut({ redirectUrl: "/sign-in" });
  }, [signOut]);

  return <div className="p-8 text-center text-lg">Signing out...</div>;
}
