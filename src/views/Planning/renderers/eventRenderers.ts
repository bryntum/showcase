import { capitalize, get } from "lodash";

export const detailedEventRenderer = ({ eventRecord, renderData }: any) => {
  const eventPalette = {
    URGENT: {
      class: "!bg-warning-200 !border-warning-400 !text-event-text",
      icon: "fa fa-bell text-xs",
    },
    REGULAR: {
      class: "!bg-teal-200 !border-teal-400 !text-event-text",
      icon: "fa fa-box-open text-xs",
    },
    SPECIAL: {
      class: "!bg-cyan-200 !border-cyan-400 !text-event-text",
      icon: "fa fa-snowflake text-xs",
    },
  };
  const eventType = eventRecord.getData("type") as keyof typeof eventPalette;
  renderData.cls += ` ${
    get(eventPalette, eventType, eventPalette.REGULAR).class
  }`;

  return [
    {
      children: [
        {
          class: "b-event-type",
          style: {
            display: "flex",
            gap: "0.25rem",
            alignItems: "center",
          },
          children: [
            {
              tag: "div",
              class: get(eventPalette, eventType, eventPalette.REGULAR).icon,
            },
            {
              tag: "span",
              class: "b-event-name text-event-text text-base",
              text: capitalize(
                get(eventRecord.getData("type"), "type", "regular")
              ),
            },
          ],
        },
        {
          class:
            "text-event-text overflow-ellipsis overflow-hidden text-sm/6 font-light",
          html: eventRecord.getData("comment"),
        },
        {
          class: "b-event-time text-event-text text-2xs font-light",
          text: `${(eventRecord.startDate as Date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${(eventRecord.endDate as Date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
        },
      ],
    },
  ];
};

export const basicEventRenderer = ({ eventRecord, renderData }: any) => {
  const eventPalette = {
    URGENT: {
      class: "!bg-warning-200 !border-warning-400 !text-event-text",
      icon: "fa fa-bell text-xs",
    },
    REGULAR: {
      class: "!bg-teal-200 !border-teal-400 !text-event-text",
      icon: "fa fa-box-open text-xs",
    },
    SPECIAL: {
      class: "!bg-cyan-200 !border-cyan-400 !text-event-text",
      icon: "fa fa-snowflake text-xs",
    },
  };
  const eventType = eventRecord.getData("type") as keyof typeof eventPalette;
  renderData.cls += ` ${
    get(eventPalette, eventType, eventPalette.REGULAR).class
  }`;

  return [
    {
      children: [
        {
          class:
            "text-event-text overflow-ellipsis overflow-hidden text-sm/6 font-light",
          html: eventRecord.getData("comment"),
        },
      ],
    },
  ];
};