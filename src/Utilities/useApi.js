import { useState, useEffect, useReducer } from 'react';

const dataFetchReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                error: null
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                error: null,
                data: action.payload
            };
        case 'FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isSuccess: false,
                error: action.payload
            };
        default:
            throw new Error();
    }
};

const useApi = (initialData, postprocess = d => d) => {
    const [ request, setRequest ] = useState(null);

    const [ state, dispatch ] = useReducer(dataFetchReducer, {
        isLoading: false,
        isSuccess: false,
        error: null,
        data: initialData
    });

    useEffect(() => {
        // Prevent fetching nothing
        if (!request) {
            return;
        }

        // Initialize
        let didCancel = false;
        dispatch({ type: 'FETCH_INIT' });

        // Fetching
        window.insights.chrome.auth.getUser().then(() => request.then(data => {
            if (!didCancel) {
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: postprocess(data)
                });
            }
        }).catch(e => {
            if (!didCancel) {
                dispatch({ type: 'FETCH_FAILURE', payload: e });
            }
        }));

        return () => { didCancel = true; };
    }, [ request ]);

    return [ state, setRequest ];
};

export default useApi;
