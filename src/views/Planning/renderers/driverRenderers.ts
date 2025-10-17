import { ResourceModel } from "@bryntum/scheduler-thin";

export const detailedDriverRenderer = ({
  record,
}: {
  record: ResourceModel;
  cellElement: HTMLElement;
}) => {
  return {
    tag: "div",
    class: "b-resource-info",
    children: [
      {
        tag: "img",
        src: `/${record.getData("image")}`,
        style: {
          minWidth: "3em",
          minHeight: "3em",
        },
        class: "b-resource-avatar b-resource-image",
      },
      {
        tag: "dl",
        class: "flex flex-col gap-1",
        children: [
          {
            tag: "dt",
            class: "font-medium",
            html: record.getData("name"),
          },
          {
            tag: "dl",
            class: "vehicle-assignments flex flex-col gap-1 !text-xs",
            children: [
              record.getData("vehicle")
                ? {
                    tag: "dd",
                    class: "flex items-center gap-1 !font-xs",
                    children: [
                      {
                        tag: "i",
                        class: "fa fa-truck",
                      },
                      {
                        tag: "span",
                        html: record.getData("vehicle"),
                      },
                    ],
                  }
                : {
                    tag: "dd",
                    class:
                      "flex items-center gap-1 !text-warning-600 font-normal",
                    children: [
                      {
                        tag: "i",
                        class: "fa fa-triangle-exclamation",
                      },
                      {
                        tag: "span",
                        html: "No vehicle assigned",
                      },
                    ],
                  },
              record.getData("trailer")
                ? {
                    tag: "dd",
                    class: "flex items-center gap-1 font-normal",
                    children: [
                      {
                        tag: "i",
                        class: "fa fa-trailer",
                      },
                      {
                        tag: "span",
                        html: record.getData("trailer"),
                      },
                    ],
                  }
                : {
                    tag: "dd",
                    class:
                      "flex items-center gap-1 !text-warning-600 font-normal",
                    children: [
                      {
                        tag: "i",
                        class: "fa fa-triangle-exclamation",
                      },
                      {
                        tag: "span",
                        html: "No trailer assigned",
                      },
                    ],
                  },
            ],
          },
        ],
      },
    ],
  };
};

export const basicDriverRenderer = ({
  record,
}: {
  record: ResourceModel;
  cellElement: HTMLElement;
}) => {
  return {
    tag: "div",
    class: "b-resource-info",
    children: [
      {
        tag: "dt",
        class: "font-medium",
        html: record.getData("name"),
      },
    ],
  };
};