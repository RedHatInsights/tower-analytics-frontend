/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { useQueryParams } from '../../Utilities/useQueryParams';

import styled from 'styled-components';
import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import {
    preflightRequest,
    readChart30,
    readClusters,
    readModules,
    readTemplates
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
    FormSelect,
    FormSelectOption
} from '@patternfly/react-core';

import { FilterIcon } from '@patternfly/react-icons';

import BarChart from '../../Charts/BarChart';
import LineChart from '../../Charts/LineChart';
import ModulesList from '../../Components/ModulesList';
import TemplatesList from '../../Components/TemplatesList';

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
const title = (
    <span style={ { fontWeight: 400 } }>
    Automation Analytics
        <span style={ { fontSize: '16px', fontWeight: 400 } }>
            { ' ' }
            <span style={ { margin: '0 10px' } }>|</span> Clusters
        </span>
    </span>
);

const timeFrameOptions = [
    { value: 'please choose', label: 'Select date range', disabled: true },
    { value: 7, label: 'Past week', disabled: false },
    { value: 14, label: 'Past 2 weeks', disabled: false },
    { value: 31, label: 'Past month', disabled: false }
];

function formatClusterName(data) {
    const defaultClusterOptions = [
        { value: 'please choose', label: 'Select cluster', disabled: true },
        { value: 'all', label: 'All clusters', disabled: false }
    ];
    return data.reduce(
        (formatted, { label, cluster_id: id, install_uuid: uuid }) => {
            if (label.length === 0) {
                formatted.push({ value: id, label: uuid, disabled: false });
            } else {
                formatted.push({ value: id, label, disabled: false });
            }

            return formatted;
        },
        defaultClusterOptions
    );
}

const initialQueryParams = {
    startDate: moment
    .utc()
    .subtract(1, 'month')
    .format('YYYY-MM-DD'),
    endDate: moment.utc().format('YYYY-MM-DD')
};

const Clusters = () => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ barChartData, setBarChartData ] = useState([]);
    const [ lineChartData, setLineChartData ] = useState([]);
    const [ templatesData, setTemplatesData ] = useState([]);
    const [ modulesData, setModulesData ] = useState([]);
    const [ clusterOptions, setClusterOptions ] = useState([]);
    const [ clusterTimeFrame, setClusterTimeFrame ] = useState(31);
    const [ selectedCluster, setSelectedCluster ] = useState('all');
    const [ firstRender, setFirstRender ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(true);
    const { queryParams, setEndDate, setStartDate, setId } = useQueryParams(
        initialQueryParams
    );

    useEffect(() => {
        if (firstRender) {
            return;
        }

        const fetchEndpoints = () => {
            return Promise.all(
                [
                    readChart30({ params: queryParams }),
                    readModules({ params: queryParams }),
                    readTemplates({ params: queryParams })
                ].map(p => p.catch(() => []))
            );
        };

        const update = async () => {
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            fetchEndpoints().then(
                ([
                    { data: chartData = []},
                    { modules: modulesData = []},
                    { templates: templatesData = []}
                ]) => {
                    if (queryParams.id) {
                        setLineChartData(chartData);
                    } else {
                        setBarChartData(chartData);
                    }

                    setModulesData(modulesData);
                    setTemplatesData(templatesData);
                    setIsLoading(false);
                }
            );
        };

        update();
    }, [ queryParams ]);

    useEffect(() => {
        let ignore = false;
        const getData = () => {
            return Promise.all(
                [
                    readChart30({ params: queryParams }),
                    readClusters(),
                    readModules({ params: queryParams }),
                    readTemplates({ params: queryParams })
                ].map(p => p.catch(() => []))
            );
        };

        async function initializeWithPreflight() {
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            await preflightRequest().catch(error => {
                setPreFlightError({ preflightError: error });
            });
            getData().then(
                ([
                    { data: barChartData = []},
                    { templates: clustersData = []},
                    { modules: modulesData = []},
                    { templates: templatesData = []}
                ]) => {
                    if (!ignore) {
                        const clusterOptions = formatClusterName(clustersData);

                        setBarChartData(barChartData);
                        setClusterOptions(clusterOptions);
                        setModulesData(modulesData);
                        setTemplatesData(templatesData);
                        setFirstRender(false);
                        setIsLoading(false);
                    }
                }
            );
        }

        initializeWithPreflight();
        return () => (ignore = true);
    }, []);

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={ title } />
            </PageHeader>
            { preflightError && (
                <Main>
                    <EmptyState { ...preflightError } />
                </Main>
            ) }
            { !preflightError && (
        <>
          <Main style={ { paddingBottom: '0' } }>
              <Card>
                  <CardTitle style={ { paddingBottom: '0', paddingTop: '0' } }>
                      <h2>
                          <FilterIcon style={ { marginRight: '10px' } } />
                  Filter
                      </h2>
                      <div style={ { display: 'flex', justifyContent: 'flex-end' } }>
                          <FormSelect
                              name="selectedCluster"
                              value={ selectedCluster }
                              onChange={ value => {
                                  setSelectedCluster(value);
                                  setId(value);
                              } }
                              aria-label="Select Cluster"
                              style={ { margin: '2px 10px' } }
                          >
                              { clusterOptions.map(({ value, label, disabled }, index) => (
                                  <FormSelectOption
                                      isDisabled={ disabled }
                                      key={ index }
                                      value={ value }
                                      label={ label }
                                  />
                              )) }
                          </FormSelect>
                          <FormSelect
                              name="clusterTimeFrame"
                              value={ clusterTimeFrame }
                              onChange={ value => {
                                  setClusterTimeFrame(+value);
                                  setEndDate();
                                  setStartDate(+value);
                              } }
                              aria-label="Select Date Range"
                              style={ { margin: '2px 10px' } }
                          >
                              { timeFrameOptions.map((option, index) => (
                                  <FormSelectOption
                                      isDisabled={ option.disabled }
                                      key={ index }
                                      value={ option.value }
                                      label={ option.label }
                                  />
                              )) }
                          </FormSelect>
                      </div>
                  </CardTitle>
              </Card>
          </Main>
          <Main>
              <Card>
                  <PFCardTitle>
                      <h2>Job status</h2>
                  </PFCardTitle>
                  <CardBody>
                      { isLoading && !preflightError && <LoadingState /> }
                      { selectedCluster === 'all' &&
                  barChartData.length > 0 &&
                  !isLoading && (
                          <BarChart
                              margin={ { top: 20, right: 20, bottom: 50, left: 70 } }
                              id="d3-bar-chart-root"
                              data={ barChartData }
                              value={ clusterTimeFrame }
                          />
                      ) }
                      { selectedCluster !== 'all' &&
                  lineChartData.length > 0 &&
                  !isLoading && (
                          <LineChart
                              margin={ { top: 20, right: 20, bottom: 50, left: 70 } }
                              id="d3-line-chart-root"
                              data={ lineChartData }
                              value={ clusterTimeFrame }
                          />
                      ) }
                  </CardBody>
              </Card>
              <div
                  className="dataCard"
                  style={ { display: 'flex', marginTop: '20px' } }
              >
                  <TemplatesList
                      queryParams={ queryParams }
                      templates={ templatesData.slice(0, 10) }
                      isLoading={ isLoading }
                  />
                  <ModulesList
                      modules={ modulesData.slice(0, 10) }
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
