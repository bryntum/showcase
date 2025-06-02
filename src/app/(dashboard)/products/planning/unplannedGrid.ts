import { Model } from "@bryntum/core-thin";
import { BryntumGridProps } from "@bryntum/grid-react-thin";
import { GridColumnConfig } from "@bryntum/grid-thin";

export const eventPalette = {
  URGENT: {
    color: "#4cc9f0",
    iconColor: "#0066cc",
  },
  REGULAR: {
    color: "#ff9e64",
    iconColor: "#cc5500",
  },
  SPECIAL: {
    color: "#70e000",
    iconColor: "#2d5a00",
  },
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
    },
    {
      text: "Type",
      editor: false,
      renderer: ({ record, cellElement }: { record: Model; cellElement: HTMLElement }) => {
        const eventType = record.getData(
          "type"
        ) as keyof typeof eventPalette;

        cellElement.style.borderLeft = `2px solid ${eventPalette[eventType].iconColor}`;
        cellElement.style.backgroundColor = eventPalette[eventType].color;
        cellElement.style.opacity = "0.8";

        return {
          tag: "div",
          style: {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.8em",
            fontWeight: 600,
          },
          children: [
            {
              style: {
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: eventPalette[eventType].iconColor,
              },
            },
            {
              class: "b-event-name",
              style: {
                color: "#444",
              },
              text: record.getData("type"),
            },
          ],
        };
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
