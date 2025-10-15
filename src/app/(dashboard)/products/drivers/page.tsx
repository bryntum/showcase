"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

const Calendar = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <div className="mr-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FontAwesomeIcon icon={faCalendar} size="lg" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Calendar Product
            </h1>
            <p className="text-muted-foreground">
              Event management with interactive calendars and scheduler views
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-12 text-center">
        <h2 className="text-2xl font-semibold mb-3">
          Calendar Product Details
        </h2>
        <p className="text-muted-foreground mb-6">
          Detailed statistics and features will be displayed here
        </p>
      </div>
    </div>
  );
};

export default Calendar;
