import React, { useState, useEffect } from 'react';

import { useQueryParams } from '../../Utilities/useQueryParams';

import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import {
  preflightRequest,
  readClustersOptions,
  readJobExplorer,
  readEventExplorer,
} from '../../Api';

import { jobExplorer } from '../../Utilities/constants';
import useApi from '../../Utilities/useApi';

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
  CardTitle as PFCardTitle,
} from '@patternfly/react-core';

import BarChart from '../../Charts/BarChart';
import LineChart from '../../Charts/LineChart';
import ModulesList from '../../Components/ModulesList';
import TemplatesList from '../../Components/TemplatesList';
import FilterableToolbar from '../../Components/Toolbar';
import ApiErrorState from '../../Components/ApiErrorState';

import { clusters } from '../../Utilities/constants';

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

  const optionsMapper = (options) => {
    const { groupBy, attributes, ...rest } = options;
    return rest;
  };

  const { queryParams, setFromToolbar } = useQueryParams({
    ...clusters.defaultParams,
  });

  const [
    {
      isLoading,
      isSuccess,
      error,
      data: { items: chartData = [] },
    },
    setData,
  ] = useApi({ items: [] });

  const [
    {
      data: { items: templates = [] },
    },
    setTemplates,
  ] = useApi({ items: [] });
  const [
    {
      data: { items: workflows = [] },
    },
    setWorkflows,
  ] = useApi({ items: [] });
  const [
    {
      data: { items: modules = [] },
    },
    setModules,
  ] = useApi({ items: [] });
  const [{ data: options = [] }, setOptions] = useApi({}, optionsMapper);

  const initialOptionsParams = {
    attributes: jobExplorer.attributes,
  };

  const { queryParams: optionsQueryParams } = useQueryParams(
    initialOptionsParams
  );

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
      setOptions(readClustersOptions({ params: optionsQueryParams }));
    }

    initializeWithPreflight();
  }, []);

  // Get and update the data
  useEffect(() => {
    const fetchEndpoints = () => {
      setData(readJobExplorer({ params: queryParams }));
      setTemplates(readJobExplorer({ params: topTemplatesParams }));
      setWorkflows(readJobExplorer({ params: topWorkflowParams }));
      setModules(readEventExplorer({ params: topModuleParams }));
    };

    fetchEndpoints();
  }, [queryParams]);

  if (preflightError?.preflightError?.status === 403) {
    return <NotAuthorized {...notAuthorizedParams} />;
  }

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title={'Clusters'} />
        <FilterableToolbar
          categories={options}
          filters={queryParams}
          setFilters={setFromToolbar}
        />
      </PageHeader>
      {preflightError && (
        <Main>
          <EmptyState {...preflightError} />
        </Main>
      )}
      {error && (
        <Main>
          <ApiErrorState message={error.error} />
        </Main>
      )}
      {!preflightError && !error && (
        <>
          <Main>
            <Card>
              <PFCardTitle>
                <h2>Job status</h2>
              </PFCardTitle>
              <CardBody>
                {isLoading && <LoadingState />}
                {queryParams.cluster_id.length <= 0 && isSuccess && (
                  <BarChart
                    margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
                    id="d3-bar-chart-root"
                    data={chartData}
                    templateId={queryParams.template_id}
                    orgId={queryParams.org_id}
                  />
                )}
                {queryParams.cluster_id.length > 0 && isSuccess && (
                  <LineChart
                    margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
                    id="d3-line-chart-root"
                    data={chartData}
                    clusterId={queryParams.cluster_id}
                    templateId={queryParams.template_id}
                    orgId={queryParams.org_id}
                  />
                )}
              </CardBody>
            </Card>
            <div
              className="dataCard"
              style={{ display: 'flex', marginTop: '20px' }}
            >
              <TemplatesList
                qp={queryParams}
                templates={workflows}
                isLoading={isLoading}
                title={'Top workflows'}
                jobType={'workflowjob'}
              />
              <TemplatesList
                qp={queryParams}
                templates={templates}
                isLoading={isLoading}
                title={'Top templates'}
                jobType={'job'}
              />
              <ModulesList modules={modules} isLoading={isLoading} />
            </div>
          </Main>
        </>
      )}
    </React.Fragment>
  );
};

export default Clusters;
