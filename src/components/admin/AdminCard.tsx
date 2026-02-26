import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AdminCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  iconClassName?: string;
}

export function AdminCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  iconClassName,
}: AdminCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            iconClassName || "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <p
            className={cn(
              "text-xs font-medium",
              trend.value >= 0 ? "text-green-600" : "text-red-500"
            )}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
