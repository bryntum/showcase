import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import "@bryntum/core-thin/core.css";
import "@bryntum/grid-thin/grid.css";
import "@bryntum/scheduler-thin/scheduler.css";
import "@bryntum/schedulerpro-thin/schedulerpro.css";
import "styles/index.css";
import { NextLayout } from "types/appRouter";
import { FC } from "react";
import Providers from "./providers";

export const metadata = {
  title: "Bryntum Showcase",
  description: "Dashboard for Bryntum products",
};

const RootLayout: FC<NextLayout> = (props) => {
  const { children } = props;

  return (
    <html lang="en">
      <head>
        <script
          src="https://kit.fontawesome.com/6f7725359c.js"
          crossOrigin="anonymous"
        ></script>
        {/* Import style sheets with data-bryntum-theme so they can be used by the DomHelper */}
        <link
          rel="stylesheet"
          href="/themes/core-thin/svalbard-light.css"
          data-bryntum-theme="light"
          data-theme="light"
        />
        <link
          rel="stylesheet"
          href="/themes/grid-thin/svalbard-light.css"
          data-bryntum-theme="light"
          data-theme="light"
        />
        <link
          rel="stylesheet"
          href="/themes/scheduler-thin/svalbard-light.css"
          data-bryntum-theme="light"
          data-theme="light"
        />
        <link
          rel="stylesheet"
          href="/themes/schedulerpro-thin/svalbard-light.css"
          data-bryntum-theme="light"
          data-theme="light"
        />

        <link
          rel="stylesheet"
          href="/themes/core-thin/svalbard-dark.css"
          data-bryntum-theme="dark"
          data-theme="dark"
        />
        <link
          rel="stylesheet"
          href="/themes/grid-thin/svalbard-dark.css"
          data-bryntum-theme="dark"
          data-theme="dark"
        />
        <link
          rel="stylesheet"
          href="/themes/scheduler-thin/svalbard-dark.css"
          data-bryntum-theme="dark"
          data-theme="dark"
        />
        <link
          rel="stylesheet"
          href="/themes/schedulerpro-thin/svalbard-dark.css"
          data-bryntum-theme="dark"
          data-theme="dark"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
