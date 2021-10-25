import { useContext } from 'react';
import Context from './Context';
import { ValidFeatureFlags } from './types';

const isBeta = () => window.location.pathname.split('/')[1] === 'beta';
const isLocalhost = () => window.location.hostname === 'localhost';

const useFeatureFlag = (flag: ValidFeatureFlags): boolean => {
  const features = useContext(Context);

  // On beta use the beta flag which has the 'beta_flagname' format.
  const betaFlag = `beta_${flag}`;

  const feature = features.find(
    ({ name }) => name === (isBeta() ? betaFlag : flag)
  );

  if (isLocalhost()) return true;
  return !!feature && feature.enabled;
};

export default useFeatureFlag;
