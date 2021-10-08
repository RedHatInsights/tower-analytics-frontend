import { useContext } from 'react';
import Context from './Context';
import { ValidFeatureFlags } from './types';

const isBeta = () => window.location.pathname.split('/')[1] === 'beta';

const useFeatureFlag = (flag: ValidFeatureFlags): boolean => {
  const features = useContext(Context);

  // On beta use the beta flag which has the 'beta_flagname' format.
  const betaFlag = `beta_${flag}`;

  const feature = features.find(
    ({ name }) => name === (isBeta() ? betaFlag : flag)
  );

  return !!feature && feature.enabled;
};

export default useFeatureFlag;
