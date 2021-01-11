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
    group_by: 'template',
    limit: 10,
    job_type: [ 'job' ],
    group_by_time: false,
    status: [ 'successful', 'failed' ]
};

const initialTopWorkflowParams = {
    group_by: 'template',
    limit: 10,
    job_type: [ 'workflowjob' ],
    group_by_time: false,
    status: [ 'successful', 'failed' ]
};

const initialModuleParams = {
    group_by: 'module',
    sort_by: 'host_task_count:desc',
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
        setFromToolbar
    } = useQueryParams({ ...clusters.defaultParams });

    const initialOptionsParams = {
        attributes: jobExplorer.attributes
    };

    const { queryParams: optionsQueryParams } = useQueryParams(
        initialOptionsParams
    );

    const { cluster_id, org_id, template_id, quick_date_range } = queryParams;

    const topTemplatesParams = {
        cluster_id,
        org_id,
        template_id,
        quick_date_range,
        ...initialTopTemplateParams
    };

    const topWorkflowParams = {
        cluster_id,
        org_id,
        template_id,
        quick_date_range,
        ...initialTopWorkflowParams
    };

    const topModuleParams = {
        cluster_id,
        org_id,
        template_id,
        quick_date_range,
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
            readJobExplorer({ params: queryParams })
            .then(({ items: chartData }) => {
                queryParams.cluster_id.length > 0 ? setLineChartData(chartData) : setBarChartData(chartData);
            })
            .catch(e => setApiError(e.error));

            readJobExplorer({ params: topTemplatesParams })
            .then(({ items: templatesData }) => {
                setTemplatesData(templatesData);
            })
            .catch(e => setApiError(e.error));

            readJobExplorer({ params: topWorkflowParams })
            .then(({ items: workflowData }) => {
                setWorkflowsData(workflowData);
            })
            .catch(e => setApiError(e.error));

            readEventExplorer({ params: topModuleParams }).then(({ items: modulesData }) => {
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
                        job_type: jobTypes,
                        org_id: orgIds,
                        cluster_id: clusterIds,
                        template_id: templateIds,
                        quick_date_range: quickDateRanges,
                        sort_by: sortBy
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
                      { queryParams.cluster_id.length <= 0 &&
                                    !isLoading && !apiError && (
                          <BarChart
                              margin={ { top: 20, right: 20, bottom: 50, left: 70 } }
                              id="d3-bar-chart-root"
                              data={ barChartData }
                              templateId={ queryParams.template_id }
                              orgId={ queryParams.org_id }
                          />
                      ) }
                      { queryParams.cluster_id.length > 0  &&
                                    !isLoading && !apiError && (
                          <LineChart
                              margin={ { top: 20, right: 20, bottom: 50, left: 70 } }
                              id="d3-line-chart-root"
                              data={ lineChartData }
                              clusterId={ queryParams.cluster_id }
                              templateId={ queryParams.template_id }
                              orgId={ queryParams.org_id }
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
                      qp={ queryParams }
                      templates={ workflowData }
                      isLoading={ isLoading }
                      title={ 'Top workflows' }
                      jobType={ 'workflowjob' }
                  />
                  <TemplatesList
                      history={ history }
                      qp={ queryParams }
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
