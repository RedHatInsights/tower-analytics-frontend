import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {useLocation} from 'react-router-dom';

import { useQueryParams } from '../../Utilities/useQueryParams';
import useRedirect from '../../Utilities/useRedirect';
import {formatDate as dateForJobExplorer, qsToObject, qsToString} from '../../Utilities/helpers';

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
import {notAuthorizedParams} from '../../Utilities/constants';

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
import useRequest from "../../Utilities/useRequest";

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
    }))
    meta.legend.map((el) => ({
      ...el,
      name: el.name || 'No organization',
    }))
    return dates;
  };

const pieChartMapper = (items = [], attrName) => {
  const data = items.map(({id, [attrName]: count, name}) => ({
    id,
    count,
    name: name || 'No organization',
  }))
  return data;
}

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
  const [activeTabKey, setActiveTabKey] = useState(0);

  const location = useLocation();
  const { pathname } = useLocation();

  // params from toolbar/searchbar
  const query = location.search !== '' ? qsToObject(location.search) : constants.defaultParams
  const { queryParams, setFromToolbar } = useQueryParams(query);

  // params from url/querystring
  const [urlstring, setUrlstring] = useState(queryParams)

  const {
    result: { preflight },
    error: preflightError,
    isLoading: preflightIsLoading,
    request: setPreflight,
  } = useRequest(
    useCallback(async () => {
      const preflight = await preflightRequest()
      return { preflight: preflight };
    }, []),
    { preflight: {}, preflightError, preflightIsLoading }
  );

  const {
    result: { jobs },
    error: jobsError,
    isLoading: jobsIsLoading,
    request: setJobs,
  } = useRequest(
    useCallback(async () => {
      const jobs = await readJobExplorer({ params: jobRunsByOrgParams })
      return { jobs: jobs };
    }, [location]),
    { jobs: [], jobsError,  jobsIsLoading }
  );

  const {
    result: { orgs },
    error: orgsError,
    isLoading: orgsIsLoading,
    request: setOrgs,
  } = useRequest(
    useCallback(async (tabIndex = 0) => {
      let orgs;
      if(tabIndex === 0) {
        orgs = await readJobExplorer({ params: jobsByDateAndOrgParams })
      } else {
        orgs = await readHostExplorer({ params: hostAcrossOrgParams })
      }
      return { orgs: orgs };
    }, [location]),
    { orgs: [], orgsError,  orgsIsLoading }
  );

  const {
    result: { options },
    error: optionsError,
    isLoading: optionsIsLoading,
    request: setOptions,
  } = useRequest(
    useCallback(async () => {
      const options = await readOrgOptions({ params: queryParams })
      return { options: options };
    }, [location]),
    { options: {}, optionsError, optionsIsLoading }
  );

  const {
    result: {
      tasks
    },
    error: tasksError,
    isLoading: tasksIsLoading,
    request: setTasks,
  } = useRequest(
    useCallback(async () => {
      const tasks = await readJobExplorer({ params: jobEventsByOrgParams });
      return {
        tasks: tasks }
    }, [location]),
    { tasks: [], tasksError, tasksIsLoading }
  );

  useEffect(() => {
    setOrgs(activeTabKey);

    const search = qsToString(queryParams);
    setUrlstring(search)
    history.push(`${pathname}?${search}`)
  }, [queryParams, activeTabKey, urlstring]);

  useEffect(() => {
    setTasks()
    setOptions()
    setJobs()

    const search = qsToString(queryParams);
    setUrlstring(search)
    history.push(`${pathname}?${search}`)
  }, [queryParams, urlstring]);

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
    setPreflight();
  }, []);

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
                {orgsIsLoading && <LoadingState />}
                {orgsError && <ApiErrorState message={orgsError.error} />}
                {orgs?.dates?.length <= 0 && <NoData />}
                {orgs?.dates?.length > 0 && (
                  <GroupedBarChart
                    margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                    id="d3-grouped-bar-chart-root"
                    data={orgsChartMapper(orgs.dates, orgs.meta, chartMapper[activeTabKey].attr)}
                    legend={orgs.meta.legend}
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
                {jobsIsLoading && <LoadingState />}
                {jobsError && <ApiErrorState message={jobs.error.error} />}
                {jobs?.items?.length <= 0 && <NoData />}
                {jobs?.items?.length > 0 && (
                  <PieChart
                    margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
                    id="d3-donut-1-chart-root"
                    data={jobs?.data}
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
                {tasksError && <ApiErrorState message={tasks.error.error} />}
                {tasks?.items?.length <= 0 && <NoData />}
                {tasks?.items?.length > 0 && (
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
