import dynamic from 'next/dynamic';

// Create a no-ssr wrapper for Bryntum components
export const createNoSSRComponent = <T extends React.ComponentType<any>>(
  component: T,
  options?: {
    loading?: () => React.ReactElement;
  }
) => {
  return dynamic(() => Promise.resolve(component), {
    ssr: false,
    loading: options?.loading || (() => <div>Loading...</div>)
});
};
