"use client";

import {
  EventModel,
  EventStore,
  ResourceModel,
  ResourceStore,
  SchedulerPro,
  SchedulerProColumnConfig,
} from "@bryntum/schedulerpro-thin";
import { BryntumSchedulerProProps } from "@bryntum/schedulerpro-react-thin/src/BryntumSchedulerPro";
import { Button } from "components/ui/actions/button";
import { Calendar } from "components/ui/actions/calendar";
import {
  AlertTriangleIcon,
  Calendar as CalendarIcon,
  ClockIcon,
  TrendingUpIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";
import { SchedulerProWrapper } from "components/ui/scheduler/SchedulerProWrapper";
import { useEffect, useMemo, useRef, useState } from "react";
import { forEach, isEmpty, map, toLower } from "lodash";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "components/ui/overlays/dropdown-menu";
import { Client, Delivery, Vehicle, VehicleAssignment } from "@prisma/client";
import { Scheduler, TimeAxis } from "@bryntum/scheduler-thin";
import {
  BryntumButton,
  BryntumSlideToggle,
  BryntumTextField,
} from "@bryntum/core-react-thin";
import { unplannedGridConfig } from "./UnplannedGrid";
import { isSameDay } from "date-fns";
import { Grid } from "@bryntum/grid-thin";
import { Drag } from "./Drag";
import { useDate } from "../../../../contexts/date-context";
import MapPanel from "./MapPanel";
import { SlideToggle } from "@bryntum/core-thin";
import MetricCard, { MetricCardProps } from "./MetricCard";
import { GridWrapper } from "components/ui/grid/GridWrapper";
import { BryntumGrid } from "@bryntum/grid-react-thin";

const Planning = () => {
  const [metrics, setMetrics] = useState<MetricCardProps[]>([]);
  const [resourceFilter, setResourceFilter] = useState<string>("");
  const [eventFilter, setEventFilter] = useState<string>("");
  const [grid, setGrid] = useState<Grid>();
  const [scheduler, setScheduler] = useState<SchedulerPro>();

  const { selectedDate, setSelectedDate } = useDate();

  const $unplannedGridRef = useRef<BryntumGrid>(null);
  const $dragRef = useRef<Drag>(null);

  const updateMetrics = () => {
    const driversWithoutVehicle = resourceStore.query(
      (resource: ResourceModel) => !resource.getData("vehicle")
    ).length;

    setMetrics([
      {
        title: "Active Drivers",
        value: resourceStore.query(
          (resource: ResourceModel) =>
            !isEmpty(resource.events) &&
            resource.events.some((event) =>
              isSameDay(event.startDate, selectedDate)
            )
        ).length,
        icon: UsersIcon,
        trend: (
          <div className="flex items-center">
            <AlertTriangleIcon className="mr-1" size={16} />
            {driversWithoutVehicle} missing{" "}
            {driversWithoutVehicle === 1 ? "vehicle" : "vehicles"}
          </div>
        ),
        badge: {
          type: "neutral",
          href: "/products/vehicles",
          label: "Assign now",
        },
      },
      {
        title: "Deliveries Today",
        value: eventStore.query(
          (event: Delivery) =>
            isSameDay(event.actualFrom as Date, selectedDate) && event.driverId
        ).length,
        icon: TruckIcon,
        trend: "3 more than average",
        badge: {
          type: "positive",
          label: "15%",
        },
      },
      {
        title: "On-Time Rate",
        value: !isEmpty(
          eventStore.query(
            (event: Delivery) =>
              isSameDay(event.actualFrom as Date, selectedDate) &&
              event.driverId
          )
        )
          ? `${Math.round(
              (eventStore.query(
                (event: Delivery) =>
                  isSameDay(event.actualFrom as Date, selectedDate) &&
                  event.driverId &&
                  event.actualFrom &&
                  event.plannedFrom &&
                  event.actualFrom <= event.plannedFrom
              ).length /
                eventStore.query(
                  (event: Delivery) =>
                    isSameDay(event.actualFrom as Date, selectedDate) &&
                    event.driverId
                ).length) *
                100
            )}%`
          : "0%",
        icon: TrendingUpIcon,
        trend: "below average",
        badge: {
          type: "negative",
          label: "20,3%",
        },
      },
      {
        title: "Avg Delivery Time",
        value: !isEmpty(
          eventStore.query(
            (event: Delivery) =>
              isSameDay(event.actualFrom as Date, selectedDate) &&
              event.driverId
          )
        )
          ? `${Math.round(
              eventStore
                .query(
                  (event: Delivery) =>
                    isSameDay(event.actualFrom as Date, selectedDate) &&
                    event.driverId
                )
                .reduce(
                  (sum, event) => sum + ((event as EventModel)?.duration ?? 0),
                  0
                ) /
                eventStore.query(
                  (event: Delivery) =>
                    isSameDay(event.actualFrom as Date, selectedDate) &&
                    event.driverId
                ).length
            )}m`
          : "Not Applicable",
        icon: ClockIcon,
        trend: "above average",
        badge: {
          type: "positive",
          label: "10m",
        },
      },
    ]);
  };

  useEffect(() => {
    setGrid($unplannedGridRef.current?.instance);
  }, [$unplannedGridRef]);

  const eventStore = useMemo(
    () =>
      new EventStore({
        readUrl: "/api/deliveries",
        autoLoad: true,
        // @ts-expect-error function is typed incorrectly
        transformLoadedData: (data: Delivery<Client>[]) =>
          map(data, (delivery) => ({
            ...delivery,
            resourceId: delivery.driverId,
            startDate: delivery.actualFrom,
            duration: delivery.durationInMinutes,
            durationUnit: "m",
            preamble: delivery.preambleInMinutes
              ? `${delivery.preambleInMinutes} minute`
              : undefined,
            postamble: delivery.postambleInMinutes
              ? `${delivery.postambleInMinutes} minute`
              : undefined,
            plannedFrom: new Date(delivery.plannedFrom as Date),
            actualFrom: new Date(delivery.actualFrom as Date),
            address: {
              lat: delivery.client.lat,
              lng: delivery.client.lng,
            },
          })),
        autoCommit: true,
        onLoad: updateMetrics,
        onCommit: ({ changes }) => {
          // @ts-expect-error changes is typed incorrectly
          const { modified, removed } = changes;

          const promises: Promise<Response>[] = [];

          if (!isEmpty(modified)) {
            forEach(modified, (eventRecord) => {
              const { id, startDate, resourceId } = eventRecord;

              eventRecord.actualFrom = new Date(startDate);

              promises.push(
                fetch(`/api/deliveries/${id}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    driverId: resourceId,
                    actualFrom: startDate.toISOString(),
                    durationInMinutes: eventRecord.getData("duration"),
                  }),
                })
              );
            });
          }

          if (!isEmpty(removed)) {
            forEach(removed, (eventRecord) => {
              const { id } = eventRecord;

              promises.push(
                fetch(`/api/deliveries/${id}`, {
                  method: "DELETE",
                })
              );
            });
          }

          Promise.all(promises);
          updateMetrics();
        },
      }),
    []
  );

  const resourceStore = useMemo(
    () =>
      new ResourceStore({
        readUrl: "/api/drivers",
        autoLoad: true,
        onLoad: updateMetrics,
        sorters: [
          {
            field: "name",
            ascending: true,
          },
        ],
        // @ts-expect-error function is typed incorrectly
        transformLoadedData: (data: Driver<VehicleAssignment<Vehicle>[]>[]) =>
          map(data, (driver) => {
            return {
              ...driver,
              id: driver.id,
              image: `drivers/${toLower(driver.name)}.jpg`,
              vehicle: driver.assignments[0]?.vehicle
                ? `${driver.assignments[0]?.vehicle?.VINNumber} - ${driver.assignments[0]?.vehicle?.name}`
                : undefined,
              trailer: driver.assignments[0]?.trailer
                ? `${driver.assignments[0]?.trailer?.VINNumber} - ${driver.assignments[0]?.trailer?.name}`
                : undefined,
            };
          }),
      }),
    []
  );

  const schedulerConfig: BryntumSchedulerProProps = {
    rowHeight: 90,
    barMargin: 10,
    width: "100%",
    height: "100%",
    eventStyle: "plain",
    regionResizeFeature: false,
    columnLines: false,
    rowLines: false,
    allowOverlap: false,
    useInitialAnimation: false,
    cls: "border-border border-[1px] rounded-3xl overflow-hidden",
    eventStore,
    resourceStore,
    eventBufferFeature: {
      renderer({ eventRecord, preambleConfig, postambleConfig }) {
        if (eventRecord.preamble) {
          preambleConfig.icon = "b-fa b-fa-truck";
          preambleConfig.cls = "travel-before";
          preambleConfig.text = eventRecord.preamble.toString(true);
        }

        if (eventRecord.postamble) {
          postambleConfig.icon = "b-fa b-fa-truck";
          postambleConfig.cls = "travel-after";
          postambleConfig.text = eventRecord.postamble.toString(true);
        }
      },
    },
    columns: [
      {
        field: "name",
        text: "Driver",
        width: 320,
        renderer: ({
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
                  width: "3em",
                  height: "3em",
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
                    class:
                      "vehicle-assignments text-teal-500 flex flex-col gap-1",
                    children: [
                      record.getData("vehicle")
                        ? {
                            tag: "dd",
                            class: "b-fa b-fa-truck before:mr-2 font-normal",
                            html: record.getData("vehicle"),
                          }
                        : {
                            tag: "dd",
                            class: "!text-warning-600 font-normal",
                            html: "No vehicle assigned",
                          },
                      record.getData("trailer")
                        ? {
                            tag: "dd",
                            class: "b-fa b-fa-trailer before:mr-2 font-normal",
                            html: record.getData("trailer"),
                          }
                        : {
                            tag: "dd",
                            class: "!text-warning-600 font-normal",
                            html: "No trailer assigned",
                          },
                    ],
                  },
                ],
              },
            ],
          };
        },
      },
    ] as SchedulerProColumnConfig[],
    viewPreset: {
      id: "preset",
      headers: [
        {
          unit: "h",
          align: "center",
          dateFormat: "HH",
        },
      ],
      timeResolution: {
        increment: 5,
        unit: "m",
      },
    },
    zoomOnMouseWheel: false,
    zoomKeepsOriginalTimespan: true,

    eventDragFeature: {
      constrainDragToTimeline: false,
      dragHelperConfig: {
        constrain: false,
        dropTargetCls: "b-drop-target",
        dropTargetSelector: ".b-grid-subgrid",
        listeners: {
          drop: ({ context }) => {
            if (context.target.id === "unplannedGrid-normalSubgrid") {
              const eventId = context.grabbed.dataset["eventId"];
              const resourceId = context.grabbed.dataset["resourceId"];

              if (!eventId || !resourceId) return;

              const event = eventStore.getById(eventId) as EventModel;
              const resource = resourceStore.getById(
                resourceId
              ) as ResourceModel;

              event.unassign(resource);
              event.set("driverId", null);
              event.set("actualFrom", null);
            }
          },
        },
      },
    },

    timeSpanHighlightFeature: true,
    eventMenuFeature: {
      items: {
        deleteEvent: {
          text: "Delete appointment",
        },
        unassignEvent: {
          text: "Unschedule appointment",
        },
      },
    },
    eventRenderer({ eventRecord, renderData }) {
      const eventPalette = {
        URGENT: {
          class: "!bg-warning-400 !text-event-text",
          icon: "b-fa b-fa-bell",
        },
        REGULAR: {
          class: "!bg-teal-100 !text-event-text",
          icon: "b-fa b-fa-box-open",
        },
        SPECIAL: {
          class: "!bg-cyan-300 !text-event-text",
          icon: "b-fa b-fa-snowflake",
        },
      };
      const eventType = eventRecord.getData(
        "type"
      ) as keyof typeof eventPalette;
      renderData.cls += ` ${eventPalette[eventType].class}`;

      return [
        {
          children: [
            {
              class: `b-event-type`,
              style: {
                display: "flex",
                alignItems: "center",
              },
              children: [
                {
                  tag: "div",
                  class: eventPalette[eventType].icon,
                },
                {
                  class: "b-event-name text-event-text text-base",
                  text:
                    eventRecord.getData("type").charAt(0).toUpperCase() +
                    eventRecord.getData("type").slice(1).toLowerCase(),
                },
              ],
            },
            {
              class:
                "text-event-text overflow-ellipsis overflow-hidden text-sm/6 font-light",
              html: eventRecord.getData("comment"),
            },
            {
              class: "b-event-time text-event-text text-2xs font-light ",
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
    },

    listeners: {
      paint: ({ firstPaint, source }) => {
        if (firstPaint) {
          (source as Scheduler).setTimeSpan(
            new Date(selectedDate.setHours(7, 0, 0, 0)),
            new Date(selectedDate.setHours(19, 0, 0, 0))
          );
          setScheduler(source as SchedulerPro);
        }
      },
      eventSelectionChange({ selected }) {
        const selectedEvent = selected[0];

        if (!scheduler) return;

        if (selectedEvent) {
          scheduler.highlightTimeSpan({
            animationId: "deliveryWindow",
            surround: true,
            name: "Outside Delivery Window",
            startDate: selectedEvent.getData("plannedFrom"),
            endDate: new Date(
              selectedEvent.getData("plannedFrom").getTime() +
                selectedEvent.getData("duration") * 60 * 1000
            ),
          });
        } else {
          scheduler.unhighlightTimeSpans();
        }
      },
    },
  };

  useEffect(() => {
    if (!scheduler || !grid) {
      return;
    }

    ($dragRef as Drag).current = new Drag({
      grid: grid!,
      schedule: scheduler!,
      constrain: false,
      outerElement: grid!.element,
    });
  }, [scheduler, grid]);

  useEffect(() => {
    if (scheduler) {
      scheduler.setTimeSpan(
        new Date(selectedDate.setHours(7, 0, 0, 0)),
        new Date(selectedDate.setHours(19, 0, 0, 0))
      );
      updateMetrics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  useEffect(() => {
    if (resourceFilter !== "") {
      resourceStore.addFilter({
        id: "resourceFilter",
        property: "name",
        operator: "includes",
        value: resourceFilter,
        caseSensitive: false,
      });
    } else {
      resourceStore.removeFilter("resourceFilter");
    }
  }, [resourceFilter, resourceStore]);

  useEffect(() => {
    if (eventFilter !== "") {
      eventStore.addFilter({
        id: "eventFilter",
        property: "comment",
        operator: "includes",
        value: eventFilter,
        caseSensitive: false,
      });
      if (scheduler?.selectedEvents?.length ?? 0 > 0) {
        scheduler?.deselectAll();
      }
    } else {
      eventStore.removeFilter("eventFilter");
    }
  }, [eventFilter, eventStore]);

  const onMarkerClick = async ({
    eventRecord,
  }: {
    eventRecord: EventModel;
  }) => {
    if (eventRecord.resources.length > 0 && scheduler) {
      await scheduler.scrollEventIntoView(eventRecord, {
        animate: true,
        highlight: true,
      });
      scheduler.selectedEvents = [eventRecord];
    } else {
      await (grid as any).expand();
      (scheduler?.widgetMap["toggleUnscheduled"] as SlideToggle).value = true;
      grid?.scrollRowIntoView(eventRecord, {
        animate: true,
        highlight: true,
      });
    }
  };

  useEffect(() => {
    if (!scheduler) return;

    const mapPanel = new MapPanel({
      ref: "map",
      appendTo: "planning-container",
      cls: "border-border border-[1px] rounded-t-3xl overflow-hidden",
      header: false,
      flex: 1,
      eventStore: eventStore,
      timeAxis: scheduler?.timeAxis as TimeAxis,
      listeners: {
        markerclick: onMarkerClick,
      },
    });

    return () => {
      mapPanel.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduler]);

  return (
    <div className="h-full">
      <div className="pt-4 px-4 h-full bg-logistics-navy">
        <div className="h-full mx-auto flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.title} metric={metric} />
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center space-x-2 p-2 bg-card rounded-full">
                <BryntumTextField
                  placeholder="Filter drivers..."
                  value={resourceFilter}
                  cls="scheduler-filter"
                  onInput={(e) => setResourceFilter(e.value)}
                  label={undefined}
                />
                <BryntumTextField
                  placeholder="Filter deliveries..."
                  value={eventFilter}
                  cls="scheduler-filter"
                  onInput={(e) => setEventFilter(e.value)}
                  label={undefined}
                />
                <BryntumSlideToggle
                  label="Show detailed view"
                  labelCls="!text-teal-900"
                  value={true}
                  onChange={({ checked }) => {
                    document
                      .querySelectorAll(
                        ".vehicle-assignments, .b-event-type, .b-event-time, .b-resource-avatar"
                      )
                      .forEach((element) => {
                        element.classList.toggle("b-hidden", !checked);
                      });

                    scheduler?.setConfig({ rowHeight: checked ? 80 : 40 });
                  }}
                />
              </div>
              <div className="flex items-center space-x-2 p-2 bg-card rounded-full">
                <BryntumButton
                  cls="b-fa b-fa-chevron-left !rounded-full !bg-card !border-teal-500 !text-teal-500 hover:!bg-teal-50 !min-h-10 !h-10 !w-10"
                  onClick={() => {
                    const prevDay = new Date(selectedDate);
                    prevDay.setDate(prevDay.getDate() - 1);
                    setSelectedDate(prevDay);
                  }}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      className="rounded-full bg-card h-10 !border-teal-500 !text-teal-500 border-[1px] hover:bg-teal-50"
                    >
                      <CalendarIcon className="h-4 w-4 mr-1 text-teal-500" />
                      <p className="text-text-base">
                        {selectedDate.toLocaleDateString() ===
                        new Date().toLocaleDateString()
                          ? "Today"
                          : selectedDate.toLocaleDateString()}
                      </p>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-auto p-0" align="end">
                    <div className="!rounded-full !bg-card !border-teal-500 !text-teal-500 !min-h-10 !h-10">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedDate(new Date())}
                      >
                        Today
                      </Button>
                    </div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date ?? new Date());
                      }}
                      initialFocus
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
                <BryntumButton
                  cls="b-fa b-fa-chevron-right !rounded-full !bg-card !border-teal-500 !text-teal-500 hover:!bg-teal-50 !min-h-10 !h-10 !w-10"
                  onClick={() => {
                    const nextDay = new Date(selectedDate);
                    nextDay.setDate(nextDay.getDate() + 1);
                    setSelectedDate(nextDay);
                  }}
                />
              </div>
            </div>
          </div>
          <div id="planning-container" className="flex-1 flex flex-col gap-8">
            <div className="flex gap-8" style={{ flex: 2 }}>
              <SchedulerProWrapper flex={3} {...schedulerConfig} />
              <GridWrapper
                store={eventStore.chain((event: Delivery) => !event.driverId)}
                innerRef={$unplannedGridRef}
                onSelectionChange={({ selected }) => {
                  if (selected.length > 0) {
                    const event = selected[0];

                    if (!event || !scheduler) return;

                    scheduler.highlightTimeSpan({
                      name: "Ideal Delivery Window",
                      startDate: event.getData("plannedFrom"),
                      endDate: new Date(
                        event.getData("plannedFrom").getTime() +
                          event.getData("duration") * 60 * 1000
                      ),
                    });
                  }
                }}
                {...unplannedGridConfig}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planning;
