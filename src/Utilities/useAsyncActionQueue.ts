import React, { useEffect, useState } from 'react';

interface Props<T> {
  executeAction: (args: T) => void;
  waitFor: React.DependencyList;
}

interface Return<T> {
  push: (action: T) => void;
}

const useAsyncActionQueue = <T>({
  executeAction,
  waitFor,
}: Props<T>): Return<T> => {
  const [actionQueue, setActionQueue] = useState<T[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processNext = () => {
    const action = actionQueue[0];
    if (action) {
      setIsProcessing(true);
      executeAction(action);
      setActionQueue((prev) => prev.slice(1));
    }
  };

  useEffect(() => {
    if (!isProcessing) {
      processNext();
    }
  }, [actionQueue, isProcessing]);

  useEffect(() => {
    setIsProcessing(false);
  }, waitFor);

  return {
    push: (action) => {
      setActionQueue((prev) => [...prev, action]);
    },
  };
};

export default useAsyncActionQueue;
