import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import './sample-page.scss';

import {
    Main,
    PageHeader as RHPageHeader,
    PageHeaderTitle as RHPageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
    Card,
    CardBody,
    CardHeader as PFCardHeader,
    FormSelect,
    FormSelectOption,
    Tabs as PFTabs,
    Tab,
    TabContent
} from '@patternfly/react-core';

import { clustersRequest } from '../../Api';
import BarChart from '../../Charts/BarChart';
import D3Util from '../../Utilities/D3Util';
import GroupedBarChart from '../../Charts/GroupedBarChart';
import LineChart from '../../Charts/LineChart';
import LoadingState from '../../Components/LoadingState';
import ModulesList from '../../Components/ModulesList';
import NotificationsList from '../../Components/NotificationsList';
import PieChart from '../../Charts/PieChart';
import TemplatesList from '../../Components/TemplatesList';

const PageHeader = styled(RHPageHeader)`
  padding: 8px 0 0 0;
`;
const CardHeader = styled(PFCardHeader)`
  &&& {
    min-height: 60px;
    --pf-c-card--first-child--PaddingTop: 10px;
    --pf-c-card__header--not-last-child--PaddingBottom: 10px;

    h3 {
      font-size: 0.875em;
    }
  }
`;
const PageHeaderTitle = styled(RHPageHeaderTitle)`
  margin-left: 20px;
`;
const Tabs = styled(PFTabs)`
  padding: 8px 0 0;

  & .pf-c-tabs__button {
    padding: 8px 20px;
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
class SamplePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clusterTimeFrame: 7,
            orgsJobsTimeFrame: 7,
            orgsStorageTimeFrame: 7,
            orgsPlaybookTimeFrame: 7,
            selectedCluster: 'all',
            selectedNotification: 'all',
            activeTabKey: 0,
            barChartData: [],
            lineChartData: [],
            groupedBarChartData: [],
            pieChart1Data: [],
            pieChart2Data: [],
            modulesData: [],
            templatesData: [],
            notificationsData: [],
            clusterOptions: []
        };

        this.init = this.init.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleDateToggle = this.handleDateToggle.bind(this);
        this.handleTabClick = this.handleTabClick.bind(this);

        this.timeFrameOptions = [
            { value: 'please choose', label: 'Select Date Range', disabled: true },
            { value: 7, label: 'Past Week', disabled: false },
            { value: 14, label: 'Past 2 Weeks', disabled: false },
            { value: 31, label: 'Past Month', disabled: false }
        ];
        this.notificationOptions = [
            {
                value: 'please choose',
                label: 'Select Notification Type',
                disabled: true
            },
            { value: 'error', label: 'View Danger', disabled: false },
            { value: 'all', label: 'View All', disabled: false }
        ];
        this.contentRef1 = React.createRef();
        this.contentRef2 = React.createRef();
    }
    async componentDidMount() {
        await this.init();
    }
    async init() {
        const today = moment().format('YYYY-MM-DD');
        const previousDay = moment()
        .subtract(7, 'days')
        .format('YYYY-MM-DD');
        const defaultPrams = { params: { startDate: previousDay, endDate: today }};
        const { data: barChartData } = await D3Util.getBarChartData();
        const { data: lineChartData } = await D3Util.getLineChartData();
        const { dates: groupedBarChartData } = await D3Util.getGroupedChartData();
        const { usages: pieChart1Data } = await D3Util.getPieChart1Data(
            defaultPrams
        );
        const { usages: pieChart2Data } = await D3Util.getPieChart2Data(
            defaultPrams
        );
        const { modules: modulesData } = await D3Util.getModulesData();
        const { templates: templatesData } = await D3Util.getTemplatesData();
        const {
            notifications: notificationsData
        } = await D3Util.getNotificationsData();
        const { templates: clusterData } = await clustersRequest();
        const clusterOptions = this.formatClusterName(clusterData);
        this.setState({
            barChartData,
            lineChartData,
            groupedBarChartData,
            pieChart1Data,
            pieChart2Data,
            modulesData,
            templatesData,
            notificationsData,
            clusterOptions
        });
    }

  handleTabClick = (_event, tabIndex) => {
      this.setState({
          activeTabKey: tabIndex
      });
  };
  handleSelectChange(
      value,
      {
          target: { name }
      }
  ) {
      this.setState({ [name]: +value || value });
  }
  defaultClusterOptions = [
      { value: 'please choose', label: 'Select Cluster', disabled: true },
      { value: 'all', label: 'All Clusters', disabled: false }
  ];
  formatClusterName(data) {
      return data.reduce(
          (formatted, { label, system_id: id, system_uuid: uuid }) => {
              if (label.length === 0) {
                  formatted.push({ value: id, label: uuid, disabled: false });
              } else {
                  formatted.push({ value: id, label, disabled: false });
              }

              return formatted;
          },
          this.defaultClusterOptions
      );
  }
  async handleDateToggle(selectedDates, id) {
      if (!id) {
          return;
      }

      const params = selectedDates || {};
      if (id === 1) {
          const { usages: pieChart1Data } = await D3Util.getPieChart1Data({
              params
          });
          await this.setState({ pieChart1Data });
      }

      if (id === 2) {
          const { usages: pieChart2Data } = await D3Util.getPieChart2Data({
              params
          });
          await this.setState({ pieChart2Data });
      }
  }

  render() {
      const {
          templatesData,
          modulesData,
          notificationsData,
          selectedCluster,
          activeTabKey,
          barChartData,
          lineChartData,
          groupedBarChartData,
          pieChart1Data,
          pieChart2Data,
          orgsJobsTimeFrame,
          clusterTimeFrame,
          orgsStorageTimeFrame,
          orgsPlaybookTimeFrame,
          selectedNotification,
          clusterOptions
      } = this.state;

      return (
          <React.Fragment>
              <PageHeader>
                  <PageHeaderTitle title="Automation Analytics" />
                  <Tabs activeKey={ activeTabKey } onSelect={ this.handleTabClick }>
                      <Tab
                          eventKey={ 0 }
                          title="Clusters"
                          tabContentId="refTab1Section"
                          tabContentRef={ this.contentRef1 }
                      />
                      <Tab
                          eventKey={ 1 }
                          title="Organization Statistics"
                          tabContentId="refTab2Section"
                          tabContentRef={ this.contentRef2 }
                      />
                  </Tabs>
              </PageHeader>
              <TabContent
                  eventKey={ 0 }
                  id="refTab1Section"
                  ref={ this.contentRef1 }
                  aria-label="Tab item 1"
              >
                  <Main>
                      <Card>
                          <CardHeader
                              style={ {
                                  borderBottom: '2px solid #ebebeb',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                              } }
                          >
                              <h2>Job Status</h2>
                              <div style={ { display: 'flex', justifyContent: 'flex-end' } }>
                                  <FormSelect
                                      name="clusterTimeFrame"
                                      value={ clusterTimeFrame }
                                      onChange={ this.handleSelectChange }
                                      aria-label="Select Date Range"
                                      style={ { margin: '2px 10px' } }
                                  >
                                      { this.timeFrameOptions.map((option, index) => (
                                          <FormSelectOption
                                              isDisabled={ option.disabled }
                                              key={ index }
                                              value={ option.value }
                                              label={ option.label }
                                          />
                                      )) }
                                  </FormSelect>
                                  <FormSelect
                                      name="selectedCluster"
                                      value={ selectedCluster }
                                      onChange={ this.handleSelectChange }
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
                              </div>
                          </CardHeader>
                          <CardBody>
                              { barChartData.length <= 0 && <LoadingState /> }
                              { selectedCluster === 'all' &&
                  barChartData.length > 0 &&
                  activeTabKey === 0 && (
                                  <BarChart
                                      margin={ { top: 20, right: 20, bottom: 50, left: 70 } }
                                      id="d3-bar-chart-root"
                                      data={ barChartData }
                                      value={ clusterTimeFrame }
                                  />
                              ) }
                              { selectedCluster !== 'all' && lineChartData.length <= 0 && (
                                  <LoadingState />
                              ) }
                              { selectedCluster !== 'all' &&
                  lineChartData.length > 0 &&
                  activeTabKey === 0 && (
                                  <LineChart
                                      margin={ { top: 20, right: 20, bottom: 50, left: 70 } }
                                      id="d3-bar-chart-root"
                                      data={ lineChartData }
                                      value={ clusterTimeFrame }
                                      cluster={ selectedCluster }
                                  />
                              ) }
                          </CardBody>
                      </Card>
                      <div
                          className="dataCard"
                          style={ { display: 'flex', marginTop: '20px' } }
                      >
                          <TemplatesList templates={ templatesData } />
                          <ModulesList modules={ modulesData } />
                          <NotificationsList
                              onNotificationChange={ this.handleSelectChange }
                              filterBy={ selectedNotification }
                              options={ this.notificationOptions }
                              notifications={ notificationsData }
                          />
                      </div>
                  </Main>
              </TabContent>
              <TabContent
                  eventKey={ 1 }
                  id="refTab2Section"
                  ref={ this.contentRef2 }
                  aria-label="Tab item 2"
                  hidden
              >
                  <Main>
                      <TopCard>
                          <CardHeader
                              style={ {
                                  borderBottom: '2px solid #ebebeb',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                              } }
                          >
                              <h2>Organization Status</h2>
                              <div style={ { display: 'flex', justifyContent: 'flex-end' } }>
                                  <FormSelect
                                      name="orgsJobsTimeFrame"
                                      value={ orgsJobsTimeFrame }
                                      onChange={ this.handleSelectChange }
                                      aria-label="Select Date Range"
                                      style={ { margin: '2px 10px' } }
                                  >
                                      { this.timeFrameOptions.map((option, index) => (
                                          <FormSelectOption
                                              isDisabled={ option.disabled }
                                              key={ index }
                                              value={ option.value }
                                              label={ option.label }
                                          />
                                      )) }
                                  </FormSelect>
                              </div>
                          </CardHeader>
                          <CardBody>
                              { groupedBarChartData.length <= 0 && <LoadingState /> }
                              { groupedBarChartData.length > 0 && activeTabKey === 1 && (
                                  <GroupedBarChart
                                      margin={ { top: 20, right: 20, bottom: 50, left: 50 } }
                                      id="d3-grouped-bar-chart-root"
                                      data={ groupedBarChartData }
                                      timeFrame={ orgsJobsTimeFrame }
                                  />
                              ) }
                          </CardBody>
                      </TopCard>
                      <CardContainer>
                          <Card>
                              <CardBody style={ { padding: 0 } }>
                                  <CardHeader
                                      style={ {
                                          borderBottom: '2px solid #ebebeb',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          padding: 0
                                      } }
                                  >
                                      <h2 style={ { marginLeft: '20px' } }>
                      Job Runs by Organization
                                      </h2>
                                      <FormSelect
                                          name="orgsPlaybookTimeFrame"
                                          value={ orgsPlaybookTimeFrame }
                                          onChange={ this.handleSelectChange }
                                          aria-label="Select Date Range"
                                          style={ { margin: '2px 10px', width: '33%' } }
                                      >
                                          { this.timeFrameOptions.map((option, index) => (
                                              <FormSelectOption
                                                  isDisabled={ option.disabled }
                                                  key={ index }
                                                  value={ option.value }
                                                  label={ option.label }
                                              />
                                          )) }
                                      </FormSelect>
                                  </CardHeader>
                                  { pieChart1Data.length <= 0 && <LoadingState /> }
                                  { pieChart1Data.length > 0 && activeTabKey === 1 && (
                                      <PieChart
                                          margin={ { top: 20, right: 20, bottom: 0, left: 20 } }
                                          id="d3-donut-1-chart-root"
                                          tag={ 1 }
                                          data={ pieChart1Data }
                                          timeFrame={ orgsPlaybookTimeFrame }
                                          onDateToggle={ this.handleDateToggle }
                                      />
                                  ) }
                              </CardBody>
                          </Card>
                          <Card>
                              <CardBody style={ { padding: 0 } }>
                                  <CardHeader
                                      style={ {
                                          borderBottom: '2px solid #ebebeb',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          padding: 0
                                      } }
                                  >
                                      <h2 style={ { marginLeft: '20px' } }>Usage by Organization (Tasks)</h2>
                                      <FormSelect
                                          name="orgsStorageTimeFrame"
                                          value={ orgsStorageTimeFrame }
                                          onChange={ this.handleSelectChange }
                                          aria-label="Select Date Range"
                                          style={ { margin: '2px 10px', width: '33%' } }
                                      >
                                          { this.timeFrameOptions.map((option, index) => (
                                              <FormSelectOption
                                                  isDisabled={ option.disabled }
                                                  key={ index }
                                                  value={ option.value }
                                                  label={ option.label }
                                              />
                                          )) }
                                      </FormSelect>
                                  </CardHeader>
                                  { pieChart2Data.length <= 0 && <LoadingState /> }
                                  { pieChart2Data.length > 0 && activeTabKey === 1 && (
                                      <PieChart
                                          margin={ { top: 20, right: 20, bottom: 0, left: 20 } }
                                          id="d3-donut-2-chart-root"
                                          tag={ 2 }
                                          data={ pieChart2Data }
                                          timeFrame={ orgsStorageTimeFrame }
                                          onDateToggle={ this.handleDateToggle }
                                      />
                                  ) }
                              </CardBody>
                          </Card>
                      </CardContainer>
                  </Main>
              </TabContent>
          </React.Fragment>
      );
  }
}

export default withRouter(SamplePage);
