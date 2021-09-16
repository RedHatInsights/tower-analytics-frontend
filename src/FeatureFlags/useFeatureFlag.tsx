import { useContext } from 'react';
import Context from './Context';
import { ValidFeatureFlags } from './types';

const isBeta = () => window.location.pathname.split('/')[1] === 'beta';

const useFeatureFlag = (flag: ValidFeatureFlags): boolean => {
  // On beta features are always enabled.
  if (isBeta()) return true;

  // On prod check the feature flag.
  const features = useContext(Context);
  const feature = features.find(({ name }) => name === flag);
  return !!feature && feature.enabled;
};

export default useFeatureFlag;
