import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { GridItem } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import React, { useEffect } from 'react';
import {
  readClustersOptions,
  readEventExplorer,
  readJobExplorer,
} from '../../Api/';
import BarChart from '../../Charts/BarChart';
import LineChart from '../../Charts/LineChart';
import ApiErrorState from '../../Components/ApiStatus/ApiErrorState';
import LoadingState from '../../Components/ApiStatus/LoadingState';
import FilterableToolbar from '../../Components/Toolbar';
import { useQueryParams } from '../../QueryParams/';
import { jobExplorer } from '../../Utilities/constants';
import { clusters } from '../../Utilities/constants';
import useRequest from '../../Utilities/useRequest';
import { PageHeader } from '../../framework/PageHeader';
import ModulesList from './ModulesList';
import TemplatesList from './TemplatesList';

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
  sort_options: 'host_task_count',
  sort_oder: 'desc',
  limit: 10,
};

const initialOptionsParams = {
  attributes: jobExplorer.attributes,
};

const Clusters = () => {
  // params from toolbar/searchbar
  const optionsQueryParams = useQueryParams(initialOptionsParams);
  const { queryParams, setFromToolbar } = useQueryParams(
    clusters.defaultParams,
  );
  const {
    result: options,
    error,
    request: fetchOptions,
  } = useRequest(readClustersOptions, {});

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

  const {
    result: { items: chartData },
    isLoading: chartDataIsLoading,
    isSuccess: chartDataIsSuccess,
    request: fetchChartData,
  } = useRequest(readJobExplorer, { items: [] });

  const {
    result: { items: modules },
    isLoading: modulesIsLoading,
    request: fetchModules,
  } = useRequest(readEventExplorer, { items: [] });

  const {
    result: { items: templates },
    isLoading: templatesIsLoading,
    request: fetchTemplates,
  } = useRequest(readJobExplorer, { items: [] });

  const {
    result: { items: workflows },
    isLoading: workflowsIsLoading,
    request: fetchWorkflows,
  } = useRequest(readJobExplorer, { items: [] });

  useEffect(() => {
    fetchOptions(optionsQueryParams);
    fetchChartData(queryParams);
    fetchModules(topModuleParams);
    fetchTemplates(topTemplatesParams);
    fetchWorkflows(topWorkflowParams);
  }, [queryParams]);

  if (error) return <ApiErrorState message={error.error.error} />;

  const renderContent = () => {
    // Warning: we are not checking if ALL the api succeed
    // this can cause an unsurfaced error when only some of them fails
    return (
      <Grid hasGutter>
        <GridItem span={12}>
          <Card>
            <CardTitle data-cy={'card-title-job-status'}>
              <h2>Job status</h2>
            </CardTitle>
            <CardBody>
              {chartDataIsLoading && <LoadingState />}
              {(!queryParams.cluster_id ||
                queryParams.cluster_id?.length <= 0) &&
                chartDataIsSuccess && (
                  <BarChart
                    margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
                    id='d3-bar-chart-root'
                    data={chartData}
                    queryParams={queryParams}
                  />
                )}
              {queryParams.cluster_id?.length > 0 && chartDataIsSuccess && (
                <LineChart
                  margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
                  id='d3-line-chart-root'
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
        <GridItem span={4} data-cy={'top-modules-header'}>
          <ModulesList modules={modules} isLoading={modulesIsLoading} />
        </GridItem>
      </Grid>
    );
  };

  return (
    <div data-cy={'header-clusters'}>
      <PageHeader data-cy={'header-clusters'} title={'Clusters'} />
      <FilterableToolbar
        categories={options}
        filters={queryParams}
        setFilters={setFromToolbar}
      />
      <PageSection>{renderContent()}</PageSection>
    </div>
  );
};

export default Clusters;
