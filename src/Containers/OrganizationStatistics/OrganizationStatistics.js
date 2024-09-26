import { Alert } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { AlertVariant } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { AlertActionLink } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import { Tabs } from '@patternfly/react-core/dist/dynamic/components/Tabs';
import { Tab } from '@patternfly/react-core/dist/dynamic/components/Tabs';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { GridItem } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { scaleOrdinal } from 'd3';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { readHostExplorer, readJobExplorer, readOrgOptions } from '../../Api/';
import {
  GroupedBarChart,
  HostsTooltip,
  OrgsTooltip,
} from '../../Charts/GroupedBarChart/';
import PieChart from '../../Charts/PieChart';
// For chart colors
import { pfmulti } from '../../Charts/Utilities/colors';
import ApiErrorState from '../../Components/ApiStatus/ApiErrorState';
import LoadingState from '../../Components/ApiStatus/LoadingState';
import NoData from '../../Components/ApiStatus/NoData';
import FilterableToolbar from '../../Components/Toolbar/';
import {
  DEFAULT_NAMESPACE,
  createUrl,
  useQueryParams,
} from '../../QueryParams/';
import {
  organizationStatistics as constants,
  jobExplorer,
} from '../../Utilities/constants';
import { formatDate as dateForJobExplorer } from '../../Utilities/helpers';
import useRequest from '../../Utilities/useRequest';
import { PageHeader } from '../../framework/PageHeader';
import { Paths } from '../../paths';
import reportPaths from '../Reports/paths';

const Divider = styled('hr')`
  border: 1px solid #ebebeb;
`;

const colorFunc = scaleOrdinal(pfmulti);

const orgsChartMapper = (data = [], meta, attrName) => {
  const dates = data.map(({ date, items }) => ({
    date,
    items: items.map(({ id, [attrName]: value, name }) => ({
      id,
      date,
      value,
      name: name || 'No organization',
    })),
  }));
  meta.legend.map((el) => ({
    ...el,
    name: el.name || 'No organization',
  }));
  return dates;
};

const pieChartMapper = (items = [], attrName) => {
  const data = items.map(({ id, [attrName]: count, name }) => ({
    id,
    count,
    name: name || 'No organization',
  }));
  return data;
};

const navigateToJobExplorer =
  (queryParams) =>
  ({ date, id }) => {
    const navigate = useNavigate();
    if (id === -1) {
      // disable clicking on "others" block
      return;
    }

    const { sort_options, sort_order, ...rest } = queryParams;
    const formattedDate = dateForJobExplorer(date);
    const initialQueryParams = {
      [DEFAULT_NAMESPACE]: {
        ...jobExplorer.defaultParams,
        ...rest,
        quick_date_range: 'custom',
        start_date: formattedDate,
        end_date: formattedDate,
        status: [],
        org_id: [id],
      },
    };

    navigate(createUrl(Paths.jobExplorer.replace('/', ''), initialQueryParams));
  };

const chartMapper = [
  {
    api: readJobExplorer,
    attr: 'total_count',
    label: 'Jobs across organizations',
    onClick: navigateToJobExplorer,
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

const OrganizationStatistics = () => {
  const [activeTabKey, setActiveTabKey] = useState(0);

  // params from toolbar/searchbar
  const { queryParams, setFromToolbar } = useQueryParams(
    constants.defaultParams
  );

  const jobEventsByOrgParams = {
    ...queryParams,
    attributes: ['host_task_count'],
    group_by: 'org',
    include_others: true,
    sort_options: 'host_task_count',
    sort_order: 'desc',
  };

  const jobRunsByOrgParams = {
    ...queryParams,
    attributes: ['total_count'],
    group_by: 'org',
    include_others: true,
    sort_options: 'total_count',
    sort_order: 'desc',
  };

  const jobsByDateAndOrgParams = {
    ...queryParams,
    attributes: ['total_count'],
    group_by: 'org',
    group_by_time: true,
    sort_options: 'total_count',
    sort_order: 'desc',
  };

  const hostAcrossOrgParams = {
    ...queryParams,
    attributes: ['total_unique_host_count'],
    group_by: 'org',
    group_by_time: true,
    sort_options: 'host_task_count',
    sort_order: 'desc',
  };

  const {
    result: jobs,
    error: jobsError,
    isLoading: jobsIsLoading,
    isSuccess: jobsIsSuccess,
    request: setJobs,
  } = useRequest(readJobExplorer, []);

  const { result: options, request: setOptions } = useRequest(
    readOrgOptions,
    {}
  );

  const {
    result: orgs,
    error: orgsError,
    isLoading: orgsIsLoading,
    isSuccess: orgsIsSuccess,
    request: setOrgs,
  } = useRequest(async (tabIndex = 0) => {
    if (tabIndex === 0) {
      return readJobExplorer(jobsByDateAndOrgParams);
    } else {
      return readHostExplorer(hostAcrossOrgParams);
    }
  }, []);

  const {
    result: tasks,
    error: tasksError,
    isLoading: tasksIsLoading,
    isSuccess: tasksIsSuccess,
    request: setTasks,
  } = useRequest(readJobExplorer, []);

  const handleTabClick = (_, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  useEffect(() => {
    setOrgs(activeTabKey);
  }, [activeTabKey]);

  useEffect(() => {
    setOrgs(activeTabKey);
    setTasks(jobEventsByOrgParams);
    setOptions(queryParams);
    setJobs(jobRunsByOrgParams);
  }, [queryParams]);

  const renderDeprecationWarning = () => (
    <Alert
      variant={AlertVariant.warning}
      title='The organization statistics page will be deprecated in a future release.'
      actionLinks={
        <>
          <AlertActionLink>
            <Link
              to={
                '../reports/' + reportPaths.getDetails('hosts_by_organization')
              }
            >
              Hosts by organization report
            </Link>
          </AlertActionLink>
          <AlertActionLink>
            <Link
              to={
                '../reports/' +
                reportPaths.getDetails('jobs_and_tasks_by_organization')
              }
            >
              Jobs/Tasks by organization report
            </Link>
          </AlertActionLink>
        </>
      }
    >
      The organization statistics page has been converted to a set of reports.
      Please use our new, more full-featured reports by following the links
      below.
    </Alert>
  );

  const renderContent = () => (
    <Grid hasGutter>
      <GridItem span={12}>{renderDeprecationWarning()}</GridItem>
      <GridItem span={12}>
        <Card>
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
            <Tab eventKey={0} title={'Jobs'} />
            <Tab eventKey={1} title={'Hosts'} />
          </Tabs>
          <CardBody>
            {orgsIsLoading && <LoadingState />}
            {orgsError && <ApiErrorState message={orgsError.error.error} />}
            {orgsIsSuccess && orgs.dates?.length <= 0 && <NoData />}
            {orgsIsSuccess && orgs.dates?.length > 0 && (
              <GroupedBarChart
                margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                id='d3-grouped-bar-chart-root'
                data={orgsChartMapper(
                  orgs.dates,
                  orgs.meta,
                  chartMapper[activeTabKey].attr
                )}
                legend={orgs.meta.legend}
                colorFunc={colorFunc}
                yLabel={chartMapper[activeTabKey].label}
                onClick={chartMapper[activeTabKey].onClick(queryParams)}
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
            {jobsIsLoading && <LoadingState />}
            {jobsError && <ApiErrorState message={jobsError.error.error} />}
            {jobsIsSuccess && jobs.items?.length <= 0 && <NoData />}
            {jobsIsSuccess && jobs.items?.length > 0 && (
              <PieChart
                margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
                id='d3-donut-1-chart-root'
                data={pieChartMapper(jobs.items, 'total_count')}
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
            {tasksIsLoading && <LoadingState />}
            {tasksError && <ApiErrorState message={tasksError.error.error} />}
            {tasksIsSuccess && tasks.items?.length <= 0 && <NoData />}
            {tasksIsSuccess && tasks.items?.length > 0 && (
              <PieChart
                margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
                id='d3-donut-2-chart-root'
                data={pieChartMapper(tasks.items, 'host_task_count')}
                colorFunc={colorFunc}
              />
            )}
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );

  return (
    <>
      <PageHeader title={'Organization Statistics'} />
      <FilterableToolbar
        categories={options}
        filters={queryParams}
        setFilters={setFromToolbar}
      />
      <PageSection>{renderContent()}</PageSection>
    </>
  );
};

export default OrganizationStatistics;
