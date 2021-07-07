import { useContext } from 'react';
import { FeatureFlagContext } from './Context';

const useFeatureFlag = (flag: string) => {
  const features = useContext(FeatureFlagContext);
  const feature = features.find(({ name }) => name === flag);
  return (!!feature && feature.enabled);
};

export default useFeatureFlag;
