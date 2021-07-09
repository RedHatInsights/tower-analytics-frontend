import React, {useState, useEffect, useCallback} from 'react';

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
import useRequest from "../../Utilities/useRequest";

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

const Clusters = () => {
  const [preflightError, setPreFlightError] = useState(null);

  const { queryParams, setFromToolbar } = useQueryParams({
    ...clusters.defaultParams,
  });

  const {
    result: {
      chartData,
      modules,
      options,
      templates,
      workflows
    },
    error,
    isLoading,
    request: fetchEndpoints,
  } = useRequest(
    useCallback(async () => {
      const [chartData, modules, options, templates, workflows] = await Promise.all([
        readJobExplorer({ params: queryParams }),
        readEventExplorer({ params: topModuleParams }),
        readClustersOptions({ params: optionsQueryParams }),
        readJobExplorer({ params: topTemplatesParams }),
        readJobExplorer({ params: topWorkflowParams })
      ]);
      return {
        chartData: chartData.items,
        modules: modules.items,
        options: options,
        templates: templates.items,
        workflows: workflows.items
      };
    }, []),
    {
      chartData: [], modules: [], options: {}, templates: [], workflows: []
    }
  );

  const initialOptionsParams = {
    attributes: jobExplorer.attributes,
  };

  const { queryParams: optionsQueryParams } =
    useQueryParams(initialOptionsParams);

    // Get and update the data
  useEffect(() => {
    fetchEndpoints();
  }, [queryParams, fetchEndpoints]);

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

  useEffect(() => {
    async function initializeWithPreflight() {
      await preflightRequest().catch((error) => {
        setPreFlightError({ preflightError: error });
      });
    }

    initializeWithPreflight();
  }, []);

  if (preflightError?.preflightError?.status === 403) {
    return <NotAuthorized {...notAuthorizedParams} />;
  }

  const isSuccess = !error && !isLoading && options

  const renderContent = () => {
    if (preflightError) return <EmptyState {...preflightError} />;

    if (error) return <ApiErrorState message={error.error} />;

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
              {isLoading && <LoadingState />}
              {queryParams.cluster_id.length <= 0 && isSuccess && (
                <BarChart
                  margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
                  id="d3-bar-chart-root"
                  data={chartData}
                  queryParams={queryParams}
                />
              )}
              {queryParams.cluster_id.length > 0 && isSuccess && (
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
            isLoading={isLoading}
            title={'Top workflows'}
            jobType={'workflowjob'}
          />
        </GridItem>
        <GridItem span={4}>
          <TemplatesList
            qp={queryParams}
            templates={templates}
            isLoading={isLoading}
            title={'Top templates'}
            jobType={'job'}
          />
        </GridItem>
        <GridItem span={4}>
          <ModulesList modules={modules} isLoading={isLoading} />
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
          filters={queryParams}
          setFilters={setFromToolbar}
        />
      </PageHeader>
      <Main>{renderContent()}</Main>
    </>
  );
};

export default Clusters;
