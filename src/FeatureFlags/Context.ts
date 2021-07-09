import { createContext } from 'react';

export interface FeatureFlagType {
  name: string
  enabled: boolean
}

export const FeatureFlagContext = createContext<FeatureFlagType[]>([]);
export const Provider = FeatureFlagContext.Provider;
