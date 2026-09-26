"use client";

import { SidebarTrigger } from "@/shared/components/ui/sidebar";

export const DashboardHeader = () => {
  return (
    <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px]">
      <SidebarTrigger />
      <div className="hidden font-semibold sm:block">Expenses</div>
    </header>
  );
};
