import React, { ReactNode } from "react";

// Define the type of providers
type ProviderProps = { children: ReactNode };
type ProviderComponent = React.ComponentType<ProviderProps>;

export function combineProviders(providers: ProviderComponent[]) {
  return function CombinedProvider({ children }: ProviderProps) {
    return providers.reduceRight(
      (AccumulatedProviders, CurrentProvider) => (
        <CurrentProvider>{AccumulatedProviders}</CurrentProvider>
      ),
      children
    );
  };
}
