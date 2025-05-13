"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Package2,
  Plus,
  Clock,
  MessageSquare,
  Timer,
  Truck,
  Package,
  Check,
} from "lucide-react";
import { Delivery, Driver, Item } from "@prisma/client";
import { map, toLower } from "lodash";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/forms/select";
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
        onCommit: ({ changes }) => {
          console.log(changes);
        },
      }),
    []
  );

  useEffect(() => {
    if (store) {
      store.addFilter({
        id: "dateFilter",
        filterBy: (record) =>
          isSameDay(new Date(record.getData("plannedFrom")), selectedDate),
      });
    }
  }, [selectedDate, store]);

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
    stripeFeature: true,
    showDirty: true,
    store,
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
        editor: { type: "dropdown", items: ["URGENT", "REGULAR", "SPECIAL"] },
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
            <div className="flex items-center mb-3 md:mb-0">
              <Package2 className="h-8 w-8 mr-2 text-gray-500" />
              <h1 className="text-2xl font-bold text-gray-500">Deliveries</h1>
            </div>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
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
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4" />
                    New Delivery
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
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
                            <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Comment
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter delivery comment"
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
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Truck className="h-4 w-4" />
                              Type
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select delivery type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="URGENT">Urgent</SelectItem>
                                <SelectItem value="REGULAR">Regular</SelectItem>
                                <SelectItem value="SPECIAL">Special</SelectItem>
                              </SelectContent>
                            </Select>
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
                                    <CommandEmpty>No items found.</CommandEmpty>
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
                                              {item.description} • {item.weight}
                                              g • {item.currency}{" "}
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
          <BryntumGrid ref={$gridRef} {...gridConfig} />
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
