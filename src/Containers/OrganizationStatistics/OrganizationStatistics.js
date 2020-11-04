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
    { value: 'desc', label: 'Top 5 Orgs', disabled: false },
    { value: 'asc', label: 'Bottom 5 Orgs', disabled: false },
    { value: 'all', label: 'All Orgs', disabled: false }
];

const initialQueryParams = {
    startDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
    sortBy: 'desc',
    limit: 5
};

const OrganizationStatistics = () => {
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ pieChart1Data, setPieChart1Data ] = useState([]);
    const [ pieChart2Data, setPieChart2Data ] = useState([]);
    const [ orgsChartData, setorgsChartData ] = useState([]);
    const [ timeframe, setTimeframe ] = useState(31);
    const [ isLoading, setIsLoading ] = useState(true);
    const {
        queryParams,
        setEndDate,
        setStartDate,
        setFromToolbar,
        setLimit,
        urlMappedQueryParams
    } = useQueryParams(initialQueryParams);

    const setLimitValue = (val) => {
        let limit;
        if (val === 'asc' || val === 'desc') {
            limit = 5;
        } else {
            limit = 25;
        }

        return setLimit(limit);
    };

    useEffect(() => {
        insights.chrome.appNavClick({ id: 'organization-statistics', secondaryNav: true });
        window.insights.chrome.auth.getUser().then(() =>
            preflightRequest().catch((error) => {
                setPreFlightError({ preflightError: error });
            })
        );
    }, []);

    const orgsChartMapper = data => data.map(el => ({
        date: new Date(el.date),
        items: el.items.map(k => ({
            id: k.id,
            date: new Date(el.date),
            value: k.total_count,
            name: k.name || 'No organization'
        }))
    }));

    const pieChartMapper = data => data.map(el => ({
        id: el.id,
        count: el.host_count,
        name: el.name || 'No organization'
    }));

    useEffect(() => {
        let didCancel = false;
        setIsLoading(true);
        window.insights.chrome.auth.getUser().then(() => Promise.all(
            [
                readJobsByDateAndOrg({ params: urlMappedQueryParams }),
                readJobRunsByOrg({ params: urlMappedQueryParams }),
                readJobEventsByOrg({ params: urlMappedQueryParams })
            ].map((p) => p.catch(() => []))
        ).then(
            ([
                { dates: orgsChartData = []},
                { items: pieChart1Data = []},
                { items: pieChart2Data = []}
            ]) => {
                if (didCancel) { return; }

                setorgsChartData(orgsChartMapper(orgsChartData));
                setPieChart1Data(pieChartMapper(pieChart1Data));
                setPieChart2Data(pieChartMapper(pieChart2Data));
            }
        ).finally(() => setIsLoading(false)));

        return () => didCancel = true;
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
                              value={ queryParams.sortBy }
                              onChange={ (value) => {
                                  setFromToolbar('sortBy', value);
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
                      { !isLoading && orgsChartData.length <= 0 && <NoData /> }
                      { !isLoading && orgsChartData.length > 0 && (
                          <GroupedBarChart
                              margin={ { top: 20, right: 20, bottom: 50, left: 50 } }
                              id="d3-grouped-bar-chart-root"
                              data={ orgsChartData }
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
