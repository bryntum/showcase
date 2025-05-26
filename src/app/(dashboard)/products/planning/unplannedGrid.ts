import { Model } from "@bryntum/core-thin";
import { BryntumGridProps } from "@bryntum/grid-react-thin";
import { GridColumnConfig } from "@bryntum/grid-thin";

const unplannedGridConfig: BryntumGridProps = {
  selectionMode: {
    cell: false,
  },
  stripeFeature: true,
  collapsible: true,
  header: false,
  flex: 1,
  id: "unplannedGrid",
  height: "100%",
  sortFeature: "name",
  columns: [
    {
      text: "Comment",
      field: "comment",
    },
    {
      text: "Type",
      editor: false,
      renderer: ({ record }: { record: Model }) => {
        return record.getData("type");
      },
    },
    {
      type: "time",
      editor: false,
      text: "Start",
      field: "plannedFrom",
      format: "HH:mm",
      minWidth: 100,
    },
    {
      type: "duration",
      editor: false,
      text: "Duration",
      field: "duration",
    },
  ] as GridColumnConfig[],

  rowHeight: 50,
  disableGridRowModelWarning: true,
};

export default unplannedGridConfig;
