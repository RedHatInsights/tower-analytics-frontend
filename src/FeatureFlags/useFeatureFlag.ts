import { useFlag, useFlagsStatus } from '@unleash/proxy-client-react';

const isBeta = () => window.location.pathname.split('/')[1] === 'preview';

// Devel environment checks
const isLocalhost = () => window.location.hostname === 'localhost';
const isEphemeral = () => window.location.hostname.includes('ephemeral');

const useFeatureFlag = (flag: string): boolean => {
  // On beta use the beta flag which has the 'beta_flagname' format.
  const betaFlag = `beta_${flag}`;

  const { flagsReady } = useFlagsStatus();

  const flagToCheck = isBeta() ? betaFlag : flag;
  const isFlagEnabled = useFlag(flagToCheck);

  if (isLocalhost() || isEphemeral()) return true;

  return flagsReady ? isFlagEnabled : false;
};

export default useFeatureFlag;
