import { createContext } from 'react';

export interface FeatureFlagType {
  name: string
  enabled: boolean
}

export const { Provider, Consumer } = createContext<FeatureFlagType[]>([]);
