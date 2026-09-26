"use client";

import { useUser } from "@clerk/nextjs";

export function useAuth() {
  const { user } = useUser();
  
  const isAdmin = user?.publicMetadata?.role === "admin";
  const isPartner = user?.publicMetadata?.role === "partner";
  
  return {
    isAdmin,
    user,
    isPartner,
  };
} 