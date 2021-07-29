import React, { useEffect, useRef } from 'react';

const useIsMounted = (): React.RefObject<unknown> => {
  const isMounted = useRef<unknown>({});
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  });
  return isMounted;
};

export default useIsMounted;
