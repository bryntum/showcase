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
import { Calendar as CalendarIcon } from "lucide-react";
import { SchedulerWrapper } from "components/ui/scheduler/SchedulerWrapper";
import { Truck } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { forEach, isEmpty, map, toLower } from "lodash";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "components/ui/overlays/dropdown-menu";
import { Client, Delivery } from "@prisma/client";
import { Scheduler, TimeAxis } from "@bryntum/scheduler-thin";
import { ResourceInfoColumn } from "@bryntum/scheduler-thin";
import { BryntumSplitter } from "@bryntum/core-react-thin";
import { BryntumGrid } from "@bryntum/grid-react-thin";
import { eventPalette, unplannedGridConfig } from "./unplannedGrid";
import { isSameDay } from "date-fns";
import { Input } from "components/ui/forms/input";
import { Grid } from "@bryntum/grid-thin";
import { Drag } from "./drag";
import { useDate } from "../../../../contexts/date-context";
import MapPanel from "./mapPanel";
import { SlideToggle, Splitter } from "@bryntum/core-thin";

const Planning = () => {
  const { selectedDate, setSelectedDate } = useDate();
  const [metrics, setMetrics] = useState<
    { label: string; value: string | number }[]
  >([]);
  const [resourceFilter, setResourceFilter] = useState<string>("");
  const [eventFilter, setEventFilter] = useState<string>("");
  const [grid, setGrid] = useState<Grid>();
  const [scheduler, setScheduler] = useState<SchedulerPro>();

  const $unplannedGridRef = useRef<BryntumGrid>(null);
  const $dragRef = useRef<Drag>(null);

  const updateMetrics = () => {
    setMetrics([
      {
        label: "Active Drivers",
        value: resourceStore.query(
          (resource: ResourceModel) =>
            !isEmpty(resource.events) &&
            resource.events.some((event) =>
              isSameDay(event.startDate, selectedDate)
            )
        ).length,
      },
      {
        label: "Deliveries Today",
        value: eventStore.query(
          (event: Delivery) =>
            isSameDay(event.actualFrom as Date, selectedDate) && event.driverId
        ).length,
      },
      {
        label: "On-Time Rate",
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
      },
      {
        label: "Avg Delivery Time",
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
            plannedFrom: new Date(delivery.plannedFrom as Date),
            actualFrom: new Date(delivery.actualFrom as Date),
            address: {
              lat: delivery.client.lat,
              lng: delivery.client.lng,
            }
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
        transformLoadedData: (data: Driver[]) =>
          map(data, (driver) => ({
            ...driver,
            id: driver.id,
            image: `drivers/${toLower(driver.name)}.jpg`,
          })),
      }),
    []
  );

  const schedulerConfig: BryntumSchedulerProProps = {
    rowHeight: 80,
    barMargin: 10,
    width: "100%",
    height: "100%",
    eventStyle: "border",
    eventColor: "indigo",
    allowOverlap: false,
    useInitialAnimation: false,
    eventStore,
    resourceStore,
    columns: [
      {
        type: ResourceInfoColumn.type,
        field: "name",
        text: "Driver",
        width: 180,
      },
    ] as SchedulerProColumnConfig[],
    viewPreset: {
      id: "hourAndDay",
      base: "hourAndDay",
      columnLinesFor: 1,
      headers: [
        {
          unit: "d",
          align: "center",
          dateFormat: "DD MMM YYYY",
        },
        {
          unit: "h",
          align: "center",
          dateFormat: "HH",
        },
      ],
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

    columnLinesFeature: true,
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
      const eventType = eventRecord.getData(
        "type"
      ) as keyof typeof eventPalette;
      renderData.eventColor = eventPalette[eventType].color;

      return [
        {
          children: [
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "bold",
                fontSize: "0.9em",
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
                  text: eventRecord.getData("type"),
                },
              ],
            },
            {
              style: {
                fontSize: "0.85em",
                color: "#444",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              },
              html: eventRecord.getData("comment"),
            },
            {
              style: {
                fontSize: "0.8em",
                color: "#666",
                marginTop: "auto",
              },
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

    new Splitter({
      appendTo: "planning-container",
    });

    const mapPanel = new MapPanel({
      ref: "map",
      appendTo: "planning-container",
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
      <div className="p-4 h-full bg-logistics-navy text-white">
        <div className="h-full mx-auto flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="bg-primary p-3 rounded-lg">
                <div className="text-sm text-white">{metric.label}</div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold mr-2">
                    {metric.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-3 md:mb-0">
              <Truck className="h-8 w-8 mr-2 text-gray-500" />
              <h1 className="text-2xl font-bold text-gray-500">
                Driver Planning
              </h1>
            </div>
            <div className="flex space-x-2">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Filter drivers..."
                  value={resourceFilter}
                  onChange={(e) => setResourceFilter(e.target.value)}
                  className="h-9 w-[150px] text-sidebar-secondary bg-background border-border focus:ring-border"
                />
                <Input
                  type="text"
                  placeholder="Filter deliveries..."
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="h-9 w-[150px] text-sidebar-secondary bg-background border-border focus:ring-border"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm">
                    <CalendarIcon className="h-4 w-4 mr-1 text-white" />
                    <p className="text-white">
                      {selectedDate.toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "Today"
                        : selectedDate.toLocaleDateString()}
                    </p>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-auto p-0" align="end">
                  <div className="p-2 border-b">
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
            </div>
          </div>
          <div id="planning-container" className="flex-1 flex flex-col">
            <div
              className="flex border-[1px] border-border rounded-t-md"
              style={{ flex: 2 }}
            >
              <SchedulerWrapper flex={3} {...schedulerConfig} />
              <BryntumSplitter showButtons />
              <BryntumGrid
                store={eventStore.chain((event: Delivery) => !event.driverId)}
                ref={$unplannedGridRef}
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
