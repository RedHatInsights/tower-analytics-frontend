import React, { useEffect, useCallback } from 'react';

import { useQueryParams } from '../../Utilities/useQueryParams';

import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import {
  preflightRequest,
  readClustersOptions,
  readJobExplorer,
  readEventExplorer,
} from '../../Api/';

import { jobExplorer } from '../../Utilities/constants';

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
  Grid,
  GridItem,
} from '@patternfly/react-core';

import BarChart from '../../Charts/BarChart';
import LineChart from '../../Charts/LineChart';
import ModulesList from '../../Components/ModulesList';
import TemplatesList from '../../Components/TemplatesList';
import FilterableToolbar from '../../Components/Toolbar';
import ApiErrorState from '../../Components/ApiErrorState';

import { clusters } from '../../Utilities/constants';
import useRequest from '../../Utilities/useRequest';
import { getQSConfig } from '../../Utilities/qs';

const initialTopTemplateParams = {
  group_by: 'template',
  limit: 10,
  job_type: ['job'],
  group_by_time: false,
  status: ['successful', 'failed'],
};

const initialTopWorkflowParams = {
  group_by: 'template',
  limit: 10,
  job_type: ['workflowjob'],
  group_by_time: false,
  status: ['successful', 'failed'],
};

const initialModuleParams = {
  group_by: 'module',
  sort_by: 'host_task_count:desc',
  limit: 10,
};

// takes json and returns
const qsConfig = getQSConfig('clusters', { ...clusters.defaultParams }, [
  'limit',
  'offset',
]);

const Clusters = () => {
  const { error: preflightError, request: setPreflight } = useRequest(
    useCallback(() => preflightRequest(), [])
  );

  // params from toolbar/searchbar
  const { queryParams, setFromToolbar } = useQueryParams(qsConfig);
  const {
    result: options,
    error,
    request: fetchOptions,
  } = useRequest(
    useCallback(() => readClustersOptions(optionsQueryParams), [queryParams]),
    {}
  );

  const {
    result: chartData,
    isLoading: chartDataIsLoading,
    isSuccess: chartDataIsSuccess,
    request: fetchChartData,
  } = useRequest(
    useCallback(async () => {
      const chartData = await readJobExplorer(queryParams);
      return chartData.items;
    }, [queryParams]),
    []
  );

  const {
    result: modules,
    isLoading: modulesIsLoading,
    request: fetchModules,
  } = useRequest(
    useCallback(async () => {
      const modules = await readEventExplorer(topModuleParams);
      return modules.items;
    }, [queryParams]),
    []
  );

  const {
    result: templates,
    isLoading: templatesIsLoading,
    request: fetchTemplates,
  } = useRequest(
    useCallback(async () => {
      const templates = await readJobExplorer(topTemplatesParams);
      return templates.items;
    }, [queryParams]),
    []
  );

  const {
    result: workflows,
    isLoading: workflowsIsLoading,
    request: fetchWorkflows,
  } = useRequest(
    useCallback(async () => {
      const workflows = await readJobExplorer(topWorkflowParams);
      return workflows.items;
    }, [queryParams]),
    []
  );

  const initialOptionsParams = {
    attributes: jobExplorer.attributes,
  };

  const optionsQueryParams = useQueryParams(initialOptionsParams);

  useEffect(() => {
    setPreflight();
    fetchOptions();
    fetchChartData();
    fetchModules();
    fetchTemplates();
    fetchWorkflows();
  }, [queryParams]);

  const {
    cluster_id,
    org_id,
    template_id,
    quick_date_range,
    start_date,
    end_date,
  } = queryParams;

  const topTemplatesParams = {
    cluster_id,
    org_id,
    template_id,
    quick_date_range,
    start_date,
    end_date,
    ...initialTopTemplateParams,
  };

  const topWorkflowParams = {
    cluster_id,
    org_id,
    template_id,
    quick_date_range,
    start_date,
    end_date,
    ...initialTopWorkflowParams,
  };

  const topModuleParams = {
    cluster_id,
    org_id,
    template_id,
    quick_date_range,
    start_date,
    end_date,
    ...initialModuleParams,
  };

  if (preflightError?.status === 403) {
    return <NotAuthorized {...notAuthorizedParams} />;
  }

  if (preflightError) return <EmptyState preflightError={preflightError} />;

  if (error) return <ApiErrorState message={error.error} />;

  const renderContent = () => {
    // Warning: we are not checking if ALL the api succeed
    // this can cause an unsurfaced error when only some of them fails
    return (
      <Grid hasGutter>
        <GridItem span={12}>
          <Card>
            <CardTitle>
              <h2>Job status</h2>
            </CardTitle>
            <CardBody>
              {chartDataIsLoading && <LoadingState />}
              {(!queryParams.cluster_id ||
                queryParams.cluster_id?.length <= 0) &&
                chartDataIsSuccess && (
                  <BarChart
                    margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
                    id="d3-bar-chart-root"
                    data={chartData}
                    queryParams={queryParams}
                  />
                )}
              {queryParams.cluster_id?.length > 0 && chartDataIsSuccess && (
                <LineChart
                  margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
                  id="d3-line-chart-root"
                  data={chartData}
                  queryParams={queryParams}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={4}>
          <TemplatesList
            qp={queryParams}
            templates={workflows}
            isLoading={workflowsIsLoading}
            title={'Top workflows'}
            jobType={'workflowjob'}
          />
        </GridItem>
        <GridItem span={4}>
          <TemplatesList
            qp={queryParams}
            templates={templates}
            isLoading={templatesIsLoading}
            title={'Top templates'}
            jobType={'job'}
          />
        </GridItem>
        <GridItem span={4}>
          <ModulesList modules={modules} isLoading={modulesIsLoading} />
        </GridItem>
      </Grid>
    );
  };

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title={'Clusters'} />
        <FilterableToolbar
          categories={options}
          qsConfig={qsConfig}
          filters={queryParams}
          setFilters={setFromToolbar}
        />
      </PageHeader>
      <Main>{renderContent()}</Main>
    </>
  );
};

export default Clusters;
