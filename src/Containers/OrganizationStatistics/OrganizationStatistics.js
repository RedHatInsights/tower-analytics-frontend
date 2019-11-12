import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import {
    preflightRequest,
    readJobsByDateAndOrg,
    readJobRunsByOrg,
    readJobEventsByOrg
} from '../../Api';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
    Card,
    CardBody,
    CardHeader as PFCardHeader,
    FormSelect,
    FormSelectOption
} from '@patternfly/react-core';

import GroupedBarChart from '../../Charts/GroupedBarChart';
import PieChart from '../../Charts/PieChart';

const CardHeader = styled(PFCardHeader)`
    border-bottom: 2px solid #ebebeb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &&& {
        min-height: 60px;
        --pf-c-card--first-child--PaddingTop: 10px;
        --pf-c-card__header--not-last-child--PaddingBottom: 10px;

        h3 {
        font-size: 0.875em;
        }
    }
`;

const CardContainer = styled.div`
  display: flex;
  overflow: hidden;

  .pf-c-card {
    width: 50%;
    margin-top: 20px;
    overflow: auto;
  }

  .pf-c-card:first-of-type {
    margin-right: 20px;
  }
`;

const TopCard = styled(Card)`
  min-height: 500px;
`;

const title =
<span>Automation Analytics<span style={ { fontSize: '16px' } } > <span style={ { margin: '0 10px' } } >|</span> Organization Statistics</span></span>;

const timeFrameOptions = [
    { value: 'please choose', label: 'Select Date Range', disabled: true },
    { value: 7, label: 'Past Week', disabled: false },
    { value: 14, label: 'Past 2 Weeks', disabled: false },
    { value: 31, label: 'Past Month', disabled: false }
];

const OrganizationStatistics = () => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ pieChart1Data, setPieChart1Data ] = useState([]);
    const [ pieChart2Data, setPieChart2Data ] = useState([]);
    const [ groupedBarChartData, setGroupedBarChartData ] = useState([]);
    const [ orgsJobsTimeFrame, setOrgsJobsTimeFrame ] = useState(7);
    const [ orgsPlaybookTimeFrame, setOrgsPlaybookTimeFrame ] = useState(7);
    const [ orgsStorageTimeFrame, setOrgsStorageTimeFrame ] = useState(7);
    const handleDateToggle = async (selectedDates, id) => {
        if (!id) {
            return;
        }

        const params = selectedDates || {};
        if (id === 1) {
            setPieChart1Data([]);
            const { usages: pieChart1Data } = await readJobRunsByOrg({
                params
            });
            setPieChart1Data(pieChart1Data);
        }

        if (id === 2) {
            setPieChart2Data([]);
            const { usages: pieChart2Data } = await readJobEventsByOrg({
                params
            });
            setPieChart2Data(pieChart2Data);
        }
    };

    useEffect(() => {
        let ignore = false;
        const getData = () => {
            const today = moment.utc().format('YYYY-MM-DD');
            const previousDay = moment.utc()
            .subtract(7, 'days')
            .format('YYYY-MM-DD');
            const defaultPrams = { params: { startDate: previousDay, endDate: today }};
            return Promise.all([
                readJobsByDateAndOrg(),
                readJobRunsByOrg(defaultPrams),
                readJobEventsByOrg(defaultPrams)
            ].map(p => p.catch(() => [])));
        };

        async function initializeWithPreflight() {
            await window.insights.chrome.auth.getUser();
            await preflightRequest().catch(error => {
                setPreFlightError({ preflightError: error });
            });
            getData().then(([
                { dates: groupedBarChartData = []},
                { usages: pieChart1Data = []},
                { usages: pieChart2Data = []}
            ]) => {
                if (!ignore) {
                    setGroupedBarChartData(groupedBarChartData);
                    setPieChart1Data(pieChart1Data);
                    setPieChart2Data(pieChart2Data);
                }
            });
        }

        initializeWithPreflight();
        return () => ignore = true;
    }, []);

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
                <Main>
                    <TopCard>
                        <CardHeader>
                            <h2>Organization Status</h2>
                            <div style={ { display: 'flex', justifyContent: 'flex-end' } }>
                                <FormSelect
                                    name="orgsJobsTimeFrame"
                                    value={ orgsJobsTimeFrame }
                                    onChange={ value => setOrgsJobsTimeFrame(+value) }
                                    aria-label="Select Date Range"
                                    style={ { margin: '2px 10px' } }
                                >
                                    { timeFrameOptions.map((option, index) => (
                                        <FormSelectOption
                                            isDisabled={ option.disabled }
                                            key={ index }
                                            value={ option.value }
                                            label={ option.label }
                                        />
                                    )) }
                                </FormSelect>
                            </div>
                        </CardHeader>
                        <CardBody>
                            { groupedBarChartData.length <= 0 && <LoadingState /> }
                            { groupedBarChartData.length > 0 && (
                                <GroupedBarChart
                                    margin={ { top: 20, right: 20, bottom: 50, left: 50 } }
                                    id="d3-grouped-bar-chart-root"
                                    data={ groupedBarChartData }
                                    timeFrame={ orgsJobsTimeFrame }
                                />
                            ) }
                        </CardBody>
                    </TopCard>
                    <CardContainer>
                        <Card>
                            <CardBody style={ { padding: 0 } }>
                                <CardHeader
                                    style={ { padding: 0 } }
                                >
                                    <h2 style={ { marginLeft: '20px' } }>
                                Job Runs by Organization
                                    </h2>
                                    <FormSelect
                                        name="orgsPlaybookTimeFrame"
                                        value={ orgsPlaybookTimeFrame }
                                        onChange={ value => setOrgsPlaybookTimeFrame(+value) }
                                        aria-label="Select Date Range"
                                        style={ { margin: '2px 10px', width: '33%' } }
                                    >
                                        { timeFrameOptions.map((option, index) => (
                                            <FormSelectOption
                                                isDisabled={ option.disabled }
                                                key={ index }
                                                value={ option.value }
                                                label={ option.label }
                                            />
                                        )) }
                                    </FormSelect>
                                </CardHeader>
                                { pieChart1Data.length <= 0 && <LoadingState /> }
                                { pieChart1Data.length > 0 && (
                                    <PieChart
                                        margin={ { top: 20, right: 20, bottom: 0, left: 20 } }
                                        id="d3-donut-1-chart-root"
                                        tag={ 1 }
                                        data={ pieChart1Data }
                                        timeFrame={ orgsPlaybookTimeFrame }
                                        onDateToggle={ handleDateToggle }
                                    />
                                ) }
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody style={ { padding: 0 } }>
                                <CardHeader
                                    style={ { padding: 0 } }
                                >
                                    <h2 style={ { marginLeft: '20px' } }>Usage by Organization (Tasks)</h2>
                                    <FormSelect
                                        name="orgsStorageTimeFrame"
                                        value={ orgsStorageTimeFrame }
                                        onChange={ value => setOrgsStorageTimeFrame(+value) }
                                        aria-label="Select Date Range"
                                        style={ { margin: '2px 10px', width: '33%' } }
                                    >
                                        { timeFrameOptions.map((option, index) => (
                                            <FormSelectOption
                                                isDisabled={ option.disabled }
                                                key={ index }
                                                value={ option.value }
                                                label={ option.label }
                                            />
                                        )) }
                                    </FormSelect>
                                </CardHeader>
                                { pieChart2Data.length <= 0 && <LoadingState /> }
                                { pieChart2Data.length > 0 && (
                                    <PieChart
                                        margin={ { top: 20, right: 20, bottom: 0, left: 20 } }
                                        id="d3-donut-2-chart-root"
                                        tag={ 2 }
                                        data={ pieChart2Data }
                                        timeFrame={ orgsStorageTimeFrame }
                                        onDateToggle={ handleDateToggle }
                                    />
                                ) }
                            </CardBody>
                        </Card>
                    </CardContainer>
                </Main>
            ) }
        </React.Fragment>
    );
};

export default OrganizationStatistics;
