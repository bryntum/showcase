import { DashboardLayout } from "components/layout/DashboardLayout";
import { FC } from "react";
import { NextLayout } from "types/appRouter";

const DashboardLayoutWrapper: FC<NextLayout> = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardLayoutWrapper;
