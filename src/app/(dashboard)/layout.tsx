import { DashboardLayout } from "components/layout/DashboardLayout";
import { FC } from "react";
import { NextLayout } from "types/appRouter";
import { DateProvider } from "../../contexts/date-context";

const DashboardLayoutWrapper: FC<NextLayout> = ({ children }) => {
  return (
    <DateProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </DateProvider>
  );
};

export default DashboardLayoutWrapper;
