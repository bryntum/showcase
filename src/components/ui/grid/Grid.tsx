"use client";

import { BryntumGrid } from "@bryntum/grid-react-thin";
import { forwardRef } from "react";

const Grid = forwardRef<BryntumGrid, any>((props, ref) => {
  return <BryntumGrid {...props} ref={ref} />;
});

Grid.displayName = "Grid";

export default Grid;
