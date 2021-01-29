import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';
import {
    Card,
    CardBody
} from '@patternfly/react-core';

// Imports from custom components
import LoadingState from '../../Components/LoadingState';
import NoData from '../../Components/NoData';
import EmptyState from '../../Components/EmptyState';
import ApiErrorState from '../../Components/ApiErrorState';
import FilterableToolbar from '../../Components/Toolbar/';

// Imports from API
import {
    preflightRequest,
    readROI,
    readROIOptions
} from '../../Api';

// Imports from utilities
import { useQueryParams } from '../../Utilities/useQueryParams';
import useApi from '../../Utilities/useApi';
import { roi as roiConst } from '../../Utilities/constants';
import useRedirect from '../../Utilities/useRedirect';
import {
    calculateDelta,
    convertSecondsToHours
} from '../../Utilities/helpers';

// Chart
import TopTemplatesSavings from '../../Charts/ROITopTemplates';

// Local imports
import { mapApi, BorderedCardTitle } from './helpers';
import TotalSavings from './TotalSavings';
import CalculationCost from './CalculationCost';
import AutomationFormula from './AutomationFormula';
import TopTemplates from './TopTemplates';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 5fr 2fr;
  height: 100%;
`;

const WrapperLeft = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const WrapperRight = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`;

const updateDeltaCost = (data, costAutomation, costManual) => data.map(el => {
    const manualCost = convertSecondsToHours(el.avgRunTime) * el.hostCount * parseFloat(costManual);
    const automatedCost = convertSecondsToHours(el.elapsed) * parseFloat(costAutomation);
    const delta = calculateDelta(automatedCost, manualCost);

    return { ...el, delta, manualCost, automatedCost };
});

const computeTotalSavings = data => data.reduce((sum, curr) => sum + curr.delta, 0);

const AutomationCalculator = ({ history }) => {
    const toJobExplorer = useRedirect(history, 'jobExplorer');
    const [ costManual, setCostManual ] = useState('50');
    const [ costAutomation, setCostAutomation ] = useState('20');
    const [ unfilteredData, setUnfilteredData ] = useState([]);

    const [ preflight, setPreflight ] = useApi(null);
    const [ options, setOptions ] = useApi({});
    const [ api, setApi ] = useApi([], mapApi);

    const {
        queryParams,
        setFromToolbar
    } = useQueryParams(roiConst.defaultParams);

    /**
     * Modifies one elements avgRunTime in the unfilteredData
     * and updates all calculated fields.
     * Used in top templates.
     */
    const setDataRunTime = (seconds, id) => {
        const updatedData = unfilteredData.map(el => {
            if (el.id === id) {
                el.avgRunTime = seconds;
                const updatedDelta = updateDeltaCost([ el ], costAutomation, costManual)[0];
                return updatedDelta;
            } else {
                return el;
            }
        });

        setUnfilteredData(updatedData);
    };

    useEffect(() => {
        setPreflight(preflightRequest());
        setOptions(readROIOptions({ params: queryParams }));
    }, []);

    /**
     * Recalculates the delta and costs in the data after the cost is changed.
     */
    useEffect(() => {
        setUnfilteredData(
            updateDeltaCost(unfilteredData, costAutomation, costManual)
        );
    }, [ costAutomation, costManual ]);

    /**
     * After getting new data from the API re initialize the data with delta cost.
     * Note: this cannot be merged with the near same cost* useEffect
     */
    useEffect(() => {
        setUnfilteredData(
            updateDeltaCost(api.data, costAutomation, costManual)
        );
    }, [ api.data ]);

    /**
     * Get data from API depending on the queryParam.
     */
    useEffect(() => {
        setApi(readROI({ params: queryParams }));
    }, [ queryParams ]);

    /**
     * Function to redirect to the job explorer page
     * with the same filters as is used here.
     */
    const redirectToJobExplorer = templateId => {
        const initialQueryParams = {
            quick_date_range: 'last_30_days',
            template_id: [ templateId ]
        };
        toJobExplorer(initialQueryParams);
    };

    return (
        <React.Fragment>
            <PageHeader style={ { flex: '0' } }>
                <PageHeaderTitle title={ 'Automation Calculator' } />
            </PageHeader>
            { preflight.error && (
                <Main>
                    <EmptyState
                        preflightError={ preflight.error }
                    />
                </Main>
            ) }
            { preflight.isSuccess && (
                <React.Fragment>
                    <Main style={ { paddingBottom: '0' } }>
                        <Card>
                            <CardBody>
                                <FilterableToolbar
                                    categories={ options.data }
                                    filters={ queryParams }
                                    setFilters={ setFromToolbar }
                                />
                            </CardBody>
                        </Card>
                    </Main>
                    <Wrapper className="automation-wrapper">
                        <WrapperLeft>
                            <Main style={ { paddingBottom: '0' } }>
                                <Card>
                                    <BorderedCardTitle>Automation savings</BorderedCardTitle>
                                    <CardBody>
                                        { api.isLoading && <LoadingState /> }
                                        { api.error && <ApiErrorState message={ api.error.error } /> }
                                        { api.isSuccess && unfilteredData.length <= 0 && <NoData /> }
                                        { api.isSuccess && unfilteredData.length > 0 && (
                                            <React.Fragment>
                                                <TopTemplatesSavings
                                                    margin={ { top: 20, right: 20, bottom: 20, left: 70 } }
                                                    id="d3-roi-chart-root"
                                                    data={ unfilteredData }
                                                />
                                                <p style={ { textAlign: 'center' } }>Templates</p>
                                            </React.Fragment>
                                        ) }
                                    </CardBody>
                                </Card>
                            </Main>
                            <Main>
                                <AutomationFormula />
                            </Main>
                        </WrapperLeft>
                        <WrapperRight>
                            <Main style={ { paddingBottom: '0', paddingLeft: '0' } }>
                                <TotalSavings totalSavings={ computeTotalSavings(unfilteredData) } />
                            </Main>
                            <Main style={ { display: 'flex', flexDirection: 'column', flex: '1 1 0', paddingLeft: '0' } }>
                                <CalculationCost
                                    costManual={ costManual }
                                    setCostManual={ setCostManual }
                                    costAutomation={ costAutomation }
                                    setCostAutomation={ setCostAutomation }
                                />
                                <TopTemplates
                                    redirectToJobExplorer={ redirectToJobExplorer }
                                    data={ unfilteredData }
                                    setDataRunTime={ setDataRunTime }
                                    setUnfilteredData={ setUnfilteredData }
                                />
                            </Main>
                        </WrapperRight>
                    </Wrapper>
                </React.Fragment>
            ) }
        </React.Fragment>
    );
};

AutomationCalculator.propTypes = {
    history: PropTypes.object
};

export default AutomationCalculator;
