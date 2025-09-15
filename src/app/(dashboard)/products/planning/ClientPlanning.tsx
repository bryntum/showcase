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
import {
  Calendar as CalendarIcon,
  ClockIcon,
  TrendingUpIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";
import { SchedulerProWrapper } from "components/ui/scheduler/SchedulerProWrapper";
import { useEffect, useMemo, useRef, useState } from "react";
import { forEach, isEmpty, map, toLower } from "lodash";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "components/ui/overlays/dropdown-menu";
import { Client, Delivery, Vehicle, VehicleAssignment } from "@prisma/client";
import { Scheduler, TimeAxis } from "@bryntum/scheduler-thin";
import {
  BryntumButton,
  BryntumSlideToggle,
  BryntumTextField,
} from "@bryntum/core-react-thin";
import { BryntumGrid } from "@bryntum/grid-react-thin";
import { unplannedGridConfig } from "./UnplannedGrid";
import { isSameDay } from "date-fns";
import { Grid } from "@bryntum/grid-thin";
import { Drag } from "./Drag";
import { useDate } from "../../../../contexts/date-context";
import MapPanel from "./MapPanel";
import { SlideToggle } from "@bryntum/core-thin";
import MetricCard, { MetricCardProps } from "./MetricCard";
import dynamic from "next/dynamic";

// This is the original Planning component content
const Planning = () => {
  const [metrics, setMetrics] = useState<MetricCardProps[]>([]);
  const [resourceFilter, setResourceFilter] = useState<string>("");
  const [eventFilter, setEventFilter] = useState<string>("");
  const [grid, setGrid] = useState<Grid>();
  const [scheduler, setScheduler] = useState<SchedulerPro>();

  const { selectedDate, setSelectedDate } = useDate();

  const $unplannedGridRef = useRef<BryntumGrid>(null);
  const $dragRef = useRef<Drag>(null);

  const updateMetrics = () => {
    // ... rest of the component logic
    // This would be the full content of the original Planning component
  };

  return (
    <div className="space-y-6">
      {/* Component content here */}
      <div>Planning component content</div>
    </div>
  );
};

export default Planning;
