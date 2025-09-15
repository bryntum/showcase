"use client";

import dynamic from "next/dynamic";
import { BryntumGridProps } from "@bryntum/grid-react-thin";

// Dynamically import BryntumGrid with no SSR
const BryntumGrid = dynamic(
  () => import("@bryntum/grid-react-thin").then((mod) => mod.BryntumGrid),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Grid...</p>
        </div>
      </div>
    ),
  }
);

export const ClientGrid = (props: BryntumGridProps) => {
  return <BryntumGrid {...props} />;
};
