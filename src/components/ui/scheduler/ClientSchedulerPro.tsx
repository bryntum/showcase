"use client";

import dynamic from "next/dynamic";
import { BryntumSchedulerProProps } from "@bryntum/schedulerpro-react-thin/src/BryntumSchedulerPro";

// Dynamically import BryntumSchedulerPro with no SSR
const BryntumSchedulerPro = dynamic(
  () =>
    import("@bryntum/schedulerpro-react-thin").then(
      (mod) => mod.BryntumSchedulerPro
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-muted/50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Scheduler...</p>
        </div>
      </div>
    ),
  }
);

export const ClientSchedulerPro = (props: BryntumSchedulerProProps) => {
  return <BryntumSchedulerPro {...props} />;
};
