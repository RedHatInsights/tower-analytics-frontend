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

import GroupedBarChart from '../../Charts/GroupedBarChart';
import PieChart from '../../Charts/PieChart';

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
    startDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
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
    const [ firstRender, setFirstRender ] = useState(true);
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
        insights.chrome.appNavClick({ id: 'organization-statistics', secondaryNav: true });
    }, []);

    useEffect(() => {
        let ignore = false;
        const fetchEndpoints = () => {
            return Promise.all(
                [
                    readJobsByDateAndOrg({ params: queryParams }),
                    readJobRunsByOrg({ params: queryParams }),
                    readJobEventsByOrg({ params: queryParams })
                ].map((p) => p.catch(() => []))
            );
        };

        const update = async () => {
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            fetchEndpoints().then(
                ([
                    { dates: groupedBarChartData = []},
                    { usages: pieChart1Data = []},
                    { usages: pieChart2Data = []}
                ]) => {
                    setGroupedBarChartData(groupedBarChartData);
                    setPieChart1Data(pieChart1Data);
                    setPieChart2Data(pieChart2Data);
                    setIsLoading(false);
                }
            );
        };

        async function initializeWithPreflight() {
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            await preflightRequest().catch((error) => {
                setPreFlightError({ preflightError: error });
            });
            fetchEndpoints().then(
                ([
                    { dates: groupedBarChartData = []},
                    { usages: pieChart1Data = []},
                    { usages: pieChart2Data = []}
                ]) => {
                    if (!ignore) {
                        setGroupedBarChartData(groupedBarChartData);
                        setPieChart1Data(pieChart1Data);
                        setPieChart2Data(pieChart2Data);
                        setFirstRender(false);
                        setIsLoading(false);
                    }
                }
            );
        }

        if (firstRender) {
            initializeWithPreflight();
            return () => (ignore = true);
        } else {
            update();
        }
    }, [ queryParams ]);

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={ 'Organization Statistics' } />
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
                          <GroupedBarChart
                              margin={ { top: 20, right: 20, bottom: 50, left: 50 } }
                              id="d3-grouped-bar-chart-root"
                              data={ groupedBarChartData }
                              timeFrame={ timeframe }
                          />
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
                              <PieChart
                                  margin={ { top: 20, right: 20, bottom: 0, left: 20 } }
                                  id="d3-donut-1-chart-root"
                                  data={ pieChart1Data }
                                  timeFrame={ timeframe }
                              />
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
                              <PieChart
                                  margin={ { top: 20, right: 20, bottom: 0, left: 20 } }
                                  id="d3-donut-2-chart-root"
                                  data={ pieChart2Data }
                                  timeFrame={ timeframe }
                              />
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
