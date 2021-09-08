import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { useQueryParams } from '../../Utilities/useQueryParams';
import useApi from '../../Utilities/useApi';
import useRedirect from '../../Utilities/useRedirect';
import { formatDate as dateForJobExplorer } from '../../Utilities/helpers';

import LoadingState from '../../Components/LoadingState';
import NoData from '../../Components/NoData';
import EmptyState from '../../Components/EmptyState';
import ApiErrorState from '../../Components/ApiErrorState';

import {
  preflightRequest,
  readJobExplorer,
  readHostExplorer,
  readOrgOptions,
} from '../../Api/';

import Main from '@redhat-cloud-services/frontend-components/Main';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { notAuthorizedParams } from '../../Utilities/constants';

import {
  Card,
  CardBody,
  CardTitle,
  Tabs,
  Tab,
  Grid,
  GridItem,
} from '@patternfly/react-core';

import {
  GroupedBarChart,
  OrgsTooltip,
  HostsTooltip,
} from '../../Charts/GroupedBarChart/';
import PieChart from '../../Charts/PieChart';
import FilterableToolbar from '../../Components/Toolbar/';
import { organizationStatistics as constants } from '../../Utilities/constants';

// For chart colors
import { pfmulti } from '../../Utilities/colors';
import { scaleOrdinal } from 'd3';

const Divider = styled('hr')`
  border: 1px solid #ebebeb;
`;

const colorFunc = scaleOrdinal(pfmulti);

const orgsChartMapper =
  (attrName) =>
  ({ dates: data = [], meta }) => ({
    data: data.map(({ date, items }) => ({
      date,
      items: items.map(({ id, [attrName]: value, name }) => ({
        id,
        date,
        value,
        name: name || 'No organization',
      })),
    })),
    legend: meta.legend.map((el) => ({
      ...el,
      name: el.name || 'No organization',
    })),
  });

const pieChartMapper =
  (attrName) =>
  ({ items = [] }) =>
    items.map(({ id, [attrName]: count, name }) => ({
      id,
      count,
      name: name || 'No organization',
    }));

const redirectToJobExplorer =
  (toJobExplorer, queryParams) =>
  ({ date, id }) => {
    if (id === -1) {
      // disable clicking on "others" block
      return;
    }

    const { sort_by, ...rest } = queryParams;
    const formattedDate = dateForJobExplorer(date);
    const initialQueryParams = {
      ...rest,
      quick_date_range: 'custom',
      start_date: formattedDate,
      end_date: formattedDate,
      status: [
        'successful',
        'failed',
        'new',
        'pending',
        'waiting',
        'error',
        'canceled',
        'running',
      ],
      org_id: [id],
    };

    toJobExplorer(initialQueryParams);
  };

const chartMapper = [
  {
    api: readJobExplorer,
    attr: 'total_count',
    label: 'Jobs across organizations',
    onClick: redirectToJobExplorer,
    tooltip: OrgsTooltip,
  },
  {
    api: readHostExplorer,
    attr: 'total_unique_host_count',
    label: 'Hosts across organizations',
    onClick: () => null,
    tooltip: HostsTooltip,
  },
];

const OrganizationStatistics = ({ history }) => {
  const toJobExplorer = useRedirect(history, 'jobExplorer');
  const [preflight, setPreflight] = useApi(null);
  const [activeTabKey, setActiveTabKey] = useState(0);
  const [orgs, setOrgs] = useApi(
    [],
    orgsChartMapper(chartMapper[activeTabKey].attr)
  );
  const [jobs, setJobs] = useApi([], pieChartMapper('total_count'));
  const [tasks, setTasks] = useApi([], pieChartMapper('host_task_count'));
  const [options, setOptions] = useApi({});
  const { queryParams, setFromToolbar } = useQueryParams(
    constants.defaultParams
  );

  const jobEventsByOrgParams = {
    ...queryParams,
    attributes: ['host_task_count'],
    group_by: 'org',
    include_others: true,
    sort_by: `host_task_count:desc`,
  };

  const jobRunsByOrgParams = {
    ...queryParams,
    attributes: ['total_count'],
    group_by: 'org',
    include_others: true,
    sort_by: `total_count:desc`,
  };

  const jobsByDateAndOrgParams = {
    ...queryParams,
    attributes: ['total_count'],
    group_by: 'org',
    group_by_time: true,
    sort_by: `total_count:desc`,
  };

  const hostAcrossOrgParams = {
    ...queryParams,
    attributes: ['total_unique_host_count'],
    group_by: 'org',
    group_by_time: true,
    sort_by: `host_task_count:desc`,
  };

  const handleTabClick = (_, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  useEffect(() => {
    insights.chrome.appNavClick({
      id: 'organization-statistics',
      secondaryNav: true,
    });
    setPreflight(preflightRequest());
    setOptions(readOrgOptions({ params: queryParams }));
  }, []);

  useEffect(() => {
    const { api: readJobsOrHosts } = chartMapper[activeTabKey];
    const params =
      activeTabKey === 0 ? jobsByDateAndOrgParams : hostAcrossOrgParams;
    setOrgs(readJobsOrHosts({ params }));
  }, [queryParams, activeTabKey]);

  useEffect(() => {
    setJobs(readJobExplorer({ params: jobRunsByOrgParams }));
    setTasks(readJobExplorer({ params: jobEventsByOrgParams }));
  }, [queryParams]);

  if (preflight?.error?.status === 403) {
    return <NotAuthorized {...notAuthorizedParams} />;
  }

  const renderContent = () => {
    if (preflight.error) return <EmptyState preflightError={preflight.error} />;

    if (preflight.isSuccess)
      return (
        <Grid hasGutter>
          <GridItem span={12}>
            <Card>
              <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
                <Tab eventKey={0} title={'Jobs'} />
                <Tab eventKey={1} title={'Hosts'} />
              </Tabs>
              <CardBody>
                {orgs.isLoading && <LoadingState />}
                {orgs.error && <ApiErrorState message={orgs.error.error} />}
                {orgs.isSuccess && orgs.data?.data.length <= 0 && <NoData />}
                {orgs.isSuccess && orgs.data?.data.length > 0 && (
                  <GroupedBarChart
                    margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                    id="d3-grouped-bar-chart-root"
                    data={orgs.data.data}
                    legend={orgs.data.legend}
                    history={history}
                    colorFunc={colorFunc}
                    yLabel={chartMapper[activeTabKey].label}
                    onClick={chartMapper[activeTabKey].onClick(
                      toJobExplorer,
                      queryParams
                    )}
                    TooltipClass={chartMapper[activeTabKey].tooltip}
                  />
                )}
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={6}>
            <Card>
              <CardTitle>
                <h2>Job Runs by Organization</h2>
              </CardTitle>
              <Divider />
              <CardBody>
                {jobs.isLoading && <LoadingState />}
                {jobs.error && <ApiErrorState message={jobs.error.error} />}
                {jobs.isSuccess && jobs.data.length <= 0 && <NoData />}
                {jobs.isSuccess && jobs.data.length > 0 && (
                  <PieChart
                    margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
                    id="d3-donut-1-chart-root"
                    data={jobs.data}
                    colorFunc={colorFunc}
                  />
                )}
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={6}>
            <Card>
              <CardTitle>
                <h2>Usage by Organization (Tasks)</h2>
              </CardTitle>
              <Divider />
              <CardBody>
                {tasks.isLoading && <LoadingState />}
                {tasks.error && <ApiErrorState message={tasks.error.error} />}
                {tasks.isSuccess && tasks.data.length <= 0 && <NoData />}
                {tasks.isSuccess && tasks.data.length > 0 && (
                  <PieChart
                    margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
                    id="d3-donut-2-chart-root"
                    data={tasks.data}
                    colorFunc={colorFunc}
                  />
                )}
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      );

    return '';
  };

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title={'Organization Statistics'} />
        <FilterableToolbar
          categories={options.data}
          filters={queryParams}
          setFilters={setFromToolbar}
        />
      </PageHeader>
      <Main>{renderContent()}</Main>
    </>
  );
};

OrganizationStatistics.propTypes = {
  history: PropTypes.object,
};

export default OrganizationStatistics;
