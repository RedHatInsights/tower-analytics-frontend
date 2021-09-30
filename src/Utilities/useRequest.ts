import { useEffect, useState, useCallback } from 'react';
import useIsMounted from './useIsMounted';

type ErrorType = unknown; // TODO: When the error format is evident, use that instead of `unknown`

/*
 * The useRequest hook accepts a request function and returns an object with
 * five values:
 *   request: a function to call to invoke the request
 *   result: the value returned from the request function (once invoked)
 *   isLoading: boolean state indicating whether the request is in active/in flight
 *   error: any caught error resulting from the request
 *   isSuccess: once request is completed and there were no errors
 *   setValue: setter to explicitly set the result value
 *
 * The hook also accepts an optional second parameter which is a default
 * value to set as result before the first time the request is made.
 */
interface UseRequestVariables<T> {
  result: T;
  error: ErrorType;
  isLoading: boolean;
  isSuccess: boolean;
}

interface UseRequestReturn<T> extends UseRequestVariables<T> {
  request: () => void;
  setValue: (value: T) => void;
}

const useRequest = <T>(
  makeRequest: () => Promise<T>,
  initialValue: T
): UseRequestReturn<T> => {
  const [variables, setVariables] = useState<UseRequestVariables<T>>({
    result: initialValue,
    error: null,
    isLoading: false,
    isSuccess: false,
  });
  const isMounted = useIsMounted();

  return {
    ...variables,
    request: useCallback(
      async (...args) => {
        setVariables({
          ...variables,
          isSuccess: false,
          isLoading: true,
        });
        try {
          const response = await makeRequest(...args);
          if (isMounted.current) {
            setVariables({
              isLoading: false,
              result: response,
              error: null,
              isSuccess: true,
            });
          }
        } catch (error: unknown) {
          if (isMounted.current) {
            setVariables({
              isSuccess: false,
              isLoading: false,
              error,
              result: initialValue,
            });
          }
        }
      },
      [makeRequest]
    ),
    setValue: (value: T) => setVariables({ ...variables, result: value }),
  };
};

/*
 * Provides controls for "dismissing" an error message
 *
 * Params: an error object
 * Returns: { error, dismissError }
 *   The returned error object is the same object passed in via the paremeter,
 *   until the dismissError function is called, at which point the returned
 *   error will be set to null on the subsequent render.
 */
interface UseDismissableErrorReturn {
  error: ErrorType;
  dismissError: () => void;
}

export const useDismissableError = (
  error: ErrorType
): UseDismissableErrorReturn => {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  return {
    error: showError ? error : null,
    dismissError: () => {
      setShowError(false);
    },
  };
};

/*
 * Hook to assist with deletion of items from a paginated item list.
 *
 * Params: a callback function that will be invoked in order to delete items,
 *   and an object with structure { qsConfig, allItemsSelected, fetchItems }
 * Returns: { isLoading, deleteItems, deletionError, clearDeletionError }
 */
interface UseDeleteItemsReturn {
  isLoading: boolean;
  deleteItems: () => void;
  deletionError: ErrorType;
  clearDeletionError: () => void;
}

export const useDeleteItems = (
  makeRequest: () => Promise<void>
): UseDeleteItemsReturn => {
  const {
    error: requestError,
    isLoading,
    request,
  } = useRequest(makeRequest, null);
  const { error, dismissError } = useDismissableError(requestError);

  return {
    isLoading,
    deleteItems: request,
    deletionError: error,
    clearDeletionError: dismissError,
  };
};

export default useRequest;
