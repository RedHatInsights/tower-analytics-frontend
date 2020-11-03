import React, { useState, useEffect } from 'react';
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
import FilterableToolbar from '../../Components/Toolbar/';

// Imports from API
import {
    preflightRequest,
    readROI,
    readJobExplorerOptions
} from '../../Api';

// Imports from utilities
import { useQueryParams } from '../../Utilities/useQueryParams';
import { roi as roiConst } from '../../Utilities/constants';
import useRedirect from '../../Utilities/useRedirect';
import {
    calculateDelta,
    convertSecondsToHours,
    keysToCamel
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

// TODO Mutates data!!!
const computeTotalSavings = (filteredData, costAutomation, costManual) => {
    const costAutomationNum = parseFloat(costAutomation);
    const costManualNum = parseFloat(costManual);
    let total = 0;
    let costAutomationPerHour;
    let costManualPerHour;

    filteredData.forEach((datum) => {
        costAutomationPerHour =
            convertSecondsToHours(datum.elapsed) * costAutomationNum;
        costManualPerHour =
            convertSecondsToHours(datum.calculations.manual.avgRun) *
            datum.hostCount *
            costManualNum;
        total += calculateDelta(costAutomationPerHour, costManualPerHour);
        datum.delta = calculateDelta(costAutomationPerHour, costManualPerHour);
        datum.calculations.manual.cost = costManualPerHour;
        datum.calculations.automated.cost = costAutomationPerHour;
    });

    return total;
};

const AutomationCalculator = ({ history }) => {
    const toJobExplorer = useRedirect(history, 'jobExplorer');
    const [ isLoading, setIsLoading ] = useState(true);
    const [ costManual, setCostManual ] = useState('50');
    const [ costAutomation, setCostAutomation ] = useState('20');
    const [ totalSavings, setTotalSavings ] = useState(0);
    const [ unfilteredData, setUnfilteredData ] = useState([]);
    const [ quickDateRange, setQuickDateRange ] = useState([]);
    const [ preflightError, setPreFlightError ] = useState(null);
    const {
        urlMappedQueryParams,
        queryParams,
        setFromToolbar
    } = useQueryParams(roiConst.defaultParams);

    /**
     * Check for preflight error after mounted.
     */
    useEffect(() => {
        setIsLoading(true);
        window.insights.chrome.auth.getUser()
        .then(() =>
            preflightRequest()
            .catch((error) => { setPreFlightError({ preflightError: error }); })
            // Loading is set false when the data also loaded
        );
    }, []);

    /**
     * Recalculates the total saving after the cost or the data is changed.
     */
    useEffect(() => {
        setTotalSavings(
            computeTotalSavings(unfilteredData, costAutomation, costManual)
        );
    }, [ unfilteredData, costAutomation, costManual ]);

    /**
     * Get data from API depending on the queryParam.
     * TODO API Error handling
     */
    useEffect(() => {
        setIsLoading(true);
        window.insights.chrome.auth.getUser()
        .then(() => {
            Promise.all([
                readROI({ params: urlMappedQueryParams }),
                readJobExplorerOptions({ params: urlMappedQueryParams })
            ])
            .then(([
                { items },
                explorerOptions
            ]) => {
                const { quickDateRange } = keysToCamel(explorerOptions);
                items = keysToCamel(items);

                setUnfilteredData(mapApi(items));
                setQuickDateRange(quickDateRange);
            })
            .finally(() => { setIsLoading(false); });
        });
    }, [ queryParams ]);

    /**
     * Function to redirect to the job explorer page
     * with the same filters as is used here.
     */
    const redirectToJobExplorer = templateId => {
        const { attributes: ignored, ...rest } = queryParams;
        const initialQueryParams = {
            ...rest,
            template_id: templateId
        };
        toJobExplorer(initialQueryParams);
    };

    return (
        <React.Fragment>
            <PageHeader style={ { flex: '0' } }>
                <PageHeaderTitle title={ 'Automation Calculator' } />
            </PageHeader>
            { preflightError && (
                <Main>
                    <Card>
                        <CardBody>
                            <EmptyState { ...preflightError } />
                        </CardBody>
                    </Card>
                </Main>
            ) }
            { !preflightError && (
                <React.Fragment>
                    <Main style={ { paddingBottom: '0' } }>
                        <Card>
                            <CardBody>
                                <FilterableToolbar
                                    categories={ {
                                        quickDateRange
                                    } }
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
                                        { isLoading && !preflightError && <LoadingState /> }
                                        { !isLoading && unfilteredData.length <= 0 && <NoData /> }
                                        { unfilteredData.length > 0 && !isLoading && (
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
                                <TotalSavings totalSavings={ totalSavings } />
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
                                    unfilteredData={ unfilteredData }
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

export default AutomationCalculator;
