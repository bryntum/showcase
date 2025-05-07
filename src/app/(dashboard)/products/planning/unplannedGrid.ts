import { Model } from "@bryntum/core-thin";
import { BryntumGridProps } from "@bryntum/grid-react-thin";
import { GridColumnConfig } from "@bryntum/grid-thin";

const unplannedGridConfig: BryntumGridProps = {
  selectionMode: {
    cell: false
  },
  stripeFeature: true,
  collapsible: true,
  collapsed: true,
  header: "Unplanned Deliveries",
  sortFeature: 'name',
  columns: [
    {
      text: 'Type',
      editor: false,
      renderer: ({ record }: { record: Model }) => {
        return record.getData("type");
      }
    },
    {
      type: "time",
      editor: false,
      text: "From",
      field: "plannedFrom",
      format: "HH:mm"
    },
    {
      type: "time",
      editor: false,
      text: "To",
      field: "plannedTo",
      format: "HH:mm"
    },
  ] as GridColumnConfig[],

  rowHeight: 65,
  disableGridRowModelWarning: true
};

export default unplannedGridConfig;
