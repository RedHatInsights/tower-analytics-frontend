/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { useQueryParams } from '../../Utilities/useQueryParams';
import LoadingState from '../../Components/LoadingState';
import NoData from '../../Components/NoData';
import EmptyState from '../../Components/EmptyState';
import { preflightRequest, readROI } from '../../Api';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
    Card,
    CardBody,
    CardHeader,
    InputGroup,
    InputGroupText,
    TextInput,
    Title
} from '@patternfly/react-core';

import { DollarSignIcon } from '@patternfly/react-icons';

import TopTemplatesSavings from '../../Charts/ROITopTemplates';

import {
    calculateDelta,
    convertSecondsToMins,
    convertMinsToSeconds,
    convertSecondsToHours
} from '../../Utilities/helpers';

let defaultAvgRunVal = 3600; // 1 hr

// create our array to feed to D3
const formatData = (response, defaults) => {
    return response.reduce((formatted, { name, template_id: id, successful_run_count, successful_elapsed_sum, successful_host_count_avg }) => {
        const avg_run = (successful_elapsed_sum / successful_run_count);
        formatted.push({
            name,
            id,
            run_count: successful_run_count,
            host_count: Math.ceil(successful_host_count_avg) || 0,
            calculations: [
                {
                    type: 'manual',
                    avg_run: defaults,
                    total: defaults * successful_run_count || 0
                },
                {
                    type: 'automated',
                    avg_run: avg_run || 0,
                    total: avg_run * successful_run_count || 0
                }
            ]
        });
        return formatted;
    }, []);
};

const InputAndText = styled.div`
  display: flex;
  align-items: center;
  padding-top: 10px;

  & .pf-c-input-group {
    flex-basis: 150px;
    margin-right: 10px;
  }
`;

const title =
<span>Automation Analytics<span style={ { fontSize: '16px' } } > <span style={ { margin: '0 10px' } } >|</span> Automation Calculator</span></span>;

const initialQueryParams = {
    startDate: moment.utc()
    .subtract(3, 'months')
    .format('YYYY-MM-DD'),
    endDate: moment.utc().format('YYYY-MM-DD')
};

const AutomationCalculator = () => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ formattedData, setFormattedData ] = useState([]);
    const [ costManual, setCostManual ] = useState(0);
    const [ costAutomation, setCostAutomation ] = useState(0);
    const [ totalSavings, setTotalSavings ] = useState(0);
    const [ roiData, setRoiData ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const { queryParams } = useQueryParams(initialQueryParams);

    useEffect(() => {
        const formatted = formatData(roiData, defaultAvgRunVal);
        setFormattedData(formatted);
    }, [ roiData ]);

    useEffect(() => {
        let ignore = false;
        const getData = () => {
            return Promise.all([
                readROI({ params: queryParams })
            ].map(p => p.catch(() => [])));
        };

        async function initializeWithPreflight() {
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            await preflightRequest().catch(error => {
                setPreFlightError({ preflightError: error });
            });
            getData().then(([
                { templates: roiData = []}
            ]) => {
                if (!ignore) {
                    setRoiData(roiData);
                    setIsLoading(false);
                }
            });
        }

        initializeWithPreflight();
        return () => ignore = true;
    }, []);

    useEffect(() => {
        let data = [ ...formattedData ];
        let total = 0;
        data.forEach(datum => {
            total += calculateDelta(
                convertSecondsToHours(datum.calculations[1].avg_run) * costAutomation,
                convertSecondsToHours(datum.calculations[0].avg_run) * costManual
            ) * datum.run_count * datum.host_count;
        });
        const totalWithCommas = total
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setTotalSavings('$' + totalWithCommas);
    }, [ formattedData, costAutomation, costManual ]);

    const updateData = (ms, id) => {
        let data = [ ...formattedData ];
        data.map(datum => {
            if (datum.id === id) {
                datum.calculations[0].avg_run = ms;
                datum.calculations[0].total = ms * datum.run_count;
            }
        });
        return data;
    };

    const handleManualTimeChange = (minutes, id) => {
        const seconds = convertMinsToSeconds(minutes);
        const updated = updateData(seconds, id);
        setFormattedData(updated);
    };

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={ title } />
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
                <div style={ { display: 'flex' } }>
                    <div style={ { flex: '2' } }>
                        <Main style={ { paddingBottom: '0' } }>
                            <Card>
                                <CardHeader>Automation vs manual</CardHeader>
                                <CardBody>
                                    { isLoading && !preflightError && <LoadingState /> }
                                    { !isLoading && formattedData.length <= 0 && (
                                        <NoData />
                                    ) }
                                    { formattedData.length > 0 && !isLoading && (
                                        <TopTemplatesSavings
                                            margin={ { top: 20, right: 20, bottom: 50, left: 70 } }
                                            id="d3-roi-chart-root"
                                            data={ formattedData }
                                        />
                                    ) }
                                </CardBody>
                            </Card>
                        </Main>
                        <Main style={ { paddingBottom: '0' } }>
                            <Card>
                                <CardHeader>Automation formula</CardHeader>
                                <CardBody>
                                    <p>
                      Your automation savings is calculated by the following
                      formula:
                                    </p>
                                    <p>
                                        <em>
                        S = &sum;fc<sub>m</sub>t - fc<sub>a</sub>t
                                        </em>
                                    </p>
                                </CardBody>
                            </Card>
                        </Main>
                    </div>
                    <div style={ { flex: '1' } }>
                        <Main style={ { paddingBottom: '0', paddingLeft: '0' } }>
                            <Card>
                                <CardHeader style={ { paddingBottom: '0' } }>
                    Total savings
                                </CardHeader>
                                <CardBody>
                                    <Title
                                        headingLevel="h3"
                                        size="2xl"
                                        style={ { color: 'var(--pf-global--success-color--200)' } }
                                    >
                                        { totalSavings }
                                    </Title>
                                </CardBody>
                            </Card>
                        </Main>
                        <Main style={ { paddingBottom: '0', paddingLeft: '0' } }>
                            <Card>
                                <CardHeader>Calculate your automation</CardHeader>
                                <CardBody>
                                    <InputAndText>
                                        <InputGroup>
                                            <InputGroupText>
                                                <DollarSignIcon />
                                            </InputGroupText>
                                            <TextInput
                                                id="manual-cost"
                                                type="number"
                                                aria-label="manual-cost"
                                                value={ costManual }
                                                onChange={ e => setCostManual(e) }
                                            />
                                            <InputGroupText>/hr</InputGroupText>
                                        </InputGroup>
                                        <p>Manual cost of automation</p>
                                    </InputAndText>
                                    <em>
                      (e.g. average salary of mid-level SE with your company)
                                    </em>
                                    <InputAndText>
                                        <InputGroup>
                                            <InputGroupText>
                                                <DollarSignIcon />
                                            </InputGroupText>
                                            <TextInput
                                                id="automation-cost"
                                                type="number"
                                                aria-label="automation-cost"
                                                value={ costAutomation }
                                                onChange={ e => setCostAutomation(e) }
                                            />
                                            <InputGroupText>/hr</InputGroupText>
                                        </InputGroup>
                                        <p>Cost of automation</p>
                                    </InputAndText>
                                </CardBody>
                            </Card>
                        </Main>
                        <Main style={ { paddingBottom: '0', paddingLeft: '0' } }>
                            <Card>
                                <CardHeader>Top templates</CardHeader>
                                <CardBody>
                                    <p>
                      Enter the time it takes to run the following templates by
                      hand.
                                    </p>
                                    { formattedData.map(data => (
                                        <InputAndText key={ data.id }>
                                            <InputGroup>
                                                <TextInput
                                                    id={ data.id }
                                                    type="number"
                                                    aria-label="time run manually"
                                                    value={ convertSecondsToMins(
                                                        data.calculations[0].avg_run
                                                    ) }
                                                    onChange={ e => {
                                                        handleManualTimeChange(e, data.id);
                                                    } }
                                                />
                                                <InputGroupText>min</InputGroupText>
                                            </InputGroup>
                                            <p>
                                                { data.name } (ran x { data.run_count } times)
                                            </p>
                                        </InputAndText>
                                    )) }
                                </CardBody>
                            </Card>
                        </Main>
                    </div>
                </div>
            ) }
        </React.Fragment>
    );
};

export default AutomationCalculator;
