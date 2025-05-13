import { Model } from "@bryntum/core-thin";
import { BryntumGridProps } from "@bryntum/grid-react-thin";
import { GridColumnConfig } from "@bryntum/grid-thin";

const unplannedGridConfig: BryntumGridProps = {
  selectionMode: {
    cell: false,
  },
  stripeFeature: true,
  collapsible: true,
  header: "Unplanned Deliveries",
  sortFeature: "name",
  columns: [
    {
      text: "Comment",
      field: "comment",
      flex: 1,
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
      text: "Planned Start",
      field: "plannedFrom",
      format: "HH:mm",
    },
    {
      type: "duration",
      editor: false,
      text: "Duration",
      field: "duration",
    },
  ] as GridColumnConfig[],

  rowHeight: 65,
  disableGridRowModelWarning: true,
};

export default unplannedGridConfig;
