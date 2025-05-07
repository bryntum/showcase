import "styles/index.css";
import { NextLayout } from "types/appRouter";
import { FC } from "react";
import Providers from "./providers";
import { TooltipProvider } from "components/ui/data-display/tooltip";
import Toaster from "components/ui/feedback/toaster";

export const metadata = {
  title: "Bryntum Dashboard Hub",
  description: "Dashboard for Bryntum products",
};

const RootLayout: FC<NextLayout> = (props) => {
  const { children } = props;

  return (
    <html lang="en">
      <body>
        <Providers>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
