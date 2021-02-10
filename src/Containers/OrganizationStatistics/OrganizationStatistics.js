import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useQueryParams } from '../../Utilities/useQueryParams';
import useApi from '../../Utilities/useApi';

import LoadingState from '../../Components/LoadingState';
import NoData from '../../Components/NoData';
import EmptyState from '../../Components/EmptyState';
import ApiErrorState from '../../Components/ApiErrorState';

import {
    preflightRequest,
    readJobsByDateAndOrg,
    readHostAcrossOrg,
    readJobRunsByOrg,
    readJobEventsByOrg,
    readOrgOptions
} from '../../Api';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
    Card,
    CardBody,
    CardTitle as PFCardTitle,
    Tabs,
    Tab
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

const optionsMapper = options => {
    const { meta, inventory_id, ...rest } = options;
    return { ...rest, sort_by: meta.sort_by };
};

const orgsChartMapper = attrName => ({ dates: data = []}) =>
    data.map(({ date, items }) => ({
        date,
        items: items.map(({ id, [attrName]: value, name }) => ({
            id,
            date,
            value,
            name: id === -1 ? 'Others' : (name || 'No organization')
        }))
    }));

const pieChartMapper = attrName => ({ items = []}) =>
    items.map(({ id, [attrName]: count, name }) => ({
        id,
        count,
        name: id === -1 ? 'Others' : name || 'No organization'
    }));

const chartMapper = [
    {
        api: readJobsByDateAndOrg,
        attr: 'total_count',
        label: 'Jobs across organizations'
    },
    {
        api: readHostAcrossOrg,
        attr: 'total_unique_host_count',
        label: 'Hosts across organizations'
    }
];

const OrganizationStatistics = ({ history }) => {
    const [ preflight, setPreflight ] = useApi(null);
    const [ activeTabKey, setActiveTabKey ] = useState(0);
    const [ orgs, setOrgs ] = useApi([], orgsChartMapper(chartMapper[activeTabKey].attr));
    const [ jobs, setJobs ] = useApi([], pieChartMapper('host_count'));
    const [ tasks, setTasks ] = useApi([], pieChartMapper('host_task_count'));
    const [ options, setOptions ] = useApi({}, optionsMapper);
    const { queryParams, setFromToolbar } = useQueryParams(
        constants.defaultParams
    );

    const handleTabClick = (_, tabIndex) => { setActiveTabKey(tabIndex); };

    useEffect(() => {
        insights.chrome.appNavClick({
            id: 'organization-statistics',
            secondaryNav: true
        });
        setPreflight(preflightRequest());
        setOptions(readOrgOptions({ params: queryParams }));
    }, []);

    useEffect(() => {
        setJobs(readJobRunsByOrg({ params: queryParams }));
        setTasks(readJobEventsByOrg({ params: queryParams }));
    }, [ queryParams ]);

    useEffect(() => {
        const apiPromise = chartMapper[activeTabKey].api;
        setOrgs(apiPromise({ params: queryParams }));
    }, [ queryParams, activeTabKey ]);

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={'Organization Statistics'} />
                <FilterableToolbar
                    categories={options.data}
                    filters={queryParams}
                    setFilters={setFromToolbar}
                />
            </PageHeader>
            {preflight.error && (
                <Main>
                    <EmptyState preflightError={preflight.error} />
                </Main>
            )}
            {preflight.isSuccess && (
                <React.Fragment>
                    <Main>
                        <TopCard>
                            <CardTitle>
                                <h2>Organization Status</h2>
                            </CardTitle>
                            <Tabs activeKey={ activeTabKey } onSelect={ handleTabClick }>
                                <Tab eventKey={ 0 } title={ 'Orgs' }/>
                                <Tab eventKey={ 1 } title={ 'Hosts' }/>
                            </Tabs>
                            <CardBody>
                                {orgs.isLoading && <LoadingState />}
                                {orgs.error && <ApiErrorState message={orgs.error.error} />}
                                {orgs.isSuccess && orgs.data.length <= 0 && <NoData />}
                                {orgs.isSuccess && orgs.data.length > 0 && (
                                    <GroupedBarChart
                                        margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                                        id="d3-grouped-bar-chart-root"
                                        data={ orgs.data }
                                        history={ history }
                                        timeFrame={ orgs.data .length }
                                        colorFunc={ colorFunc }
                                        yLabel={ chartMapper[activeTabKey].label }
                                    />
                                )}
                            </CardBody>
                        </TopCard>
                        <CardContainer>
                            <Card>
                                <CardBody style={{ padding: 0 }}>
                                    <CardTitle style={{ padding: 0 }}>
                                        <h2 style={{ marginLeft: '20px' }}>
                                            Job Runs by Organization
                                        </h2>
                                    </CardTitle>
                                    {jobs.isLoading && <LoadingState />}
                                    {jobs.error && <ApiErrorState message={jobs.error.error} />}
                                    {jobs.isSuccess && jobs.data.length <= 0 && <NoData />}
                                    {jobs.isSuccess && jobs.data.length > 0 && (
                                        <PieChart
                                            margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
                                            id="d3-donut-1-chart-root"
                                            data={jobs.data}
                                            timeFrame={jobs.data.length}
                                            colorFunc={colorFunc}
                                        />
                                    )}
                                </CardBody>
                            </Card>
                            <Card>
                                <CardBody style={{ padding: 0 }}>
                                    <CardTitle style={{ padding: 0 }}>
                                        <h2 style={{ marginLeft: '20px' }}>
                                            Usage by Organization (Tasks)
                                        </h2>
                                    </CardTitle>
                                    {tasks.isLoading && <LoadingState />}
                                    {tasks.error && <ApiErrorState message={tasks.error.error} />}
                                    {tasks.isSuccess && tasks.data.length <= 0 && <NoData />}
                                    {tasks.isSuccess && tasks.data.length > 0 && (
                                        <PieChart
                                            margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
                                            id="d3-donut-2-chart-root"
                                            data={tasks.data}
                                            timeFrame={tasks.data.length}
                                            colorFunc={colorFunc}
                                        />
                                    )}
                                </CardBody>
                            </Card>
                        </CardContainer>
                    </Main>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

OrganizationStatistics.propTypes = {
    history: PropTypes.object
};

export default OrganizationStatistics;
