import React, { useState, useEffect } from 'react';

import { useQueryParams } from '../../Utilities/useQueryParams';

import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import {
    preflightRequest,
    readClustersOptions,
    readJobExplorer,
    readEventExplorer
} from '../../Api';

import { jobExplorer } from '../../Utilities/constants';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
    Card,
    CardBody,
    CardTitle as PFCardTitle
} from '@patternfly/react-core';

import BarChart from '../../Charts/BarChart';
import LineChart from '../../Charts/LineChart';
import ModulesList from '../../Components/ModulesList';
import TemplatesList from '../../Components/TemplatesList';
import FilterableToolbar from '../../Components/Toolbar';
import ApiErrorState from '../../Components/ApiErrorState';

import { clusters } from '../../Utilities/constants';

const initialTopTemplateParams = {
    groupBy: 'template',
    limit: 10,
    jobType: [ 'job' ],
    groupByTime: false,
    status: [ 'successful', 'failed' ]
};

const initialTopWorkflowParams = {
    groupBy: 'template',
    limit: 10,
    jobType: [ 'workflowjob' ],
    groupByTime: false,
    status: [ 'successful', 'failed' ]
};

const initialModuleParams = {
    groupBy: 'module',
    sortBy: 'host_task_count:desc',
    limit: 10
};

const Clusters = ({ history }) => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ apiError, setApiError ] = useState(null);
    const [ barChartData, setBarChartData ] = useState([]);
    const [ lineChartData, setLineChartData ] = useState([]);
    const [ templatesData, setTemplatesData ] = useState([]);
    const [ workflowData, setWorkflowsData ] = useState([]);
    const [ modulesData, setModulesData ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);

    const [ orgIds, setOrgIds ] = useState([]);
    const [ clusterIds, setClusterIds ] = useState([]);
    const [ templateIds, setTemplateIds ] = useState([]);
    const [ sortBy, setSortBy ] = useState(null);
    const [ jobTypes, setJobTypes ] = useState([]);
    const [ quickDateRanges, setQuickDateRanges ] = useState([]);
    const {
        queryParams,
        urlMappedQueryParams,
        setFromToolbar
    } = useQueryParams({ ...clusters.defaultParams });

    const initialOptionsParams = {
        attributes: jobExplorer.attributes
    };

    const { queryParams: optionsQueryParams } = useQueryParams(
        initialOptionsParams
    );

    const { clusterId, orgId, templateId, quickDateRange } = queryParams;

    const topTemplatesParams = {
        clusterId,
        orgId,
        templateId,
        quickDateRange,
        ...initialTopTemplateParams
    };

    const topWorkflowParams = {
        clusterId,
        orgId,
        templateId,
        quickDateRange,
        ...initialTopWorkflowParams
    };

    const topModuleParams = {
        clusterId,
        orgId,
        templateId,
        quickDateRange,
        ...initialModuleParams
    };

    useEffect(() => {
        let ignore = false;

        async function initializeWithPreflight() {
            await window.insights.chrome.auth.getUser();
            await preflightRequest().catch(error => {
                setPreFlightError({ preflightError: error });
            });
            readClustersOptions({ params: optionsQueryParams }).then(
                ({
                    cluster_id,
                    org_id,
                    job_type,
                    template_id,
                    quick_date_range,
                    sort_by
                }) => {
                    if (!ignore) {
                        setClusterIds(cluster_id);
                        setOrgIds(org_id);
                        setTemplateIds(template_id);
                        setSortBy(sort_by);
                        setJobTypes(job_type);
                        setQuickDateRanges(quick_date_range);
                    }
                })
            .catch(e => setApiError(e.error));
        }

        initializeWithPreflight();

        return () => (ignore = true);
    }, []);

    // Get and update the data
    useEffect(() => {
        let ignore = false;

        const fetchEndpoints = async () => {
            await window.insights.chrome.auth.getUser();
            readJobExplorer({ params: urlMappedQueryParams(queryParams) })
            .then(({ items: chartData }) => {
                queryParams.clusterId.length > 0 ? setLineChartData(chartData) : setBarChartData(chartData);
            })
            .catch(e => setApiError(e.error));

            readJobExplorer({ params: urlMappedQueryParams(topTemplatesParams) })
            .then(({ items: templatesData }) => {
                setTemplatesData(templatesData);
            })
            .catch(e => setApiError(e.error));

            readJobExplorer({ params: urlMappedQueryParams(topWorkflowParams) })
            .then(({ items: workflowData }) => {
                setWorkflowsData(workflowData);
            })
            .catch(e => setApiError(e.error));

            readEventExplorer({ params: urlMappedQueryParams(topModuleParams) }).then(({ items: modulesData }) => {
                setModulesData(modulesData);
            })
            .catch(e => setApiError(e.error));
        };

        const update = async () => {
            if (!ignore) {
                setIsLoading(true);
                await fetchEndpoints();
                setIsLoading(false);
            }
        };

        update();
        return () => (ignore = true);
    }, [ queryParams ]);

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={ 'Clusters' } />
                <FilterableToolbar
                    categories={ {
                        jobType: jobTypes,
                        orgId: orgIds,
                        clusterId: clusterIds,
                        templateId: templateIds,
                        quickDateRange: quickDateRanges,
                        sortBy
                    } }
                    filters={ queryParams }
                    setFilters={ setFromToolbar }
                />
            </PageHeader>
            { preflightError && (
                <Main>
                    <EmptyState { ...preflightError } />
                </Main>
            ) }
            { apiError && (
                <Main>
                    <ApiErrorState message={ apiError } />
                </Main>
            ) }
            { !preflightError && !apiError && (
        <>
          <Main>
              <Card>
                  <PFCardTitle>
                      <h2>Job status</h2>
                  </PFCardTitle>
                  <CardBody>
                      { isLoading && !preflightError && <LoadingState /> }
                      { queryParams.clusterId.length <= 0 &&
                                    !isLoading && !apiError && (
                          <BarChart
                              margin={ { top: 20, right: 20, bottom: 50, left: 70 } }
                              id="d3-bar-chart-root"
                              data={ barChartData }
                              templateId={ queryParams.templateId }
                              orgId={ queryParams.orgId }
                          />
                      ) }
                      { queryParams.clusterId.length > 0  &&
                                    !isLoading && !apiError && (
                          <LineChart
                              margin={ { top: 20, right: 20, bottom: 50, left: 70 } }
                              id="d3-line-chart-root"
                              data={ lineChartData }
                              clusterId={ queryParams.clusterId }
                              templateId={ queryParams.templateId }
                              orgId={ queryParams.orgId }
                          />
                      ) }
                  </CardBody>
              </Card>
              <div
                  className="dataCard"
                  style={ { display: 'flex', marginTop: '20px' } }
              >
                  <TemplatesList
                      history={ history }
                      queryParams={ queryParams }
                      qp={ urlMappedQueryParams(queryParams) }
                      clusterId={ queryParams.cluster_id }
                      templates={ workflowData }
                      isLoading={ isLoading }
                      title={ 'Top workflows' }
                      jobType={ 'workflowjob' }
                  />
                  <TemplatesList
                      history={ history }
                      queryParams={ queryParams }
                      qp={ urlMappedQueryParams(queryParams) }
                      clusterId={ queryParams.cluster_id }
                      templates={ templatesData }
                      isLoading={ isLoading }
                      title={ 'Top templates' }
                      jobType={ 'job' }
                  />
                  <ModulesList
                      modules={ modulesData }
                      isLoading={ isLoading }
                  />
              </div>
          </Main>
        </>
            ) }
        </React.Fragment>
    );
};

export default Clusters;
