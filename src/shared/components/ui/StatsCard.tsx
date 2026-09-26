"use client";

import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/utils";
import { ArrowUpRight } from "lucide-react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: number;

  valueType: "percentage" | "number" | "currency";
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  valueType,
  trend,
  className,
  icon,
}) => {
  const formatValue = () => {
    switch (valueType) {
      case "percentage":
        return `${value}%`;
      case "currency":
        return `${value.toLocaleString()} DA`;
      case "number":
      default:
        return value.toLocaleString();
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{formatValue()}</p>
            {trend && (
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.positive ? "text-green-500" : "text-red-500"
                  )}
                >
                  {trend.value}
                </span>
                <ArrowUpRight
                  className={cn(
                    "h-3 w-3",
                    trend.positive
                      ? "text-green-500"
                      : "text-red-500 transform rotate-90"
                  )}
                />
              </div>
            )}
          </div>
          <div className="rounded-md bg-primary/10 p-2">
            {React.cloneElement(icon as React.ReactElement<any>, {
              className: "h-4 w-4 text-primary",
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
