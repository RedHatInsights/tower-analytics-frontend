/*eslint camelcase: ["error", {allow: ["start_date", "end_date", "group_by_time", "setStart_Date", "setEnd_Date"]}]*/

import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { useQueryParams } from '../../Utilities/useQueryParams';

import styled from 'styled-components';
import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import {
    preflightRequest,
    readClusters,
    readModules,
    readTemplates,
    readClustersBarChart
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
    start_date: moment
    .utc()
    .subtract(1, 'month')
    .format('YYYY-MM-DD'),
    end_date: moment.utc().format('YYYY-MM-DD')
};

const barChartParams = {
    status: [ 'successful', 'failed' ],
    group_by_time: true
};

const Clusters = ({ history }) => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ barChartData, setBarChartData ] = useState([]);
    const [ lineChartData, setLineChartData ] = useState([]);
    const [ templatesData, setTemplatesData ] = useState([]);
    const [ modulesData, setModulesData ] = useState([]);
    const [ clusterOptions, setClusterOptions ] = useState([]);
    const [ clusterTimeFrame, setClusterTimeFrame ] = useState(31);
    const [ selectedCluster, setSelectedCluster ] = useState('all');
    const [ isLoading, setIsLoading ] = useState(true);
    const { queryParams, setEnd_Date, setStart_Date, setCluster } = useQueryParams(
        initialQueryParams
    );

    const combinedParams = {
        ...queryParams,
        ...barChartParams
    };

    useEffect(() => {
        setIsLoading(true);
        window.insights.chrome.auth.getUser().then(() =>
            preflightRequest().then(() =>
                readClusters().then(({ templates: clustersData = []}) => {
                    const clusterOptions = formatClusterName(clustersData);
                    setClusterOptions(clusterOptions);
                    setIsLoading(false);
                })
            ).catch((error) => {
                setPreFlightError({ preflightError: error });
            })
        );
    }, []);

    // Get and update the data
    useEffect(() => {
        setIsLoading(true);
        window.insights.chrome.auth.getUser().then(() =>
            Promise.all([
                readModules({ params: queryParams }),
                readTemplates({ params: queryParams }),
                readClustersBarChart({ params: combinedParams })
            ]).then(([
                { modules: modulesData = []},
                { templates: templatesData = []},
                { items: chartData = []}
            ]) => {
                queryParams.cluster_id ? setLineChartData(chartData) : setBarChartData(chartData);
                setModulesData(modulesData);
                setTemplatesData(templatesData);
                setIsLoading(false);
            }).catch(() => [])
        );
    }, [ queryParams ]);

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
                                  setCluster(value);
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
                                  setEnd_Date();
                                  setStart_Date(+value);
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
                              clusterId={ queryParams.cluster_id }
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
                      clusterId={ queryParams.cluster_id }
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
