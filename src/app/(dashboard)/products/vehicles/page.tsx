"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BryntumGrid } from "@bryntum/grid-react-thin";
import { BryntumGridProps } from "@bryntum/grid-react-thin";
import { AjaxStore, Model, StringHelper } from "@bryntum/core-thin";
import { Calendar } from "components/ui/actions/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../../../../components/ui/actions/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "components/ui/overlays/dropdown-menu";
import { useDate } from "../../../../contexts/date-context";
import { every, find, get, map, toLower } from "lodash";
import { Driver, Trailer, Vehicle, VehicleAssignment } from "@prisma/client";
import { VehiclesGridDrag } from "./vehiclesGridDrag";
import { isSameDay } from "date-fns";
import { Grid } from "@bryntum/grid-thin";
import { TrailersGridDrag } from "./trailersGridDrag";
import { DriversGridVehicleDrag } from "./driversGridVehicleDrag";
import { DriversGridTrailerDrag } from "./driversGridTrailerDrag";
import { BryntumButton, BryntumTextField } from "@bryntum/core-react-thin";

const VehiclesPage = () => {
  const { selectedDate, setSelectedDate } = useDate();

  const [driverFilter, setDriverFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");

  const [driversGrid, setDriversGrid] = useState<Grid>();
  const [vehiclesGrid, setVehiclesGrid] = useState<Grid>();
  const [trailersGrid, setTrailersGrid] = useState<Grid>();

  const $driversGridRef = useRef<BryntumGrid>(null);
  const $vehiclesGridRef = useRef<BryntumGrid>(null);
  const $trailersGridRef = useRef<BryntumGrid>(null);
  const $vehiclesGridDragRef = useRef<VehiclesGridDrag>(null);
  const $trailersGridDragRef = useRef<TrailersGridDrag>(null);
  const $driversGridVehicleDragRef = useRef<DriversGridVehicleDrag>(null);
  const $driversGridTrailerDragRef = useRef<DriversGridTrailerDrag>(null);

  const VINRenderer = (VINNumber?: string | null) => {
    if (!VINNumber) return "";

    return {
      tag: "div",
      class: "flex items-center justify-center p-1",
      children: [
        {
          tag: "div",
          class:
            "flex items-center justify-center min-w-[120px] px-2 py-1 rounded bg-card border-2 border-teal-300 text-teal-950 shadow-sm",
          style: {
            fontFamily: "monospace",
            letterSpacing: "0.05em",
            textShadow: "0 1px 1px rgba(0,0,0,0.1)",
          },
          children: [
            {
              tag: "span",
              class: "text-sm font-bold text-teal-900 uppercase tracking-wider",
              text: VINNumber,
            },
          ],
        },
      ],
    };
  };

  const driversStore = useMemo(
    () =>
      new AjaxStore({
        readUrl: "/api/drivers",
        autoLoad: true,
        autoCommit: true,
        transformLoadedData: (data) => {
          return {
            success: true,
            data: map(data, (driver: Driver) => {
              const assignedVehicle: any = find(
                get(driver, "assignments"),
                (vehicleAssignment: VehicleAssignment) =>
                  isSameDay(vehicleAssignment.date, selectedDate)
              );

              return {
                ...driver,
                name: `${driver?.name}`,
                draggable: true,
                driverImagePath: `/drivers/${toLower(driver?.name)}.jpg`,
                vehicleName: assignedVehicle?.vehicle?.name,
                vehicleModel: assignedVehicle?.vehicle?.model,
                vehicleTag: assignedVehicle?.vehicle?.VINNumber,
                trailerName: assignedVehicle?.trailer?.name,
                trailerCapacity:
                  assignedVehicle?.trailer?.capacity &&
                  assignedVehicle?.trailer?.capacityUnit
                    ? `${assignedVehicle?.trailer?.capacity} ${assignedVehicle?.trailer?.capacityUnit}`
                    : undefined,
                trailerTag: assignedVehicle?.trailer?.VINNumber,
              };
            }),
          };
        },
      }),
    [selectedDate]
  );

  const vehiclesStore = useMemo(
    () =>
      new AjaxStore({
        readUrl: "/api/vehicles",
        autoLoad: true,
        autoCommit: true,
        onCommit: ({ changes }) => {
          const modified: any = get(changes, "modified");

          if (!modified || modified.length === 0) return;

          const promises = modified.map((vehicle: Vehicle) => {
            return fetch(`/api/vehicles/${vehicle.id}`, {
              method: "PUT",
              body: JSON.stringify({
                VINNumber: vehicle.VINNumber,
                model: vehicle.model,
                name: vehicle.name,
              }),
            });
          });

          Promise.all(promises);
        },
      }),
    []
  );

  const trailersStore = useMemo(
    () =>
      new AjaxStore({
        readUrl: "/api/trailers",
        autoLoad: true,
        autoCommit: true,
        onCommit: ({ changes }) => {
          const modified: any = get(changes, "modified");

          if (!modified || modified.length === 0) return;

          const promises = modified.map((trailer: Trailer) => {
            return fetch(`/api/trailers/${trailer.id}`, {
              method: "PUT",
              body: JSON.stringify({
                VINNumber: trailer.VINNumber,
                name: trailer.name,
              }),
            });
          });

          Promise.all(promises);
        },
        transformLoadedData: (data) =>
          map(data, (trailer: Trailer) => {
            return {
              ...trailer,
              capacity:
                trailer.capacity && trailer.capacityUnit
                  ? `${trailer.capacity} ${trailer.capacityUnit}`
                  : undefined,
            };
          }),
      }),
    []
  );

  const driversGridConfig: BryntumGridProps = {
    cellEditFeature: true,
    sortFeature: "name",
    store: driversStore,
    rowHeight: 60,
    cellTooltipFeature: {
      hoverDelay: 200,
    },
    columns: [
      {
        text: "Driver",
        field: "name",
        flex: 1,
        renderer: ({
          record,
          cellElement,
        }: {
          record: Model;
          cellElement: HTMLElement;
        }) => {
          cellElement.innerHTML = StringHelper.xss`
            <div class="flex items-center gap-2">
              <img src="${record.getData(
                "driverImagePath"
              )}" alt="${record.getData(
            "name"
          )}" class="w-10 h-10 rounded-full" />
              <span class="text-sm font-medium">${record.getData("name")}</span>
            </div>
          `;
        },
        editor: null,
      },
      {
        text: "Vehicle",
        icon: "b-fa b-fa-truck",
        field: "vehicleTag",
        width: "11em",
        editor: false,
        align: "center",
        renderer: ({ record }: { record: Model }) =>
          VINRenderer(record?.getData("vehicleTag")),
        tooltipRenderer: ({ record }) => {
          const vehicleTag = record.getData("vehicleTag");
          if (!vehicleTag) return null;

          return {
            tag: "div",
            class: "p-3 space-y-2",
            children: [
              {
                tag: "div",
                class: "font-semibold text-base",
                html: `${record.getData("vehicleName")}`,
              },
              {
                tag: "div",
                class: "text-sm text-gray-600",
                html: `${record.getData("vehicleModel")}`,
              },
            ],
          };
        },
      },
      {
        text: "Trailer",
        icon: "b-fa b-fa-trailer",
        field: "trailerTag",
        width: "11em",
        editor: false,
        align: "center",
        renderer: ({ record }: { record: Model }) =>
          VINRenderer(record?.getData("trailerTag")),
        tooltipRenderer: ({ record }) => {
          const trailerTag = record.getData("trailerTag");
          if (!trailerTag) return null;

          return {
            tag: "div",
            class: "p-3 space-y-2",
            children: [
              {
                tag: "div",
                class: "font-semibold text-base",
                html: `${record.getData("trailerName")}`,
              },
              {
                tag: "div",
                class: "text-sm text-gray-600",
                html: `${record.getData("trailerCapacity")}`,
              },
            ],
          };
        },
      },
    ],
  };

  const vehiclesGridConfig: BryntumGridProps = {
    cellEditFeature: true,
    sortFeature: ["name"],
    store: vehiclesStore.chain((vehicle: Vehicle) => {
      const assignment = find(
        get(vehicle, "assignments"),
        (assignment: VehicleAssignment) =>
          isSameDay(assignment.date, selectedDate)
      );

      if (vehicleFilter) {
        return (
          vehicle.VINNumber?.toLowerCase().includes(
            vehicleFilter.toLowerCase()
          ) || vehicle.name?.toLowerCase().includes(vehicleFilter.toLowerCase())
        );
      }

      return !assignment;
    }),
    height: "100%",
    columns: [
      {
        text: "Name",
        field: "name",
        flex: 1,
      },
      {
        text: "Model",
        field: "model",
        width: "12em",
      },
      {
        text: "VIN",
        field: "VINNumber",
        align: "center",
        width: "9em",
        renderer: ({ record }: { record: Vehicle }) =>
          VINRenderer(record.VINNumber),
      },
    ],
  };

  const trailersGridConfig: BryntumGridProps = {
    cellEditFeature: true,
    sortFeature: ["name"],
    store: trailersStore.chain((vehicle: Trailer) => {
      const assignment = find(
        get(vehicle, "assignments"),
        (assignment: VehicleAssignment) =>
          isSameDay(assignment.date, selectedDate)
      );

      if (vehicleFilter) {
        return (
          vehicle.VINNumber?.toLowerCase().includes(
            vehicleFilter.toLowerCase()
          ) || vehicle.name?.toLowerCase().includes(vehicleFilter.toLowerCase())
        );
      }

      return !assignment;
    }),
    height: "100%",
    columns: [
      {
        text: "Name",
        field: "name",
        flex: 1,
      },
      {
        text: "Capacity",
        field: "capacity",
        editor: false,
        width: "12em",
      },
      {
        text: "VIN",
        field: "VINNumber",
        width: "9em",
        align: "center",
        renderer: ({ record }: { record: Trailer }) =>
          VINRenderer(record.VINNumber),
      },
    ],
  };

  useEffect(() => {
    driversStore.clearFilters();
    if (driverFilter || vehicleFilter) {
      driversStore.filterBy((driver: Model) => {
        const checks = [true];

        if (driverFilter) {
          checks.push(
            driver
              .getData("name")
              ?.toLowerCase()
              .includes(driverFilter.toLowerCase())
          );
        }

        if (vehicleFilter) {
          const vehicleTagCheck = driver
            .getData("vehicleTag")
            ?.toLowerCase()
            .includes(vehicleFilter.toLowerCase());
          const vehicleNameCheck = driver
            .getData("vehicleName")
            ?.toLowerCase()
            .includes(vehicleFilter.toLowerCase());
          const trailerTagCheck = driver
            .getData("trailerTag")
            ?.toLowerCase()
            .includes(vehicleFilter.toLowerCase());
          const trailerNameCheck = driver
            .getData("trailerName")
            ?.toLowerCase()
            .includes(vehicleFilter.toLowerCase());

          checks.push(
            vehicleTagCheck ||
              vehicleNameCheck ||
              trailerTagCheck ||
              trailerNameCheck
          );
        }

        return every(checks);
      });
    }
  }, [driverFilter, vehicleFilter]);

  useEffect(() => {
    setVehiclesGrid($vehiclesGridRef.current?.instance);
  }, [$vehiclesGridRef]);

  useEffect(() => {
    setDriversGrid($driversGridRef.current?.instance);
  }, [$driversGridRef]);

  useEffect(() => {
    setTrailersGrid($trailersGridRef.current?.instance);
  }, [$trailersGridRef]);

  useEffect(() => {
    if (!vehiclesGrid || !driversGrid || !trailersGrid) {
      return;
    }

    ($vehiclesGridDragRef as VehiclesGridDrag).current = new VehiclesGridDrag({
      vehiclesGrid,
      driversGrid,
      vehiclesStore,
      constrain: false,
      selectedDate,
      outerElement: vehiclesGrid.element,
    });

    ($trailersGridDragRef as TrailersGridDrag).current = new TrailersGridDrag({
      trailersGrid,
      driversGrid,
      trailersStore,
      constrain: false,
      selectedDate,
      outerElement: trailersGrid.element,
    });

    ($driversGridVehicleDragRef as DriversGridVehicleDrag).current =
      new DriversGridVehicleDrag({
        driversGrid,
        vehiclesGrid,
        vehiclesStore,
        constrain: false,
        selectedDate,
        outerElement: driversGrid.element,
      });

    ($driversGridTrailerDragRef as DriversGridTrailerDrag).current =
      new DriversGridTrailerDrag({
        driversGrid,
        trailersGrid,
        trailersStore,
        constrain: false,
        selectedDate,
        outerElement: driversGrid.element,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiclesGrid, driversGrid, trailersGrid]);

  useEffect(() => {
    if ($vehiclesGridDragRef.current) {
      ($vehiclesGridDragRef.current as VehiclesGridDrag).setSelectedDate(
        selectedDate
      );
    }

    if ($trailersGridDragRef.current) {
      ($trailersGridDragRef.current as TrailersGridDrag).setSelectedDate(
        selectedDate
      );
    }

    if ($driversGridVehicleDragRef.current) {
      (
        $driversGridVehicleDragRef.current as DriversGridVehicleDrag
      ).setSelectedDate(selectedDate);
    }

    if ($driversGridTrailerDragRef.current) {
      (
        $driversGridTrailerDragRef.current as DriversGridTrailerDrag
      ).setSelectedDate(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className="h-full">
      <div className="p-4 h-full bg-logistics-navy text-white">
        <div className="container h-full mx-auto flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 p-2 bg-card rounded-full">
              <BryntumTextField
                placeholder="Filter drivers..."
                value={driverFilter}
                cls="scheduler-filter"
                onInput={(e) => setDriverFilter(e.value)}
                label={undefined}
              />
              <BryntumTextField
                placeholder="Filter vehicles..."
                value={vehicleFilter}
                cls="scheduler-filter"
                onInput={(e) => setVehicleFilter(e.value)}
                label={undefined}
              />
            </div>
            <div className="flex items-center space-x-2 p-2 bg-card rounded-full">
              <BryntumButton
                cls="b-fa b-fa-chevron-left !rounded-full !bg-card !border-teal-300 !text-teal-800 hover:!bg-teal-50 !min-h-10 !h-10 !w-10"
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
                    className="rounded-full bg-card h-10 border-teal-300 border-[1px] hover:bg-teal-50"
                  >
                    <CalendarIcon className="h-4 w-4 mr-1 text-teal-300" />
                    <p className="text-teal-800">
                      {selectedDate.toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "Today"
                        : selectedDate.toLocaleDateString()}
                    </p>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-auto p-0" align="end">
                  <div className="!rounded-full !bg-card !border-teal-300 !min-h-10 !h-10">
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
                cls="b-fa b-fa-chevron-right !rounded-full !bg-card !border-teal-300 !text-teal-800 hover:!bg-teal-50 !min-h-10 !h-10 !w-10"
                onClick={() => {
                  const nextDay = new Date(selectedDate);
                  nextDay.setDate(nextDay.getDate() + 1);
                  setSelectedDate(nextDay);
                }}
              />
            </div>
          </div>

          <div className="h-[90%] grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-full flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-teal-900">Drivers</h2>
              <div className="h-full border-[1px] border-border overflow-hidden rounded-md">
                <BryntumGrid
                  id="driversGrid"
                  ref={$driversGridRef}
                  {...driversGridConfig}
                />
              </div>
            </div>
            <div className="h-full flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-teal-900">Vehicles</h2>
              <div className="flex-1 border-[1px] border-border overflow-hidden rounded-md">
                <BryntumGrid
                  id="vehiclesGrid"
                  ref={$vehiclesGridRef}
                  {...vehiclesGridConfig}
                />
              </div>
              <h2 className="text-xl font-semibold text-teal-900">Trailers</h2>
              <div className="flex-1 border-[1px] border-border overflow-hidden rounded-md">
                <BryntumGrid
                  id="trailersGrid"
                  ref={$trailersGridRef}
                  {...trailersGridConfig}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclesPage;
