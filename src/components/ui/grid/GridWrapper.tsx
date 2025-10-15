import dynamic from "next/dynamic";
import { BryntumGrid, BryntumGridProps } from "@bryntum/grid-react-thin";
import { forwardRef } from "react";

const Grid = dynamic(() => import("./Grid.tsx"), {
  ssr: false,
  loading: () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  },
});

const GridWrapper = forwardRef<BryntumGrid, BryntumGridProps>((props, ref) => {
  return <Grid {...props} ref={ref} />;
});

GridWrapper.displayName = "GridWrapper";

export { GridWrapper };
