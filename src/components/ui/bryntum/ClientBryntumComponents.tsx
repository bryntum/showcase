"use client";

import dynamic from "next/dynamic";

// Dynamically import Bryntum core components with no SSR
export const ClientBryntumButton = dynamic(
  () => import("@bryntum/core-react-thin").then((mod) => mod.BryntumButton),
  {
    ssr: false,
    loading: () => (
      <button disabled className="opacity-50">
        Loading...
      </button>
    ),
  }
);

export const ClientBryntumTextField = dynamic(
  () => import("@bryntum/core-react-thin").then((mod) => mod.BryntumTextField),
  {
    ssr: false,
    loading: () => (
      <input disabled className="opacity-50" placeholder="Loading..." />
    ),
  }
);

export const ClientBryntumSlideToggle = dynamic(
  () =>
    import("@bryntum/core-react-thin").then((mod) => mod.BryntumSlideToggle),
  {
    ssr: false,
    loading: () => <div className="opacity-50">Loading...</div>,
  }
);
