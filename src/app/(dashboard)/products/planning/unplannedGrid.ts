import { Model } from "@bryntum/core-thin";
import { BryntumGridProps } from "@bryntum/grid-react-thin";
import { GridColumnConfig } from "@bryntum/grid-thin";
import cn from "lib/utils";

export const eventTypeCellRenderer = ({ record }: { record: Model }) => {
  const baseClass = "b-fa rounded-full text-xs px-2 py-0.5 before:pr-2 flex items-center justify-center gap-2 font-medium w-fit mx-auto border-[1px]"
  const eventTypePalette = {
    URGENT: {
      class: "b-fa-bell !bg-warning-25 !text-warning-500 !border-warning-500",
    },
    REGULAR: {
      class: "b-fa-box-open !bg-teal-25 !text-teal-500 !border-teal-500",
    },
    SPECIAL: {
      class: "b-fa-snowflake !bg-cyan-25 !text-cyan-500 !border-cyan-500",
    }
  }
  const eventType = record.getData("type") as keyof typeof eventTypePalette;

  return {
    tag: "div",
    class: cn(baseClass, eventTypePalette[eventType].class),
    text: record.getData("type")
  };
}

export const unplannedGridConfig: BryntumGridProps = {
  selectionMode: {
    cell: false,
  },
  stripeFeature: false,
  collapsible: true,
  header: false,
  flex: 1,
  id: "unplannedGrid",
  height: "100%",
  sortFeature: "name",
  columnLines: false,
  cls: 'border-[1px] border-border rounded-b-3xl overflow-hidden',
  columns: [
    {
      text: "Comment",
      field: "comment",
      flex: 1,
      style: {
        color: 'text-text-base'
      }
    },
    {
      text: "Type",
      editor: false,
      align: "center",
      renderer: eventTypeCellRenderer,
    },
    {
      type: "time",
      editor: false,
      text: "Start",
      field: "plannedFrom",
      format: "HH:mm",
      width: "4em",
      minWidth: "2em",
      style: {
        color: 'text-text-base'
      }
    },
    {
      type: "duration",
      editor: false,
      text: "Duration",
      field: "duration",
      autoWidth: true,
      style: {
        color: 'text-text-base'
      }
    },
  ] as GridColumnConfig[],

  rowHeight: 50,
  disableGridRowModelWarning: true,
};
