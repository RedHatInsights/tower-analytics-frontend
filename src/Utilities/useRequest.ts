import { useCallback, useEffect, useState } from 'react';
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

/**
 * The function deeply compares objects if present if they have the same type
 * or properties as the required object. This is used to check if the response has
 * all the required fields. The function only compares the shape of the passed objects,
 * not the values they hold.
 *
 * @param obj The object which is checked.
 * @param required The object which attributes (deeply) are required in the obj.
 * @returns True if all the attributes of the required object are in the recieved object.
 */
const hasAttributesDeep = (obj: unknown, required: unknown): boolean => {
  // If they are objects, lets do the deep comparison.
  if (
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    obj !== null &&
    typeof required === 'object' &&
    !Array.isArray(required) &&
    required !== null
  ) {
    const reqKeys = Object.keys(required);
    const objKeys = Object.keys(obj);

    if (reqKeys.length < 1) return true;
    if (reqKeys.length > objKeys.length) return false;

    const matchArray = reqKeys.map(
      (key) =>
        !!Object.prototype.hasOwnProperty.call(required, key) &&
        !!Object.prototype.hasOwnProperty.call(obj, key) &&
        // eslint-disable-next-line
        // @ts-ignore-next-line
        hasAttributesDeep(obj[key], required[key])
    );

    return !matchArray.includes(false);
  }

  // Same type, but not an object
  return typeof obj === typeof required;
};

const useRequest = <T>(
  makeRequest: (...args: unknown[]) => Promise<T>,
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
      async (...args: unknown[]) => {
        setVariables({
          ...variables,
          isSuccess: false,
          isLoading: true,
        });
        try {
          const response = await makeRequest(...args);

          const hasSameAttrs = hasAttributesDeep(response, initialValue);
          if (!hasSameAttrs)
            console.error(
              'The request does not have all the required attributes.',
              '\nRecieved response from API:\n',
              response,
              '\nInitial value supplied:\n',
              initialValue
            );

          if (isMounted.current) {
            setVariables({
              isLoading: false,
              result: hasSameAttrs ? response : initialValue,
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
