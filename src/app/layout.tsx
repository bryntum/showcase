import 'styles/index.css';
import { NextLayout } from 'types/appRouter';
import { FC } from 'react';
import Providers from './providers';
import { TooltipProvider } from 'components/ui/data-display/tooltip';
import Toaster from 'components/ui/feedback/toaster';

export const metadata = {
  title: 'Bryntum Showcase',
  description: 'Dashboard for Bryntum products',
};

const RootLayout: FC<NextLayout> = (props) => {
  const { children } = props;

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/themes/core.classic-dark.css" data-bryntum-theme />
        <link rel="stylesheet" href="/themes/grid.classic-dark.css" data-bryntum-theme />
        <link rel="stylesheet" href="/themes/scheduler.classic-dark.css" data-bryntum-theme />
        <link rel="stylesheet" href="/themes/schedulerpro.classic-dark.css" data-bryntum-theme />
        <link rel="stylesheet" href="/themes/gantt.classic-dark.css" data-bryntum-theme />
        <link rel="stylesheet" href="/themes/core.stockholm.css" data-bryntum-theme />
        <link rel="stylesheet" href="/themes/grid.stockholm.css" data-bryntum-theme />
        <link rel="stylesheet" href="/themes/scheduler.stockholm.css" data-bryntum-theme />
        <link rel="stylesheet" href="/themes/schedulerpro.stockholm.css" data-bryntum-theme />
        <link rel="stylesheet" href="/themes/gantt.stockholm.css" data-bryntum-theme />
      </head>
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
