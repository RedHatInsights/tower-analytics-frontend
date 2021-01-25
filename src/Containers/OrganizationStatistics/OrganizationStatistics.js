import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { useQueryParams } from '../../Utilities/useQueryParams';

import LoadingState from '../../Components/LoadingState';
import NoData from '../../Components/NoData';
import EmptyState from '../../Components/EmptyState';
import ApiErrorState from '../../Components/ApiErrorState';

import {
    preflightRequest,
    readJobsByDateAndOrg,
    readJobRunsByOrg,
    readJobEventsByOrg,
    readOrgOptions
} from '../../Api';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';

import {
    Card,
    CardBody,
    CardTitle as PFCardTitle
} from '@patternfly/react-core';

import GroupedBarChart from '../../Charts/GroupedBarChart';
import PieChart from '../../Charts/PieChart';
import FilterableToolbar from '../../Components/Toolbar/';
import { organizationStatistics as constants } from '../../Utilities/constants';

// For chart colors
import { pfmulti } from '../../Utilities/colors';
import { scaleOrdinal } from 'd3';

const CardTitle = styled(PFCardTitle)`
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

const colorFunc = scaleOrdinal(pfmulti);

const OrganizationStatistics = ({ history }) => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ pieChart1Data, setPieChart1Data ] = useState([]);
    const [ pieChart2Data, setPieChart2Data ] = useState([]);
    const [ orgsChartData, setOrgsChartData ] = useState([]);
    const [ options, setOptions ] = useState({});
    const [ isLoading, setIsLoading ] = useState(true);
    const [ apiError, setApiError ] = useState(null);
    const {
        queryParams,
        setFromToolbar
    } = useQueryParams(constants.defaultParams);

    useEffect(() => {
        insights.chrome.appNavClick({ id: 'organization-statistics', secondaryNav: true });
        window.insights.chrome.auth.getUser().then(() =>
            preflightRequest().catch((error) => {
                setPreFlightError({ preflightError: error });
            })
        );
    }, []);

    const orgsChartMapper = data => data.map(({ date, items }) => ({
        date: new Date(date),
        items: items.map(({ id, total_count, name }) => ({
            id,
            date: new Date(date),
            value: total_count,
            name: name || 'No organization'
        }))
    }));

    const pieChartMapper = (data, attrName) => data.map(({ id, [attrName]: count, name }) => ({
        id,
        count,
        name: name || 'No organization'
    }));

    useEffect(() => {
        let didCancel = false;
        setIsLoading(true);
        window.insights.chrome.auth.getUser().then(() => Promise.all(
            [
                readOrgOptions({ params: queryParams }),
                readJobsByDateAndOrg({ params: queryParams }),
                readJobRunsByOrg({ params: queryParams }),
                readJobEventsByOrg({ params: queryParams })
            ]
        ).then(([
            options,
            { dates: orgsChartData = []},
            { items: pieChart1Data = []},
            { items: pieChart2Data = []}
        ]) => {
            if (didCancel) { return; }

            const { meta, inventory_id, ...rest } = options;

            setOptions({ ...rest, sort_by: meta.sort_by });
            setOrgsChartData(orgsChartMapper(orgsChartData));
            setPieChart1Data(pieChartMapper(pieChart1Data, 'host_count'));
            setPieChart2Data(pieChartMapper(pieChart2Data, 'host_task_count'));
        })
        .catch(e => setApiError(e.error))
        .finally(() => setIsLoading(false)));

        return () => didCancel = true;
    }, [ queryParams ]);

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={ 'Organization Statistics' } />
            </PageHeader>
            { preflightError && (
                <Main>
                    <EmptyState { ...preflightError } />
                </Main>
            ) }
            { !preflightError && (
                <React.Fragment>
                    <Main style={ { paddingBottom: '0' } }>
                        <Card>
                            <CardBody>
                                <FilterableToolbar
                                    categories={ options }
                                    filters={ queryParams }
                                    setFilters={ setFromToolbar }
                                />
                            </CardBody>
                        </Card>
                    </Main>
                    <Main>
                        <TopCard>
                            <CardTitle>
                                <h2>Organization Status</h2>
                            </CardTitle>
                            <CardBody>
                                { apiError && <ApiErrorState message={ apiError } /> }
                                { !apiError && isLoading && <LoadingState /> }
                                { !apiError && !isLoading && orgsChartData.length <= 0 && <NoData /> }
                                { !apiError && !isLoading && orgsChartData.length > 0 && (
                                    <GroupedBarChart
                                        margin={ { top: 20, right: 20, bottom: 50, left: 50 } }
                                        id="d3-grouped-bar-chart-root"
                                        data={ orgsChartData }
                                        history={ history }
                                        timeFrame={ orgsChartData.length }
                                        colorFunc={ colorFunc }
                                    />
                                ) }
                            </CardBody>
                        </TopCard>
                        <CardContainer>
                            <Card>
                                <CardBody style={ { padding: 0 } }>
                                    <CardTitle style={ { padding: 0 } }>
                                        <h2 style={ { marginLeft: '20px' } }>
                                      Job Runs by Organization
                                        </h2>
                                    </CardTitle>
                                    { apiError && <ApiErrorState message={ apiError } /> }
                                    { !apiError && isLoading && <LoadingState /> }
                                    { !apiError && !isLoading && pieChart1Data.length <= 0 && <NoData /> }
                                    { !apiError && !isLoading && pieChart1Data.length > 0 && (
                                        <PieChart
                                            margin={ { top: 20, right: 20, bottom: 0, left: 20 } }
                                            id="d3-donut-1-chart-root"
                                            data={ pieChart1Data }
                                            timeFrame={ pieChart1Data.length }
                                            colorFunc={ colorFunc }
                                        />
                                    ) }
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody style={ { padding: 0 } }>
                                    <CardTitle style={ { padding: 0 } }>
                                        <h2 style={ { marginLeft: '20px' } }>
                                      Usage by Organization (Tasks)
                                        </h2>
                                    </CardTitle>
                                    { apiError && <ApiErrorState message={ apiError } /> }
                                    { !apiError && isLoading && <LoadingState /> }
                                    { !apiError && !isLoading && pieChart2Data.length <= 0 && <NoData /> }
                                    { !apiError && !isLoading && pieChart2Data.length > 0 && (
                                        <PieChart
                                            margin={ { top: 20, right: 20, bottom: 0, left: 20 } }
                                            id="d3-donut-2-chart-root"
                                            data={ pieChart2Data }
                                            timeFrame={ pieChart2Data.length }
                                            colorFunc={ colorFunc }
                                        />
                                    ) }
                                </CardBody>
                            </Card>
                        </CardContainer>
                    </Main>
                </React.Fragment>
            ) }
        </React.Fragment>
    );
};

export default OrganizationStatistics;
