import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    positive?: boolean;
  };
  icon?: IconDefinition;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  description,
  trend,
  icon: Icon,
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 h-full animate-scale-in",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && (
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <FontAwesomeIcon icon={Icon} size="sm" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline">
        <h3 className="text-2xl font-semibold">{value}</h3>

        {trend && (
          <span
            className={cn(
              "ml-2 text-xs font-medium",
              trend.positive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.positive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
