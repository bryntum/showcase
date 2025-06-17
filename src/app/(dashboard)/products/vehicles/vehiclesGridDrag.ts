import {
  AjaxStore,
  DragHelper,
  Model,
  StringHelper,
} from "@bryntum/core-thin";
import { DragHelperConfig } from "@bryntum/core-thin";
import { Grid } from "@bryntum/grid-thin";
import { VehicleAssignment } from "@prisma/client";
import { isSameDay } from "date-fns";
import { find, get } from "lodash";

type DragConfig = DragHelperConfig & {
  driversGrid: Grid;
  vehiclesGrid: Grid;
  vehiclesStore: AjaxStore;
  constrain: boolean;
  selectedDate: Date;
  outerElement: HTMLElement;
};

type DragContext = {
  vehicle: Model;
  driver: Model;
  valid: boolean;
  vehicleAssignment: VehicleAssignment;
};

export class VehiclesGridDrag extends DragHelper {
  public driversGrid: Grid;
  public vehiclesGrid: Grid;
  public vehiclesStore: AjaxStore;
  public outerElement: HTMLElement;
  public constrain: boolean;
  public selectedDate: Date;
  declare context: DragContext;
  current!: VehiclesGridDrag;

  constructor(config: DragConfig) {
    super({
      ...config,
      callOnFunctions: true,
      autoSizeClonedTarget: false,
      unifiedProxy: true,
      removeProxyAfterDrop: true,
      cloneTarget: true,
      dropTargetSelector: '.b-grid-cell[data-column="vehicleTag"]',
      dropTargetCls: "b-grid-cell-drop-target",
      targetSelector: ".b-grid-row",
    });
    this.driversGrid = config.driversGrid;
    this.vehiclesGrid = config.vehiclesGrid;
    this.vehiclesStore = config.vehiclesStore;
    this.constrain = config.constrain;
    this.outerElement = config.outerElement;
    this.selectedDate = config.selectedDate;
  }

  setSelectedDate(date: Date) {
    this.selectedDate = date;
  }

  override createProxy = (grabbedElement: HTMLElement): HTMLDivElement => {
    const { vehiclesGrid } = this,
      vehicle = vehiclesGrid.getRecordFromElement(grabbedElement),
      proxy = document.createElement("div"),
      VINNumber = vehicle.getData("VINNumber") ? vehicle.getData("VINNumber") : "-";

    proxy.innerHTML = StringHelper.xss`
      <div class="flex items-center justify-center p-1">
        <div
          style="font-family: monospace; letter-spacing: 0.05em; text-shadow: 0 1px 1px rgba(0,0,0,0.1); background: linear-gradient(to bottom, #ffffff 0%, #f8f8f8 100%);"
          class="flex items-center justify-center min-w-[120px] px-2 py-1 rounded bg-white border-2 border-blue-600 shadow-sm"
        >
          <span class="text-sm font-bold text-black uppercase tracking-wider">${VINNumber}</span>
        </div>
      </div>
    `;

    return proxy;
  };


  override onDragStart = ({ context }: { context: any }): void => {
    const { vehiclesGrid } = this,
      { selectedRecord } = vehiclesGrid as Grid;

    context.vehicle = selectedRecord;
  };


  override onDrag = ({ context }: { context: any }): void => {
    const driversGrid = this.driversGrid;
    const driver = driversGrid.getRecordFromElement(context.target);

    if (driver) {
      const driverAssignment = find(get(driver, "assignments"), (assignment: VehicleAssignment) =>
        isSameDay(assignment.date, this.selectedDate)
      );

      context.valid = !driverAssignment?.vehicleId;
      context.vehicleAssignment = driverAssignment;
      context.driver = driver;
    } else {
      context.valid = false;
    }
  };


  override onDrop = async ({ context }: { context: any }) => {
    if (context.valid) {
      const url = context.vehicleAssignment ? `/api/vehicle-assignments/${context.vehicleAssignment.id}` : "/api/vehicle-assignments";
      const method = context.vehicleAssignment ? "PUT" : "POST";

      await fetch(url, {
        method,
        body: JSON.stringify({
          driverId: context.driver.id,
          vehicleId: context.vehicle.id,
          date: this.selectedDate,
        }),
      });

      (this.driversGrid.store as AjaxStore).load();
      (this.vehiclesStore as AjaxStore).load();
    }
  };
}
