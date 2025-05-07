"use client";

import {
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
import { Delivery } from "@prisma/client";
import { Scheduler } from "@bryntum/scheduler-thin";
import { ResourceInfoColumn } from "@bryntum/scheduler-thin";
import { BryntumSplitter } from "@bryntum/core-react-thin";
import { BryntumGrid } from "@bryntum/grid-react-thin";
import unplannedGridConfig from "./unplannedGrid";
import { isSameDay } from "date-fns";
import { Input } from "components/ui/forms/input";
import { Grid } from "@bryntum/grid-thin";
import { Drag } from "./drag";

const Planning = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState<
    { label: string; value: string | number }[]
  >([]);
  const [resourceFilter, setResourceFilter] = useState<string>("");
  const [eventFilter, setEventFilter] = useState<string>("");

  const $unplannedGridRef = useRef<BryntumGrid>(null);
  const $dragRef = useRef<Drag>(null);

  const [grid, setGrid] = useState<Grid>();
  const [scheduler, setScheduler] = useState<SchedulerPro>();

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
          eventStore.query((event: Delivery) =>
            isSameDay(event.actualFrom as Date, selectedDate)
          )
        )
          ? `${Math.round(
              (eventStore.query(
                (event: Delivery) =>
                  isSameDay(event.actualFrom as Date, selectedDate) &&
                  event.driverId &&
                  event.actualTo &&
                  event.plannedTo &&
                  event.actualTo <= event.plannedTo
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
      { label: "Avg Delivery Time", value: "28m" },
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
        transformLoadedData: (data: Delivery[]) =>
          map(data, (delivery) => ({
            ...delivery,
            resourceId: delivery.driverId,
            startDate: delivery.actualFrom,
            endDate: delivery.actualTo,
            plannedFrom: new Date(delivery.plannedFrom as Date),
            plannedTo: new Date(delivery.plannedTo as Date),
            actualFrom: new Date(delivery.actualFrom as Date),
            actualTo: new Date(delivery.actualTo as Date),
          })),
        autoCommit: true,
        onLoad: updateMetrics,
        onCommit: ({ changes }) => {
          // @ts-expect-error changes is typed incorrectly
          const { modified, removed } = changes;

          const promises: Promise<Response>[] = [];

          if (!isEmpty(modified)) {
            forEach(modified, (eventRecord) => {
              const { id, startDate, endDate, resourceId } = eventRecord;

              eventRecord.actualFrom = new Date(startDate);
              eventRecord.actualTo = new Date(endDate);

              promises.push(
                fetch(`/api/deliveries/${id}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    driverId: resourceId,
                    actualFrom: startDate.toISOString(),
                    actualTo: endDate.toISOString(),
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
    minHeight: 500,
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
        width: 220,
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

    stripeFeature: true,
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
      renderData.eventColor =
        eventRecord.getData("type") === "URGENT" ? "red" : "green";

      return [
        {
          children: [
            {
              class: "b-event-name",
              text: eventRecord.getData("type"),
            },
            {
              html: eventRecord.getData("comment"),
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
            startDate: new Date(selectedEvent.getData("plannedFrom")),
            endDate: new Date(selectedEvent.getData("plannedTo")),
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
    } else {
      eventStore.removeFilter("eventFilter");
    }
  }, [eventFilter, eventStore]);

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
                  className="h-9 w-[150px] text-gray-600 border-gray-200 focus:ring-gray-200"
                />
                <Input
                  type="text"
                  placeholder="Filter deliveries..."
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="h-9 w-[150px] text-gray-600 border-gray-200 focus:ring-gray-200"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {selectedDate.toLocaleDateString() ===
                    new Date().toLocaleDateString()
                      ? "Today"
                      : selectedDate.toLocaleDateString()}
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
          <div className="flex flex-1">
            <SchedulerWrapper flex={3} {...schedulerConfig} />
            <BryntumSplitter />
            <BryntumGrid
              flex={1}
              store={eventStore.chain((event: Delivery) => !event.driverId)}
              ref={$unplannedGridRef}
              {...unplannedGridConfig}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planning;
