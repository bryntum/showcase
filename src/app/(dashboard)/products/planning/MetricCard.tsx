import React from "react";
import { LucideIcon } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  gradient: string;
}

const MetricCard = ({ metric }: { metric: MetricCardProps }) => {
  const Icon = metric.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${metric.gradient} px-4 py-2 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/80">{metric.title}</p>
          <p className="text-3xl font-bold mt-2">{metric.value}</p>
          {metric.trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm ${
                  metric.trend.isPositive ? "text-green-200" : "text-red-200"
                }`}
              >
                {metric.trend.isPositive ? "↗" : "↘"} {metric.trend.value}
              </span>
            </div>
          )}
        </div>
        <div className="ml-4">
          <div className="rounded-full bg-white/20 p-3">
            <Icon size={24} className="text-white" />
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
    </div>
  );
};

export default MetricCard;