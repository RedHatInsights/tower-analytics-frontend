import { useContext } from 'react';
import Context from './Context';
import { ValidFeatureFlags } from './types';

const useFeatureFlag = (flag: ValidFeatureFlags): boolean => {
  const features = useContext(Context);
  const feature = features.find(({ name }) => name === flag);
  return !!feature && feature.enabled;
};

export default useFeatureFlag;
