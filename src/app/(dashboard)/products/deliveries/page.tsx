"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Plus, Clock, Timer, Package, Check } from "lucide-react";
import { Delivery, Driver, Item } from "@prisma/client";
import { map, toLower, every } from "lodash";
import { BryntumGridProps } from "@bryntum/grid-react-thin";
import { BryntumGrid } from "@bryntum/grid-react-thin";
import { AjaxStore, DateHelper, Model } from "@bryntum/core-thin";
import { Button } from "../../../../components/ui/actions/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../../components/ui/overlays/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/forms/form";
import { Input } from "../../../../components/ui/forms/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../components/ui/overlays/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../components/ui/overlays/popover";
import cn from "../../../../lib/utils";
import { DurationColumn } from "@bryntum/scheduler-thin";
import { Calendar } from "components/ui/actions/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "components/ui/overlays/dropdown-menu";
import { useDate } from "../../../../contexts/date-context";
import { isSameDay } from "date-fns";
import {
  BryntumButton,
  BryntumCombo,
  BryntumTextField,
} from "@bryntum/core-react-thin";
import { eventTypeCellRenderer } from "../planning/UnplannedGrid";
import { GridWrapper } from "components/ui/grid/GridWrapper";

const deliveryFormSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
  type: z.enum(["URGENT", "REGULAR", "SPECIAL"]),
  plannedFrom: z.string().min(1, "Planned time is required"),
  durationInMinutes: z.string().min(1, "Duration is required"),
  itemId: z.string().min(1, "Item is required"),
});

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

const Scheduler = () => {
  const $gridRef = useRef<BryntumGrid>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [itemPopoverOpen, setItemPopoverOpen] = useState(false);
  const [deliveryFilter, setDeliveryFilter] = useState<string>("");
  const { selectedDate, setSelectedDate } = useDate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items");

        if (!response.ok) throw new Error("Failed to fetch items");

        const data = await response.json();

        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

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
              unit: delivery.durationInMinutes >= 60 ? "h" : "m",
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
            driverName?.toLowerCase().includes(deliveryFilter.toLowerCase()) ||
            type?.toLowerCase().includes(deliveryFilter.toLowerCase())
          );
          return every(checks);
        });
      }
    }
  }, [selectedDate, store, deliveryFilter]);

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      comment: "",
      type: "REGULAR",
      plannedFrom: "",
      durationInMinutes: "",
      itemId: "",
    },
  });

  const onSubmit = async (data: DeliveryFormValues) => {
    try {
      // Combine selected date with the time value
      const [hours, minutes] = data.plannedFrom.split(":");
      const plannedFromDate = new Date(selectedDate);
      plannedFromDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const response = await fetch("/api/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          plannedFrom: plannedFromDate.toISOString(),
          durationInMinutes: parseInt(data.durationInMinutes),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create delivery");
      }

      setIsOpen(false);
      form.reset();
      // Refresh the grid data
      store.load();
    } catch (error) {
      console.error("Error creating delivery:", error);
    }
  };

  const gridConfig: BryntumGridProps = {
    cellEditFeature: true,
    sortFeature: "name",
    showDirty: true,
    store,
    height: "100%",
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
                cls="scheduler-filter"
                label={undefined}
                onInput={(e) => setDeliveryFilter(e.value)}
              />
            </div>
            <div className="flex w-full justify-end space-x-2">
              <div className="flex items-center space-x-2 p-2 bg-card rounded-full">
                <BryntumButton
                  cls="b-fa b-fa-chevron-left !rounded-full !border-teal-500 !text-teal-500 !bg-card hover:!bg-teal-50 !min-h-10 !h-10 !w-10"
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
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button className="rounded-full bg-teal-300 hover:bg-teal-400">
                      <Plus className="h-4 w-4 text-white" />
                      <p className="text-white">New Delivery</p>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-white">
                        Create New Delivery
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 py-4"
                      >
                        <FormField
                          control={form.control}
                          name="comment"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl className="w-full">
                                <BryntumTextField
                                  width="100%"
                                  labelCls="b-fa b-fa-comment flex gap-2 items-center"
                                  label="Comment"
                                  labelPosition="above"
                                  {...field}
                                  onChange={({ event }) =>
                                    field.onChange(event)
                                  }
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl className="w-full">
                                <BryntumCombo
                                  width="100%"
                                  labelCls="b-fa b-fa-truck flex gap-2 items-center"
                                  label="Type"
                                  labelPosition="above"
                                  items={["URGENT", "REGULAR", "SPECIAL"]}
                                  {...field}
                                  onChange={({ event }) =>
                                    field.onChange(event)
                                  }
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="plannedFrom"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  Planned Time
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="time"
                                    {...field}
                                    className="h-11"
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="durationInMinutes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                  <Timer className="h-4 w-4" />
                                  Duration
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    {...field}
                                    className="h-11"
                                    placeholder="Minutes"
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="itemId"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Item
                              </FormLabel>
                              <Popover
                                open={itemPopoverOpen}
                                onOpenChange={setItemPopoverOpen}
                              >
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        "h-11 w-full justify-between",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value
                                        ? items.find(
                                            (item) => item.id === field.value
                                          )?.name
                                        : "Select an item"}
                                      <Package className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-full p-0"
                                  align="start"
                                >
                                  <Command>
                                    <CommandInput placeholder="Search items..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No items found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {items.map((item) => (
                                          <CommandItem
                                            value={item.name}
                                            key={item.id}
                                            onSelect={() => {
                                              form.setValue("itemId", item.id);
                                              setItemPopoverOpen(false);
                                            }}
                                          >
                                            <div className="flex flex-col w-full">
                                              <div className="flex items-center">
                                                <Check
                                                  className={cn(
                                                    "mr-2 h-4 w-4",
                                                    item.id === field.value
                                                      ? "opacity-100"
                                                      : "opacity-0"
                                                  )}
                                                />
                                                <span className="font-medium">
                                                  {item.name}
                                                </span>
                                              </div>
                                              <span className="text-xs text-gray-500 ml-6">
                                                {item.description} •{" "}
                                                {item.weight}g • {item.currency}{" "}
                                                {item.sellPrice}
                                              </span>
                                            </div>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <DialogFooter className="pt-4">
                          <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Delivery
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className="flex-1 border-[1px] border-border rounded-md overflow-hidden">
            <GridWrapper innerRef={$gridRef} {...gridConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
