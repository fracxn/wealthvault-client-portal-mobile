import { ComponentType, ReactNode } from "react";

type ProviderBuilder = [ComponentType<any>, Record<string, any>?][];

/**
 * A function that builds a provider component in a typescript-react application.
 */
export const useProviderBuilder = (
  componentsWithProps: ProviderBuilder = []
) => {
  const initialComponent = ({ children }: { children: ReactNode }) => (
    <>{children}</>
  );

  return componentsWithProps.reduce(
    (AccumulatedComponents, [Provider, props = {}]) => {
      return ({ children }) => {
        return (
          <AccumulatedComponents>
            <Provider {...props}>{children}</Provider>
          </AccumulatedComponents>
        );
      };
    },
    initialComponent
  );
};
