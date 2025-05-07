"use client";

import { useMemo, useRef } from "react";

import { Package2 } from "lucide-react";
import { Delivery, Driver, Item } from "@prisma/client";
import { map } from "lodash";
import { BryntumGridProps } from "@bryntum/grid-react-thin";
import { BryntumGrid } from "@bryntum/grid-react-thin";
import { AjaxStore, DateHelper } from "@bryntum/core-thin";

const Scheduler = () => {
  const $gridRef = useRef<BryntumGrid>(null);

  const store = useMemo(
    () =>
      new AjaxStore({
        readUrl: "/api/deliveries",
        autoLoad: true,
        // @ts-expect-error function is typed incorrectly
        transformLoadedData: (data: Delivery<Driver, Item>[]) =>
          map(data, (delivery) => ({
            ...delivery,
            driverName: delivery.driver.name,
            itemName: delivery.item.name,
          })),
      }),
    []
  );

  const gridConfig: BryntumGridProps = {
    cellEditFeature: true,
    sortFeature: "name",
    stripeFeature: true,
    showDirty: true,
    store,
    columns: [
      { text: "Comment", field: "comment", flex: 1 },
      { text: "Type", field: "type" },
      {
        text: "Planned From",
        type: "time",
        renderer: ({ value }) =>
          value ? DateHelper.format(new Date(value), "d MMM YYYY HH:mm") : "",
        field: "plannedFrom",
        width: "9em",
      },
      {
        text: "Planned To",
        type: "time",
        renderer: ({ value }) =>
          value ? DateHelper.format(new Date(value), "d MMM YYYY HH:mm") : "",
        field: "plannedTo",
        width: "9em",
      },
      { text: "Driver", field: "driverName", width: "10em" },
      { text: "Item", field: "itemName", width: "15em" },
    ],
  };

  return (
    <div className="h-full">
      <div className="p-4 h-full bg-logistics-navy text-white">
        <div className="container h-full mx-auto flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-3 md:mb-0">
              <Package2 className="h-8 w-8 mr-2 text-gray-500" />
              <h1 className="text-2xl font-bold text-gray-500">Deliveries</h1>
            </div>
          </div>
          <BryntumGrid ref={$gridRef} {...gridConfig} />;
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
