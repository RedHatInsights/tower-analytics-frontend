import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ApiErrorState from './ApiErrorState';
import LoadingState from './LoadingState';

// Making default propr references constant to avoid
// uneccesary rerenders
const settersDefault = {
    data: null,
    error: null,
    loading: null
};
const errorComponentDefault = <ApiErrorState />;
const loadingComponentDefault = <LoadingState />;

const ApiResource = ({
    request = null,
    params = null,
    thenHook = null,
    errorHook = null,
    finallyHook = null,
    errorComponent = errorComponentDefault,
    loadingComponent = loadingComponentDefault,
    dataDefaultValue = {},
    setters = settersDefault,
    passPropsToError = false,
    passPropsToChild = false,
    children
}) => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ data, setData ] = useState(dataDefaultValue);

    // If supplied function use the callback to propagate state change to parent.
    useEffect(() => { setters.data ? setters.data(data) : null; }, [ data ]);
    useEffect(() => { setters.loading ? setters.loading(loading) : null; }, [ loading ]);
    useEffect(() => { setters.error ? setters.error(error) : null; }, [ error ]);

    // When request changes use it to query the api and get new data.
    useEffect(() => {
        if (!request) {
            return;
        }

        setLoading(true);
        window.insights.chrome.auth.getUser().then(() =>
            request(params).then(data => {
                // If thenHook supplied run it first
                data = thenHook ? thenHook(data) : data;

                // Set the data with the modified data
                setData(data);
            }).catch(data => {
                // If errorHook supplied run it first
                data = errorHook ? errorHook(data) : data;

                // Set the error with the modified data
                setError(data);
            }).finally(data => {
                setLoading(false);

                // Run finally hook if supplied
                if (finallyHook) {
                    finallyHook(data);
                }
            })
        );
    }, [ request ]);

    /**
     * Returns the component which should be displayed. Priority:
     * loading -> error -> children (data)
     * If should pass props to error or children component
     * then makes a clone with merged props.
     */
    const renderComponent = () => {
        if (loading && loadingComponent) {
            return loadingComponent;
        } else if (error && errorComponent) {
            // If need to pass props to the error component clone and set props
            if (passPropsToError) {
                return React.cloneElement(errorComponent, { ...error });
            } else {
                return errorComponent;
            }
        } else {
            // If need to pass props to the child component clone and set props
            if (passPropsToChild) {
                return React.cloneElement(children, { ...data });
            } else {
                return children;
            }
        }
    };

    return renderComponent();
};

ApiResource.propTypes = {
    request: PropTypes.func,
    params: PropTypes.object,
    thenHook: PropTypes.func,
    errorHook: PropTypes.func,
    finallyHook: PropTypes.func,
    errorComponent: PropTypes.object,
    loadingComponent: PropTypes.object,
    dataDefaultValue: PropTypes.any,
    setters: PropTypes.shape({
        data: PropTypes.func,
        error: PropTypes.func,
        loading: PropTypes.func
    }),
    passPropsToError: PropTypes.bool,
    passPropsToChild: PropTypes.bool
};

export default ApiResource;
