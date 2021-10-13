import { useState, useEffect } from 'react';

const useAsyncActionQueue = ({ executeAction, waitFor }) => {
  const [actionQueue, setActionQueue] = useState([]);
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
  }, [waitFor]);

  return {
    push: (action) => {
      setActionQueue((prev) => [...prev, action]);
    },
  };
};

export default useAsyncActionQueue;
