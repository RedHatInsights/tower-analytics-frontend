/* eslint-disable */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import {
    preflightRequest,
    readPlanOptions,
    readPlans
} from '../../Api';
import ApiErrorState from '../../Components/ApiErrorState';
import LoadingState from '../../Components/LoadingState';
import PlanCard from './PlanCard';
import useApi from '../../Utilities/useApi';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
    Gallery
} from '@patternfly/react-core';

const SavingsPlanner = () => {
    const [
        {
            isLoading,
            isSuccess,
            error,
            data: { items: data = [] }
        },
        setData
    ] = useApi({ items: [] });
    const [ options, setOptions ] = useApi({});

    useEffect(() => {
        const fetchEndpoints = () => {
            setData(readPlans({ params: { limit: 10 } }));
            setOptions(readPlanOptions());
        };

        fetchEndpoints();
    }, []);

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={'Savings Planner'} />
            </PageHeader>
                {error && (
                    <Main>
                        <ApiErrorState message={error.error} />
                    </Main>
                )}
                {isLoading && (
                    <Main>
                        <LoadingState />
                    </Main>
                )}
                {isSuccess && (
                    <Main>
                        <Gallery hasGutter>
                            {options.isSuccess && data.map(datum => (
                                <PlanCard
                                    key={datum.id}
                                    isSuccess={options.isSuccess}
                                    templates={options.data.templates}
                                    {...datum}
                                />
                            ))}
                        </Gallery>
                    </Main>
                )}
        </React.Fragment>
    );
};

SavingsPlanner.propTypes = {
};

export default SavingsPlanner;
