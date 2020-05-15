import { useState, useEffect } from 'react';
import API from '../Api';

export const useFetch = (type, defaultData, query = undefined) => {
    const [ data, setData ] = useState(defaultData);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isError, setIsError ] = useState(false);
    const [ preflightError, setPreFlightError ] = useState(null);

    useEffect(() => {
        const params = query ? { params: query } : {};

        setIsLoading(true);
        setPreFlightError(null);
        API.getUser().then(() =>
            API.preflightRequest().then(() =>
                API[type](params)
                .then(response => setData(response))
                .catch(() => setIsError(true))
                .finally(() => setIsLoading(false))
            ).catch(error => {
                setPreFlightError({ preflightError: error });
            })
        );
    }, [ query ]);

    return { ...data, isLoading, isError, preflightError };
};

export const useLoading = arr => {
    const [ isLoading, setLoading ] = useState(false);

    useEffect(() => {
        let loading = false;
        arr.forEach(item => loading = item || loading);
        setLoading(loading);
    }, [ arr ]);

    return isLoading;
};

export const useError = arr => {
    const [ error, setError ] = useState(null);

    useEffect(() => {
        setError(null);
        for (const el of arr) {
            if (el !== null) {
                setError(el);
                break;
            }
        }
    }, [ arr ]);

    return error;
};
