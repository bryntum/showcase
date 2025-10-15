"use client";

import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "lib/utils";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";

type ProductCardProps = {
  title: string;
  description: string;
  icon: IconDefinition;
  path: string;
  metrics: {
    usage: number;
    limit: number;
    change: number;
  };
  className?: string;
};

export const ProductCard = ({
  title,
  description,
  icon: Icon,
  path,
  metrics,
  className,
}: ProductCardProps) => {
  const usagePercentage = (metrics.usage / metrics.limit) * 100;

  return (
    <Link href={path}>
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-4px]",
          className
        )}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-muted">
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out-expo",
              usagePercentage > 80 ? "bg-destructive" : "bg-primary"
            )}
            style={{ width: `${usagePercentage}%` }}
          />
        </div>

        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-medium">{title}</CardTitle>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <FontAwesomeIcon icon={Icon} size="sm" />
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Usage</span>
              <span className="text-sm text-muted-foreground">
                {metrics.usage} / {metrics.limit}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                variant={metrics.change > 0 ? "default" : "outline"}
                className="text-xs"
              >
                {metrics.change > 0 ? "+" : ""}
                {metrics.change}% from last month
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pb-4 pt-0">
          <span className="text-xs text-muted-foreground">View details →</span>
        </CardFooter>
      </Card>
    </Link>
  );
};
