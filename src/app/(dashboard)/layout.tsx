import { DashboardLayout } from "components/layout/DashboardLayout";
import { FC } from "react";
import { NextLayout } from "types/appRouter";
import { DateProvider } from "../../contexts/date-context";
import { DarkModeProvider } from "contexts/dark-mode";

const DashboardLayoutWrapper: FC<NextLayout> = ({ children }) => {
  return (
    <DateProvider>
      <DarkModeProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </DarkModeProvider>
    </DateProvider>
  );
};

export default DashboardLayoutWrapper;
