import dynamic from "next/dynamic";
import { BryntumGrid, BryntumGridProps } from "@bryntum/grid-react-thin";

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

const GridWrapper = (
  gridConfig: BryntumGridProps & {
    innerRef?: React.RefObject<BryntumGrid>;
  }
) => {
  return <Grid {...gridConfig} ref={gridConfig.innerRef} />;
};

export { GridWrapper };
