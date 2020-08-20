/*eslint camelcase: ["error", {properties: "never"}]*/
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { useQueryParams } from '../../Utilities/useQueryParams';

import LoadingState from '../../Components/LoadingState';
import NoData from '../../Components/NoData';
import EmptyState from '../../Components/EmptyState';
import {
    preflightRequest,
    readJobsByDateAndOrg,
    readJobRunsByOrg,
    readJobEventsByOrg
} from '../../Api';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';

import {
    Card,
    CardBody,
    CardTitle as PFCardTitle,
    FormSelect,
    FormSelectOption
} from '@patternfly/react-core';

import { FilterIcon } from '@patternfly/react-icons';

import groupedBarChart from '../../Charts/GroupedBarChart';
import pieChart from '../../Charts/PieChart';
import pieChartTooltip from '../../Charts/Tooltips/PieChartTooltip';
import groupedBarChartTooltip from '../../Charts/Tooltips/GroupedBarChartTooltip';
import { pfmulti } from '../../Utilities/colors';
import ChartWrapper from '../../Charts/ChartWrapper';

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

const CardContainer = styled.div`
  display: flex;
  overflow: hidden;

  .pf-c-card {
    width: 50%;
    margin-top: 20px;
    overflow: auto;
  }

  .pf-c-card:first-of-type {
    margin-right: 20px;
  }
`;

const TopCard = styled(Card)`
  min-height: 500px;
`;

const title = (
    <span style={ { fontWeight: 400 } }>
    Automation Analytics
        <span style={ { fontSize: '16px', fontWeight: 400 } }>
            { ' ' }
            <span style={ { margin: '0 10px' } }>|</span> Organization Statistics
        </span>
    </span>
);

const timeFrameOptions = [
    { value: 'please choose', label: 'Select Date Range', disabled: true },
    { value: 7, label: 'Past Week', disabled: false },
    { value: 14, label: 'Past 2 Weeks', disabled: false },
    { value: 31, label: 'Past Month', disabled: false }
];

const sortOptions = [
    { value: 'please choose', label: 'Order By', disabled: true },
    { value: 'count:desc', label: 'Top 5 Orgs', disabled: false },
    { value: 'count:asc', label: 'Bottom 5 Orgs', disabled: false },
    { value: 'all', label: 'All Orgs', disabled: false }
];

const initialQueryParams = {
    startDate: moment.utc().subtract(1, 'month').format('YYYY-MM-DD'),
    endDate: moment.utc().format('YYYY-MM-DD'),
    sort_by: 'count:desc',
    limit: 5
};

const OrganizationStatistics = () => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ pieChart1Data, setPieChart1Data ] = useState([]);
    const [ pieChart2Data, setPieChart2Data ] = useState([]);
    const [ groupedBarChartData, setGroupedBarChartData ] = useState([]);
    const [ timeframe, setTimeframe ] = useState(31);
    const [ sortOrder, setSortOrder ] = useState('count:desc');
    const [ isLoading, setIsLoading ] = useState(true);
    const {
        queryParams,
        setEndDate,
        setStartDate,
        setSortBy,
        setLimit
    } = useQueryParams(initialQueryParams);

    const setLimitValue = (val) => {
        let limit;
        if (val === 'count:asc' || val === 'count:desc') {
            limit = 5;
        } else {
            limit = 200;
        }

        return setLimit(limit);
    };

    useEffect(() => {
        window.insights.chrome.auth.getUser().then(() =>
            preflightRequest().catch((error) => {
                setPreFlightError({ preflightError: error });
            })
        );
    }, []);

    useEffect(() => {
        setIsLoading(true);
        window.insights.chrome.auth.getUser().then(() => Promise.all(
            [
                readJobsByDateAndOrg({ params: queryParams }),
                readJobRunsByOrg({ params: queryParams }),
                readJobEventsByOrg({ params: queryParams })
            ].map((p) => p.catch(() => []))
        ).then(
            ([
                { dates: groupedBarChartData = []},
                { usages: pieChart1Data = []},
                { usages: pieChart2Data = []}
            ]) => {
                setGroupedBarChartData(groupedBarChartData.map(el => ({
                    xAxis: new Date(el.date),
                    group: el.orgs.map(k => ({
                        id: k.id,
                        name: k.org_name,
                        value: k.value,
                        date: new Date(el.date)
                    }))
                })));
                setPieChart1Data(pieChart1Data);
                setPieChart2Data(pieChart2Data);
                setIsLoading(false);
            }
        ));
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
                              name="sortOrder"
                              value={ sortOrder }
                              onChange={ (value) => {
                                  setSortOrder(value);
                                  setSortBy(value);
                                  setLimitValue(value);
                              } }
                              aria-label="Select Cluster"
                              style={ { margin: '2px 10px' } }
                          >
                              { sortOptions.map(({ value, label, disabled }, index) => (
                                  <FormSelectOption
                                      isDisabled={ disabled }
                                      key={ index }
                                      value={ value }
                                      label={ label }
                                  />
                              )) }
                          </FormSelect>
                          <FormSelect
                              name="timeframe"
                              value={ timeframe }
                              onChange={ (value) => {
                                  setTimeframe(+value);
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
              <TopCard>
                  <CardTitle>
                      <h2>Organization Status</h2>
                  </CardTitle>
                  <CardBody>
                      { isLoading && <LoadingState /> }
                      { !isLoading && groupedBarChartData.length <= 0 && <NoData /> }
                      { !isLoading && groupedBarChartData.length > 0 && (
                          <div className="d3-chart-with-legend-wrapper">
                              <ChartWrapper
                                  id="bar-chart-1"
                                  data={ groupedBarChartData }
                                  xAxis={ {
                                      text: 'Date'
                                  } }
                                  yAxis={ {
                                      text: 'Jobs across orgs'
                                  } }
                                  lineNames={ [ 'value' ] }
                                  colors={ [] }
                                  chart={ groupedBarChart }
                                  tooltip={ groupedBarChartTooltip }
                                  legend={
                                      groupedBarChartData[0].group.reduce((colors, org) => {
                                          colors.push({
                                              id: org.id,
                                              name: org.name,
                                              value: pfmulti[colors.length]
                                          });
                                          return colors;
                                      }, [])
                                  }
                                  legendSelector
                              />
                          </div>
                      ) }
                  </CardBody>
              </TopCard>
              <CardContainer>
                  <Card>
                      <CardBody style={ { padding: 0 } }>
                          <CardTitle style={ { padding: 0 } }>
                              <h2 style={ { marginLeft: '20px' } }>
                      Job Runs by Organization
                              </h2>
                          </CardTitle>
                          { isLoading && <LoadingState /> }
                          { !isLoading && pieChart1Data.length <= 0 && <NoData /> }
                          { !isLoading && pieChart1Data.length > 0 && (
                              <div className="d3-chart-with-legend-wrapper">
                                  <ChartWrapper
                                      id="pie-chart-1"
                                      data={ pieChart1Data.filter(d => d.id !== -1) }
                                      lineNames={ [ 'count' ] }
                                      colors={ [] }
                                      chart={ pieChart }
                                      tooltip={ pieChartTooltip }
                                      legend={
                                          pieChart1Data.reduce((colors, org) => {
                                              colors.push({
                                                  name: org.id === -1 ?  'Others' : org.name,
                                                  value: pfmulti[colors.length],
                                                  count: Math.round(org.count)
                                              });
                                              return colors;
                                          }, [])
                                      }
                                      noMargin
                                      small
                                  />
                              </div>
                          ) }
                      </CardBody>
                  </Card>
                  <Card>
                      <CardBody style={ { padding: 0 } }>
                          <CardTitle style={ { padding: 0 } }>
                              <h2 style={ { marginLeft: '20px' } }>
                      Usage by Organization (Tasks)
                              </h2>
                          </CardTitle>
                          { isLoading && <LoadingState /> }
                          { !isLoading && pieChart2Data.length <= 0 && <NoData /> }
                          { !isLoading && pieChart2Data.length > 0 && (
                              <div className="d3-chart-with-legend-wrapper">
                                  <ChartWrapper
                                      id="pie-chart-2"
                                      data={ pieChart2Data.filter(d => d.id !== -1) }
                                      lineNames={ [ 'count' ] }
                                      colors={ [] }
                                      chart={ pieChart }
                                      tooltip={ pieChartTooltip }
                                      legend={
                                          pieChart2Data.reduce((colors, org) => {
                                              colors.push({
                                                  name: org.id === -1 ?  'Others' : org.name,
                                                  value: pfmulti[colors.length],
                                                  count: Math.round(org.count)
                                              });
                                              return colors;
                                          }, [])
                                      }
                                      noMargin
                                      small
                                  />
                              </div>
                          ) }
                      </CardBody>
                  </Card>
              </CardContainer>
          </Main>
        </>
            ) }
        </React.Fragment>
    );
};

export default OrganizationStatistics;
