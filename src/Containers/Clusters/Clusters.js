/*eslint camelcase: ["error", { properties: "never" }]*/
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

import lineChart from '../../Charts/LineChart';
import barChart from '../../Charts/BarChart';
import tooltip from '../../Charts/Tooltips/FailedSuccessTotalTooltip';
import ChartWrapper from '../../Charts/ChartWrapper';
import ModulesList from '../../Components/ModulesList';
import TemplatesList from '../../Components/TemplatesList';

import { formatDate } from '../../Utilities/helpers';
import useRedirect from '../../Utilities/useRedirect';

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

const Clusters = ({ history }) => {
    const toJobExplorer = useRedirect(history, 'jobExplorer');
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ mainChartData, setMainChartData ] = useState([]);
    const [ templatesData, setTemplatesData ] = useState([]);
    const [ modulesData, setModulesData ] = useState([]);
    const [ clusterOptions, setClusterOptions ] = useState([]);
    const [ clusterTimeFrame, setClusterTimeFrame ] = useState(31);
    const [ selectedCluster, setSelectedCluster ] = useState('all');
    const [ isLoading, setIsLoading ] = useState(true);
    const { queryParams, setEndDate, setStartDate, setId } = useQueryParams(
        initialQueryParams
    );

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

    const redirectToJobExplorer = date => {
        const formattedDate = formatDate(date);
        const query = {
            start_date: formattedDate,
            end_date: formattedDate,
            quick_date_range: 'custom',
            status: [ 'failed', 'successful' ],
            cluster_id: queryParams.id
        };
        toJobExplorer(query);
    };

    // Get and update the data
    useEffect(() => {
        setIsLoading(true);
        window.insights.chrome.auth.getUser().then(() =>
            Promise.all([
                readChart30({ params: queryParams }),
                readModules({ params: queryParams }),
                readTemplates({ params: queryParams })
            ]).then(([
                { data: chartData = []},
                { modules: modulesData = []},
                { templates: templatesData = []}
            ]) => {
                setMainChartData(chartData.map(el => ({
                    xAxis: new Date(el.created),
                    yAxis: el.successful + el.failed,
                    successful: el.successful,
                    failed: el.failed
                })));
                setModulesData(modulesData);
                setTemplatesData(templatesData);
                setIsLoading(false);
            })
        );
    }, [ queryParams ]);

    const currentChart = () => {
        if (queryParams.id) {
            return {
                chart: lineChart,
                yLabel: 'Job runs'
            };
        } else {
            return {
                chart: barChart,
                yLabel: 'Jobs across all clusters'
            };
        }
    };

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
                      { !isLoading && (
                          // change id to more general when find out how to modify css
                          <ChartWrapper
                              data={ mainChartData }
                              lineNames={ [ 'successful', 'failed' ] }
                              colors={ [ '#6EC664', '#A30000' ] }
                              xAxis={ {
                                  text: 'Date'
                              } }
                              yAxis={ {
                                  text: currentChart().yLabel
                              } }
                              value={ clusterTimeFrame }
                              onClick={ redirectToJobExplorer }
                              chart={ currentChart().chart }
                              tooltip={ tooltip({
                                  lineNames: [ 'successful', 'failed' ],
                                  colors: [ '#6EC664', '#A30000' ]
                              }) }
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
                      clusterId={ queryParams.id }
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
