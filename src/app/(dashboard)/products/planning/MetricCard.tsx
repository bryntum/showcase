import React from "react";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  LucideIcon,
} from "lucide-react";
import cn from "lib/utils";

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string | React.ReactNode;
  badge?: {
    type: "neutral" | "positive" | "negative";
    href?: string;
    label: string;
  };
  styles?: {
    trendContainer?: string;
  };
}

const MetricCard = ({ metric }: { metric: MetricCardProps }) => {
  const Icon = metric.icon;

  return (
    <div className="relative overflow-hidden rounded-xl border-border border-[1px] px-4 py-2 text-teal-900 bg-teal-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-teal-900 font-medium">{metric.title}</p>
          <p className="text-3xl text-teal-900 font-bold">{metric.value}</p>
        </div>
        <div className="ml-4">
          <div className="rounded-full bg-teal-300 p-3">
            <Icon size={24} className="text-teal-700" />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex mt-2 items-center justify-between",
          metric.styles?.trendContainer
        )}
      >
        {metric.trend && (
          <div className="flex text-teal-600 items-center">
            <span className="text-sm text-teal-500">{metric.trend}</span>
          </div>
        )}
        {metric.badge &&
          (metric.badge.href ? (
            <a
              href={metric.badge.href}
              className={cn(
                "flex gap-1 text-sm/6 items-center rounded-full py-0 pb-[1px] px-3 cursor-pointer text-event-text",
                metric.badge.type === "neutral" &&
                  "bg-card hover:bg-teal-50 border-[1px] border-teal-400",
                metric.badge.type === "positive" &&
                  "bg-teal-50 border-[1px] border-teal-400",
                metric.badge.type === "negative" &&
                  "bg-warning-50 border-[1px] border-warning-100"
              )}
            >
              {metric.badge.type === "positive" && <ArrowUpIcon size={16} />}
              {metric.badge.type === "negative" && <ArrowDownIcon size={16} />}
              {metric.badge.label}
              {metric.badge.type === "neutral" && <ArrowRightIcon size={16} />}
            </a>
          ) : (
            <div
              className={cn(
                "flex gap-2 text-sm items-center rounded-full py-0 px-2 text-event-text",
                metric.badge.type === "neutral" &&
                  "bg-teal-100 border-[1px] border-teal-400",
                metric.badge.type === "positive" &&
                  "bg-teal-100 border-[1px] border-teal-400",
                metric.badge.type === "negative" &&
                  "bg-warning-100 border-[1px] border-warning-500"
              )}
            >
              {metric.badge.type === "positive" && <ArrowUpIcon size={16} />}
              {metric.badge.type === "negative" && <ArrowDownIcon size={16} />}
              {metric.badge.label}
              {metric.badge.type === "neutral" && <ArrowRightIcon size={16} />}
            </div>
          ))}
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -translate-y-16 translate-x-16"></div>
    </div>
  );
};

export default MetricCard;
