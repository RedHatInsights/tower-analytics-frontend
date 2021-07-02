import { createContext } from 'react';

export interface FeatureFlagType {
  [key: string]: {
    isEnabled: boolean
  }
}

export const { Provider, Consumer } = createContext<FeatureFlagType>({});
