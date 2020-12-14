import { useEffect, useState, useRef, useCallback } from 'react';

/*
 * The useFetch hook accepts a request function and returns an object with
 * five values:
 *   request: a function to call to invoke the request
 *   result: the value returned from the request function (once invoked)
 *   isLoading: boolean state indicating whether the request is in active/in flight
 *   error: any caught error resulting from the request
 *   setValue: setter to explicitly set the result value
 *
 * The hook also accepts an optional second parameter which is a default
 * value to set as result before the first time the request is made.
 */
export default function useFetch(makeRequest, initialValue) {
    const [ result, setResult ] = useState(initialValue);
    const [ error, setError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const isMounted = useRef(null);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    return {
        result,
        error,
        isLoading,
        request: useCallback(
            async (...args) => {
                setIsLoading(true);
                try {
                    // Get user token before making any API calls
                    await window.insights.chrome.auth.getUser();
                    const response = await makeRequest(...args);
                    if (isMounted.current) {
                        setResult(response);
                        setError(null);
                    }
                } catch (err) {
                    if (isMounted.current) {
                        setError(err);
                        setResult(initialValue);
                    }
                } finally {
                    if (isMounted.current) {
                        setIsLoading(false);
                    }
                }
            },
            /* eslint-disable-next-line react-hooks/exhaustive-deps */
            [ makeRequest ]
        ),
        setValue: setResult
    };
}
