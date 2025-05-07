import dynamic from "next/dynamic";
import { BryntumSchedulerPro, BryntumSchedulerProProps } from "@bryntum/schedulerpro-react-thin";

const SchedulerPro = dynamic(() => import("./Scheduler.tsx"), {
  ssr: false,
  loading: () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  },
});

const SchedulerWrapper = (
  schedulerConfig: BryntumSchedulerProProps & {
    innerRef?: React.RefObject<BryntumSchedulerPro>;
  }
) => {
  return (
    <>
      <SchedulerPro {...schedulerConfig} ref={schedulerConfig.innerRef} />
    </>
  );
};

export { SchedulerWrapper };
