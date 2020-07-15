/*eslint camelcase: ["error", {properties: "never"}]*/
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { useQueryParams } from '../../Utilities/useQueryParams';
import { getColorForNames } from '../../Utilities/colors';

import LoadingState from '../../Components/LoadingState';
import NoData from '../../Components/NoData';
import EmptyState from '../../Components/EmptyState';
import {
    preflightRequest,
    readJobsByDateAndOrg,
    readJobRunsByOrg,
    readJobEventsByOrg,
    readHostsByDateAndOrg
} from '../../Api';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';

import {
    Card,
    CardBody,
    CardTitle as PFCardTitle,
    FormSelect,
    FormSelectOption,
    Tabs,
    Tab,
    TabTitleText
} from '@patternfly/react-core';

import { FilterIcon } from '@patternfly/react-icons';

import GroupedBarChart from '../../Charts/GroupedBarChart';
import HostsBarChart from '../../Charts/HostsBarChart';
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
    const [ hostsChartData, setHostsChartData ] = useState([]);
    const [ timeframe, setTimeframe ] = useState(31);
    const [ sortOrder, setSortOrder ] = useState('count:desc');
    const [ isLoading, setIsLoading ] = useState(true);
    const [ activeTabKey, setActiveTabKey ] = useState(0);
    const [ colorToNames, setColorToNames ] = useState({});
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

    // Toggle currently active tab
    const handleTabClick = (event, tabIndex) => {
        setActiveTabKey(tabIndex);
    };

    const getColorForAllNames = (groupedBarChartData, pieChart1Data, pieChart2Data, hostsChartData) => {
        // Get the unique names from the data for orgs
        const namesToMap = [...new Set([
            ...groupedBarChartData[0].orgs.map(el => el.org_name),
            ...hostsChartData[0].orgs.map(el => el.name),
            ...pieChart1Data.map(el => el.name),
            ...pieChart2Data.map(el => el.name)
        ])];
        setColorToNames(getColorForNames(namesToMap.map(el => ({ name: el }))));
    };

    // First render
    useEffect(() => {
        window.insights.chrome.auth.getUser().then(() =>
            preflightRequest().catch((error) => {
                setPreFlightError({ preflightError: error });
            })
        );
    }, []);

    // Get and update the data
    useEffect(() => {
        setIsLoading(true);
        window.insights.chrome.auth.getUser().then(() =>
            Promise.all([
                readJobsByDateAndOrg({ params: queryParams }),
                readJobRunsByOrg({ params: queryParams }),
                readJobEventsByOrg({ params: queryParams }),
                readHostsByDateAndOrg({ params: queryParams })
            ]).then(([
                { dates: groupedBarChartData = []},
                { usages: pieChart1Data = []},
                { usages: pieChart2Data = []},
                { dates: hostsChartData = []}
            ]) => {
                setGroupedBarChartData(groupedBarChartData);
                setPieChart1Data(pieChart1Data);
                setPieChart2Data(pieChart2Data);
                setHostsChartData(hostsChartData);
                getColorForAllNames(groupedBarChartData, pieChart1Data, pieChart2Data, hostsChartData);
                setIsLoading(false);
            })
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
                  <Tabs activeKey={ activeTabKey } onSelect={ handleTabClick }>
                      <Tab eventKey={ 0 } title={ <TabTitleText>Jobs</TabTitleText> }>
                          <CardBody>
                              { isLoading && <LoadingState /> }
                              { !isLoading && groupedBarChartData.length <= 0 && <NoData /> }
                              { activeTabKey === 0 && !isLoading && groupedBarChartData.length > 0 && (
                                  <GroupedBarChart
                                      margin={ { top: 20, right: 20, bottom: 50, left: 50 } }
                                      id="d3-grouped-bar-chart-root"
                                      data={ groupedBarChartData }
                                      colorToNames={ colorToNames }
                                      timeFrame={ timeframe }
                                  />
                              ) }
                          </CardBody>
                      </Tab>
                      <Tab eventKey={ 2 } title={ <TabTitleText>Hosts</TabTitleText> }>
                          <CardBody>
                              { isLoading && <LoadingState /> }
                              { !isLoading && hostsChartData.length <= 0 && <NoData /> }
                              { activeTabKey === 2 && !isLoading && hostsChartData.length > 0 && (
                                  <HostsBarChart
                                      margin={ { top: 20, right: 20, bottom: 50, left: 50 } }
                                      id="d3-hosts-chart-root"
                                      data={ hostsChartData }
                                      colorToNames={ colorToNames }
                                      timeFrame={ timeframe }
                                  />
                              ) }
                          </CardBody>
                      </Tab>
                  </Tabs>
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
                                  colorToNames={ colorToNames }
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
                                  colorToNames={ colorToNames }
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
