'use client';

import {
  DomHelper,
  DragHelper,
  Model,
  ScrollManager,
  StringHelper,
} from "@bryntum/core-thin";
import { DragHelperConfig } from "@bryntum/core-thin";
import { Grid } from "@bryntum/grid-thin";
import { EventModel, SchedulerPro } from "@bryntum/schedulerpro-thin";
import { get } from "lodash";

type DragConfig = DragHelperConfig & {
  grid: Grid;
  schedule: SchedulerPro;
  constrain: boolean;
  outerElement: HTMLElement;
};

type DragContext = {
  delivery: Model;
  totalDuration: number;
  driver: Model;
  valid: boolean;
};

export class Drag extends DragHelper {
  public scrollManager!: ScrollManager;
  public grid: Grid;
  public outerElement: HTMLElement;
  public schedule!: SchedulerPro;
  public constrain: boolean;
  declare context: DragContext;
  current!: Drag;

  constructor(config: DragConfig) {
    super({
      ...config,
      callOnFunctions: true,
      autoSizeClonedTarget: false,
      unifiedProxy: true,
      removeProxyAfterDrop: false,
      cloneTarget: true,
      dropTargetSelector: ".b-timeline-sub-grid",
      targetSelector: ".b-grid-row",
    });
    this.grid = config.grid;
    this.schedule = config.schedule;
    this.constrain = config.constrain;
    this.outerElement = config.outerElement;
    this.scrollManager = config.schedule.scrollManager as ScrollManager;
  }

  override createProxy = (grabbedElement: HTMLElement): HTMLDivElement => {
    console.log("createProxy", grabbedElement);
    const eventPalette = {
      URGENT: {
        class: "!bg-warning-100",
      },
      REGULAR: {
        class: "!bg-teal-100",
      },
      SPECIAL: {
        class: "!bg-cyan-100",
      }
    }

    const { context, schedule, grid } = this,
      delivery = grid.getRecordFromElement(grabbedElement) as EventModel,
      durationInPixels = schedule.timeAxisViewModel.getDistanceForDuration(
        delivery.durationMS
      ),
      durationInPx = schedule.timeAxisViewModel.getDistanceForDuration(
        delivery.durationMS
      ),
      proxy = document.createElement("div");


    const eventType = delivery.getData("type") as keyof typeof eventPalette;

    proxy.style.cssText = "";

    Object.assign(proxy.style, {
      width: `${durationInPx}px`,
      height: `${schedule.rowHeight - 2 * (schedule.resourceMargin as number)
        }px`,
    });

    if (schedule.timeAxisSubGrid.width < durationInPixels) {
      proxy.classList.add("b-exceeds-axis-width");
    }

    // Fake an event bar
    proxy.classList.add(
      "b-sch-event-wrap",
      "b-sch-style-border",
      "b-unassigned-class",
      "b-sch-horizontal"
    );
    proxy.innerHTML = StringHelper.xss`
            <div class="b-sch-event b-has-content b-sch-event-withicon !border-none ${get(eventPalette, eventType, eventPalette.REGULAR).class}">
                <div class="b-sch-event-content !text-event-text !border-none">
                    <i class="fa fa-package"></i>
                    <div>
                        <div>${delivery.getData("comment")}</div>
                    </div>
                </div>
            </div>
        `;

    let totalDuration = 0;
    (grid.selectedRecords as Model[]).forEach(
      (delivery) => (totalDuration += (delivery as EventModel).durationMS)
    );
    context.totalDuration = totalDuration;

    return proxy;
  };


  override onDragStart = ({ context }: { context: any }): void => {
    const { grid } = this,
      { selectedRecord } = grid as Grid;

    context.delivery = selectedRecord;
  };


  override onDrag = ({ context }: { context: any }): void => {
    const { schedule } = this,
      driver = context.target && schedule.resolveResourceRecord(context.target);

    context.driver = driver;
  };


  override onDrop = async ({ context }: { context: any }) => {
    const { schedule } = this;

    if (context.valid) {
      const { element, driver } = context,
        delivery = context.delivery as EventModel,
        coordinate = DomHelper.getTranslateX(element),
        dropDate = schedule.getDateFromCoordinate(coordinate, "round", false);

      if (delivery && dropDate && driver) {
        delivery.set("actualFrom", dropDate);
        delivery.set("driverId", driver.id);
        delivery.assign(driver);

        await schedule.scheduleEvent({
          eventRecord: delivery,
          startDate: dropDate,
          resourceRecord: driver,
          element,
        });
      }

      schedule.unhighlightTimeSpans();
    }
  };
}
