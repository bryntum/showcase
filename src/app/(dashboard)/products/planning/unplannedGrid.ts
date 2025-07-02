import { Model } from "@bryntum/core-thin";
import { BryntumGridProps } from "@bryntum/grid-react-thin";
import { GridColumnConfig } from "@bryntum/grid-thin";
import { toLower } from "lodash";

export const eventPalette = {
  URGENT: {
    color: "#fec84b",
    iconColor: "#b54708",
    iconClass: "b-fa b-fa-bell"
  },
  REGULAR: {
    color: "#99f6e0",
    iconColor: "#125d56",
    iconClass: "b-fa b-fa-box-open"
  },
  SPECIAL: {
    color: "#a5f0fc",
    iconColor: "#088ab2",
    iconClass: "b-fa b-fa-snowflake"
  }
};

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
  cls: 'border-[1px] border-border rounded-b-3xl overflow-hidden bg-white',
  columns: [
    {
      text: "Comment",
      field: "comment",
      flex: 1,
      style: {
        color: 'hsl(var(--text))'
      }
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
      style: {
        color: 'hsl(var(--text))'
      }
    },
    {
      type: "duration",
      editor: false,
      text: "Duration",
      field: "duration",
      autoWidth: true,
      style: {
        color: 'hsl(var(--text))'
      }
    },
  ] as GridColumnConfig[],

  rowHeight: 50,
  disableGridRowModelWarning: true,
};
