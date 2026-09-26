import * as React from "react";
import { cn } from "@/shared/utils/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div className={cn("flex-1 space-y-4 p-8 pt-6", className)} {...props}>
      {children}
    </div>
  );
}
