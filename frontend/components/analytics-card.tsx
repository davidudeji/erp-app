import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  trend: React.ReactNode;
}

export default function AnalyticsCard({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  trend,
}: AnalyticsCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-white/20">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-3xl font-bold text-white">{value}</p>
        <div className="mt-2 flex items-center gap-1">
          <span
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isPositive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {trend}
            {change}
          </span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      </div>
    </div>
  );
}
