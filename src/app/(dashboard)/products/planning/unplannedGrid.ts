import { Model } from "@bryntum/core-thin";
import { BryntumGridProps } from "@bryntum/grid-react-thin";
import { GridColumnConfig } from "@bryntum/grid-thin";
import { toLower } from "lodash";

export const eventPalette = {
  URGENT: {
    color: "#6BA9F7",
    iconColor: "#357ABD"
  },
  REGULAR: {
    color: "#33B5B4",
    iconColor: "#248D8A"
  },
  SPECIAL: {
    color: "#BC7AD8",
    iconColor: "#8A4FA1"
  }
};

export const unplannedGridConfig: BryntumGridProps = {
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
      flex: 1,
    },
    {
      text: "Type",
      editor: false,
      renderer: ({ record }: { record: Model }) => {
        const eventType = record.getData("type") as keyof typeof eventPalette;

        return {
          tag: "div",
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            padding: "2px 10px",
            borderRadius: "9999px",
            backgroundColor: `${eventPalette[eventType].color}80`,
            border: `1px solid ${eventPalette[eventType].iconColor}`,
            fontSize: "0.75rem",
            fontWeight: "500",
            color: `hsl(var(--event-${toLower(eventType)}-text))`,
            width: "fit-content",
            margin: "0 auto",
          },
          text: record.getData("type")
        };
      },
    },
    {
      type: "time",
      editor: false,
      text: "Start",
      field: "plannedFrom",
      format: "HH:mm",
      width: "4em",
      minWidth: "2em",
    },
    {
      type: "duration",
      editor: false,
      text: "Duration",
      field: "duration",
      autoWidth: true,
    },
  ] as GridColumnConfig[],

  rowHeight: 50,
  disableGridRowModelWarning: true,
};
