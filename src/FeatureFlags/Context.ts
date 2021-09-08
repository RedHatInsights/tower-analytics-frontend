import { createContext } from 'react';
import { FeatureFlagType } from './types';

export const FeatureFlagContext = createContext<FeatureFlagType[]>([]);
export const Provider = FeatureFlagContext.Provider;

export default FeatureFlagContext;
