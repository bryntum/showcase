"use client";

import { useMemo, useRef, useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { Delivery, Driver, Item } from "@prisma/client";
import { map, toLower, every } from "lodash";
import { BryntumGridProps } from "@bryntum/grid-react-thin";
import { BryntumGrid } from "@bryntum/grid-react-thin";
import { AjaxStore, DateHelper, Model } from "@bryntum/core-thin";
import { Button } from "components/ui/actions/button";

import { DurationColumn } from "@bryntum/scheduler-thin";
import { Calendar } from "components/ui/actions/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "components/ui/overlays/dropdown-menu";
import { useDate } from "contexts/date-context";
import { isSameDay } from "date-fns";
import { BryntumButton, BryntumTextField } from "@bryntum/core-react-thin";
import { GridWrapper } from "components/ui/grid/GridWrapper";
import CreateDeliveryModal from "./partials/CreateDeliveryModal";
import { eventTypeCellRenderer } from "views/Planning/partials/UnplannedGridConfig";

const DeliveriesView = () => {
  const $gridRef = useRef<BryntumGrid>(null);
  const [deliveryFilter, setDeliveryFilter] = useState<string>("");
  const { selectedDate, setSelectedDate } = useDate();

  const store = useMemo(
    () =>
      new AjaxStore({
        readUrl: "/api/deliveries",
        autoLoad: true,
        // @ts-expect-error function is typed incorrectly
        transformLoadedData: (data: Delivery<Driver, Item>[]) =>
          map(data, (delivery) => ({
            ...delivery,
            driverName: delivery.driver?.name ?? "No Driver Assigned",
            driverImagePath: `/drivers/${toLower(delivery.driver?.name)}.jpg`,
            itemName: delivery.item?.name ?? "No Item Assigned",
            duration: {
              magnitude:
                delivery.durationInMinutes >= 60
                  ? delivery.durationInMinutes / 60
                  : delivery.durationInMinutes,
              unit: delivery.durationInMinutes >= 60 ? "hour" : "minute",
            },
          })),
        autoCommit: true,
      }),
    []
  );

  useEffect(() => {
    if (store) {
      store.clearFilters();
      store.addFilter({
        id: "dateFilter",
        filterBy: (record) =>
          isSameDay(new Date(record.getData("plannedFrom")), selectedDate),
      });

      if (deliveryFilter) {
        store.filterBy((record: Model) => {
          const comment = record.getData("comment");
          const itemName = record.getData("itemName");
          const driverName = record.getData("driverName");
          const type = record.getData("type");
          const checks = [];

          checks.push(
            comment?.toLowerCase().includes(deliveryFilter.toLowerCase()) ||
              itemName?.toLowerCase().includes(deliveryFilter.toLowerCase()) ||
              driverName
                ?.toLowerCase()
                .includes(deliveryFilter.toLowerCase()) ||
              type?.toLowerCase().includes(deliveryFilter.toLowerCase())
          );
          return every(checks);
        });
      }
    }
  }, [selectedDate, store, deliveryFilter]);

  const handleDeliveryCreated = () => {
    // Refresh the grid data
    store.load();
  };

  const gridConfig: BryntumGridProps = {
    cellEditFeature: true,
    sortFeature: "name",
    showDirty: true,
    store,
    height: "100%",
    cls: "!border-border !border-[1px] rounded-3xl overflow-hidden",
    columns: [
      {
        text: "Comment",
        field: "comment",
        flex: 1,
      },
      {
        text: "Type",
        field: "type",
        width: "9em",
        align: "center",
        editor: { type: "dropdown", items: ["URGENT", "REGULAR", "SPECIAL"] },
        renderer: eventTypeCellRenderer,
      },
      {
        text: "Planned From",
        type: "time",
        width: "11em",
        renderer: ({ value }) =>
          value ? DateHelper.format(new Date(value), "HH:mm") : "",
        field: "plannedFrom",
      },
      {
        text: "Duration",
        field: DurationColumn.type,
        type: "duration",
        width: "9em",
        sortable(d1: Model, d2: Model) {
          return (
            d1.getData("durationInMinutes") - d2.getData("durationInMinutes")
          );
        },
      },
      {
        text: "Driver",
        field: "driverName",
        renderer: ({ value, record }: { value: string; record: Model }) => {
          return {
            tag: "div",
            class: "flex items-center gap-2",
            children: [
              record.getData("driverName") === "No Driver Assigned"
                ? {
                    tag: "span",
                    class: "text-sm font-medium",
                    text: "No Driver Assigned",
                  }
                : [
                    {
                      tag: "img",
                      style: {
                        width: "2em",
                        height: "2em",
                        borderRadius: "50%",
                      },
                      src: record.getData("driverImagePath"),
                      alt: record.getData("driverName"),
                    },
                    {
                      tag: "span",
                      class: "text-sm font-medium",
                      text: value,
                    },
                  ],
            ],
          };
        },
        editor: null,
        width: "10em",
      },
      { text: "Item", editor: null, field: "itemName", width: "15em" },
    ],
  };

  return (
    <div className="h-full">
      <div className="p-4 h-full bg-logistics-navy text-white">
        <div className="container h-full mx-auto flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 p-2 bg-card rounded-full">
              <BryntumTextField
                placeholder="Filter deliveries..."
                value={deliveryFilter}
                label={undefined}
                cls="text-input"
                onInput={(e) => setDeliveryFilter(e.value)}
              />
            </div>
            <div className="flex w-full justify-end space-x-2">
              <div className="flex items-center space-x-2 p-2 bg-card rounded-full">
                <BryntumButton
                  cls="fa fa-chevron-left !rounded-full !border-teal-500 !text-teal-500 !bg-card hover:!bg-teal-50 !min-h-10 !h-10 !w-10"
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
                      <FontAwesomeIcon
                        icon={faCalendar}
                        className="h-4 w-4 mr-1 text-teal-500"
                      />
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
                  cls="fa fa-chevron-right !rounded-full !bg-card !border-teal-500 !text-teal-500 hover:!bg-teal-50 !min-h-10 !h-10 !w-10"
                  onClick={() => {
                    const nextDay = new Date(selectedDate);
                    nextDay.setDate(nextDay.getDate() + 1);
                    setSelectedDate(nextDay);
                  }}
                />
                <CreateDeliveryModal
                  onDeliveryCreated={handleDeliveryCreated}
                />
              </div>
            </div>
          </div>
          <GridWrapper ref={$gridRef} {...gridConfig} />
        </div>
      </div>
    </div>
  );
};

export default DeliveriesView;
