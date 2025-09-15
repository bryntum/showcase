'use client';

import {
  AjaxStore,
  DomHelper,
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
  trailersGrid: Grid;
  trailersStore: AjaxStore;
  constrain: boolean;
  selectedDate: Date;
  outerElement: HTMLElement;
};

type DragContext = {
  trailer: Model;
  grabbedDriver: Model;
  targetDriver: Model;
  valid: boolean;
  vehicleAssignment: VehicleAssignment;
};

export class DriversGridTrailerDrag extends DragHelper {
  public driversGrid: Grid;
  public trailersGrid: Grid;
  public trailersStore: AjaxStore;
  public outerElement: HTMLElement;
  public constrain: boolean;
  public selectedDate: Date;
  declare context: DragContext;
  current!: DriversGridTrailerDrag;

  constructor(config: DragConfig) {
    super({
      ...config,
      callOnFunctions: true,
      autoSizeClonedTarget: false,
      unifiedProxy: true,
      removeProxyAfterDrop: true,
      cloneTarget: true,
      dropTargetSelector: '.b-grid-cell[data-column="trailerTag"], #trailersGrid .b-grid-subgrid-normal',
      dropTargetCls: "b-grid-cell-drop-target",
      targetSelector: '.b-grid-cell[data-column="trailerTag"]:has(*)',
    });
    this.driversGrid = config.driversGrid;
    this.trailersGrid = config.trailersGrid;
    this.trailersStore = config.trailersStore;
    this.constrain = config.constrain;
    this.outerElement = config.outerElement;
    this.selectedDate = config.selectedDate;
  }

  setSelectedDate(date: Date) {
    this.selectedDate = date;
  }

  override createProxy = (grabbedElement: HTMLElement): HTMLDivElement => {
    const { driversGrid } = this,
      driver = driversGrid.getRecordFromElement(grabbedElement) as Model,
      proxy = document.createElement("div"),
      VINNumber = driver.getData("trailerTag") ? driver.getData("trailerTag") : "-";

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
    const { driversGrid } = this,
      { selectedRecord } = driversGrid as Grid;

    context.grabbed.children[0].classList.add("b-hidden");
    context.grabbedDriver = selectedRecord;
    context.grabbedAssignment = find(get(selectedRecord, "assignments"), (assignment: VehicleAssignment) =>
      isSameDay(assignment.date, this.selectedDate)
    );
  };


  override onDrag = ({ context }: { context: any }): void => {
    const driversGrid = this.driversGrid;
    const driver = driversGrid.getRecordFromElement(context.target);

    if (driver) {
      context.valid = driver.id !== context.grabbedDriver.id;
      context.targetDriver = driver;
      context.targetAssignment = find(get(driver, "assignments"), (assignment: VehicleAssignment) =>
        isSameDay(assignment.date, this.selectedDate)
      );
    }
  };


  override onDrop = async ({ context }: { context: any }) => {
    setTimeout(() => {
      context.grabbed.children[0].classList.remove("b-hidden");
    }, 500);

    if (context.valid) {
      const promises = [];
      if (DomHelper.isDescendant(this.trailersGrid.element, context.target)) {
        if (context.grabbedAssignment.vehicleId) {
          promises.push(fetch(`/api/vehicle-assignments/${context.grabbedAssignment.id}`, {
            method: "PUT",
            body: JSON.stringify({
              trailerId: null,
            }),
          }));
        } else {
          promises.push(fetch(`/api/vehicle-assignments/${context.grabbedAssignment.id}`, {
            method: "DELETE",
          }));
        }
      } else {
        if (context.targetAssignment) {
          promises.push(fetch(`/api/vehicle-assignments/${context.grabbedAssignment.id}`, {
            method: "PUT",
            body: JSON.stringify({
              trailerId: context.targetAssignment.trailerId,
            }),
          }));

          promises.push(fetch(`/api/vehicle-assignments/${context.targetAssignment.id}`, {
            method: "PUT",
            body: JSON.stringify({
              trailerId: context.grabbedAssignment.trailerId,
            }),
          }));
        } else {
          promises.push(fetch('/api/vehicle-assignments', {
            method: "POST",
            body: JSON.stringify({
              driverId: context.targetDriver.id,
              trailerId: context.grabbedAssignment.trailerId,
              date: this.selectedDate,
            }),
          }));

          if (context.grabbedAssignment.vehicleId) {
            promises.push(fetch(`/api/vehicle-assignments/${context.grabbedAssignment.id}`, {
              method: "PUT",
              body: JSON.stringify({
                trailerId: null,
              }),
            }));
          } else {
            promises.push(fetch(`/api/vehicle-assignments/${context.grabbedAssignment.id}`, {
              method: "DELETE",
            }));
          }
        }
      }

      await Promise.all(promises);

      (this.driversGrid.store as AjaxStore).load();
      (this.trailersStore as AjaxStore).load();
    }
  };
}
