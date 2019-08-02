/* eslint-disable */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import asyncComponent from "../../Utilities/asyncComponent";
import D3Util from "../../Utilities/D3Util";
import "./sample-page.scss";

import {
  Section,
  Main,
  PageHeader as RHPageHeader,
  PageHeaderTitle as RHPageHeaderTitle
} from "@redhat-cloud-services/frontend-components";

import { CircleIcon, WarningTriangleIcon } from "@patternfly/react-icons";

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader as PFCardHeader,
  DataList,
  DataListItem,
  DataListCell,
  FormSelect,
  FormSelectOption,
  Switch,
  Modal,
  Tabs as PFTabs,
  Tab,
  TabsVariant,
  TabContent
} from "@patternfly/react-core";

import { Table, TableHeader, TableBody } from "@patternfly/react-table";

import PieChart from "../../Charts/PieChart";
import BarChart from "../../Charts/BarChart";
import LineChart from "../../Charts/LineChart";
import ModulesList from "../../Components/ModulesList";
import TemplatesList from "../../Components/TemplatesList";
import NotificationsList from "../../Components/NotificationsList";

import styled from "styled-components";
import DonutChart from "../../Charts/DonutChart";
import GroupedBarChart from "../../Charts/GroupedBarChart";

const PageHeader = styled(RHPageHeader)`
  padding: 8px 0 0 0;
`;
const CardHeader = styled(PFCardHeader)`
&&& {
  /* border-bottom: "2px solid #ebebeb";
  display: flex;
  justify-content: "space-between";
  align-content: "center"; */
  min-height: 60px;
  --pf-c-card--first-child--PaddingTop: 10px;
  --pf-c-card__header--not-last-child--PaddingBottom: 10px;

  h3 {
    font-size: .875em;
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
const SampleComponent = asyncComponent(() =>
  import("../../PresentationalComponents/SampleComponent/sample-component")
);

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class SamplePage extends Component {
  async componentDidMount() {
    await this.init();
  }

  async init() {
    const barChartData = await D3Util.getBarChartData();
    const lineChartData = await D3Util.getLineChartData();
    const groupedBarChartData = await D3Util.getGroupedChartData();
    const pieChart1Data = await D3Util.getPieChart1Data();
    const pieChart2Data = await D3Util.getPieChart2Data();
    this.setState({
      barChartData,
      lineChartData,
      groupedBarChartData,
      pieChart1Data,
      pieChart2Data
    });
  }

  async fetchData(endpoint) {
    return await d3.json(endpoint);
  }

  constructor(props) {
    super(props);
    this.state = {
      isLeftOpen: false,
      isRightOpen: false,
      isModalOpen: false,
      clusterTimeFrame: 7,
      orgsJobsTimeFrame: 7,
      orgsStorageTimeFrame: 7,
      orgsPlaybookTimeFrame: 7,
      rightValue: 0,
      notificationValue: "all",
      modules: [],
      templates: [],
      clusters: [],
      notifications: [],
      modalTemplate: null,
      modalData: [],
      activeTabKey: 0,
      barChartData: [],
      lineChartData: [],
      groupedBarChartData: [],
      pieChart1Data: [],
      pieChart2Data: []
    };

    this.onRightToggle = this.onRightToggle.bind(this);
    this.onRightSelect = this.onRightSelect.bind(this);
    this.init = this.init.bind(this);
    this.handleTimeFrameChange = this.handleTimeFrameChange.bind(this);


    this.rightChange = (value, event) => {
      this.setState({ rightValue: +value });
    };
    this.handleNotificationChange = (value, event) => {
      this.setState({ notificationValue: value });
    };
    this.timeFrameOptions = [
      { value: "please choose", label: "Select Date Range", disabled: true },
      { value: 7, label: "Past Week", disabled: false },
      { value: 14, label: "Past 2 Weeks", disabled: false },
      { value: 31, label: "Past Month", disabled: false }
    ];
    this.rightOptions = [
      { value: "please choose", label: "Select Hosts", disabled: true },
      { value: 0, label: "All Clusters", disabled: false },
      { value: 1, label: "Cluster A", disabled: false }
    ],
    this.notificationOptions = [
      {
        value: "please choose",
        label: "Select Notification Type",
        disabled: true
      },
      { value: "error", label: "View Danger", disabled: false },
      { value: "all", label: "View All", disabled: false }
    ];
    /*eslint camelcase: ["error", {properties: "never"}]*/
    this.mockNotificationsData = [
      {
        date: "2019-04-30T15:06:40.995",
        label: "message",
        message: "Regular message number 1",
        notification_id: 2,
        notification_severity_id: 2,
        notification_type_id: 2,
        tenant_id: 4
      },
      {
        date: "2019-06-30T15:07:40.995",
        label: "message",
        message: "Regular message number 2",
        notification_id: 3,
        notification_severity_id: 2,
        notification_type_id: 2,
        tenant_id: 5
      },
      {
        date: "2019-05-30T15:07:40.995",
        label: "error",
        message: "Error message number 1",
        notification_id: 3,
        notification_severity_id: 2,
        notification_type_id: 2,
        tenant_id: 5
      },
      {
        date: "2019-07-30T15:07:40.995",
        label: "warning",
        message: "Warning message number 1",
        notification_id: 3,
        notification_severity_id: 2,
        notification_type_id: 2,
        tenant_id: 5
      }
    ];
    this.contentRef1 = React.createRef();
    this.contentRef2 = React.createRef();

    // Toggle currently active tab
    this.handleTabClick = (_event, tabIndex) => {
      this.setState({
        activeTabKey: tabIndex
      });
    };
  }
  handleTimeFrameChange(value, { target: { name } }) {
    this.setState({ [name]: +value });
  };

  onRightToggle(isRightOpen) {
    this.setState({
      isRightOpen
    });
  }

  onRightSelect(event) {
    this.setState({
      isRightOpen: !this.state.isRightOpen
    });
  }

  render() {
    const {
      isModalOpen,
      modalTemplate,
      modalData,
      rightValue,
      notificationValue,
      notifications,
      activeTabKey,
      barChartData,
      lineChartData,
      groupedBarChartData,
      pieChart1Data,
      pieChart2Data
    } = this.state;

    return (
      <React.Fragment>
        <PageHeader>
          <PageHeaderTitle title="Tower Analytics" />
          <Tabs
            activeKey={this.state.activeTabKey}
            onSelect={this.handleTabClick}
          >
            <Tab
              eventKey={0}
              title="Clusters"
              tabContentId="refTab1Section"
              tabContentRef={this.contentRef1}
            />
            <Tab
              eventKey={1}
              title="Organizations"
              tabContentId="refTab2Section"
              tabContentRef={this.contentRef2}
            />
          </Tabs>
        </PageHeader>
        <TabContent
          eventKey={0}
          id="refTab1Section"
          ref={this.contentRef1}
          aria-label="Tab item 1"
        >
          <Main>
            <Card>
              <CardHeader
                style={{
                  borderBottom: "2px solid #ebebeb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h2>Job Status</h2>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <FormSelect
                    name="clusterTimeFrame"
                    value={this.state.clusterTimeFrame}
                    onChange={this.handleTimeFrameChange}
                    // onClick={this.handleTimeFrameChange}
                    aria-label="Select Date Range"
                    style={{ margin: "2px 10px" }}
                  >
                    {this.timeFrameOptions.map((option, index) => (
                      <FormSelectOption
                        isDisabled={option.disabled}
                        key={index}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </FormSelect>
                  <FormSelect
                    value={this.state.rightValue}
                    onChange={this.rightChange}
                    aria-label="Select Hosts"
                    style={{ margin: "2px 10px" }}
                  >
                    {this.rightOptions.map((option, index) => (
                      <FormSelectOption
                        isDisabled={option.disabled}
                        key={index}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </FormSelect>
                </div>
              </CardHeader>
              <CardBody>
                {rightValue === 0 && barChartData.length > 0 && (
                  <BarChart
                    margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
                    id="d3-bar-chart-root"
                    data={barChartData}
                    value={this.state.clusterTimeFrame}
                  />
                )}
                {rightValue !== 0 && lineChartData.length > 0 && (
                  <LineChart
                    margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
                    id="d3-bar-chart-root"
                    data={lineChartData}
                    value={this.state.clusterTimeFrame}
                    cluster={this.state.rightValue}
                  />
                )}
              </CardBody>
            </Card>
            <div
              className="dataCard"
              style={{ display: "flex", marginTop: "20px" }}
            >
              <TemplatesList
                templates={[
                  { name: "Template 1", type: "Playbook Run", id: 1 },
                  { name: "Template 2", type: "Workflow", id: 2 },
                  { name: "Template 3", type: "Playbook Run", id: 3 }
                ]}
              />
              <ModulesList
                modules={[
                  { name: "Module 1", count: 4 },
                  { name: "Module 2", count: 3 },
                  { name: "Module 3", count: 1 }
                ]}
              />
              <NotificationsList
                onNotificationChange={this.handleNotificationChange}
                filterBy={this.state.notificationValue}
                options={this.notificationOptions}
                notifications={this.mockNotificationsData}
              />
            </div>
          </Main>
        </TabContent>
        <TabContent
          eventKey={1}
          id="refTab2Section"
          ref={this.contentRef2}
          aria-label="Tab item 2"
          hidden
        >
          <Main>
            <TopCard>
              <CardHeader
                style={{
                  borderBottom: "2px solid #ebebeb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h2>Organization Status</h2>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <FormSelect
                    name="orgsJobsTimeFrame"
                    value={this.state.orgsJobsTimeFrame}
                    onChange={this.handleTimeFrameChange}
                    aria-label="Select Date Range"
                    style={{ margin: "2px 10px" }}
                  >
                    {this.timeFrameOptions.map((option, index) => (
                      <FormSelectOption
                        isDisabled={option.disabled}
                        key={index}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </FormSelect>
                </div>
              </CardHeader>
              <CardBody>
                {groupedBarChartData.length > 0 && activeTabKey == 1 && (
                  <GroupedBarChart
                    margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                    id="d3-grouped-bar-chart-root"
                    data={groupedBarChartData}
                  />
                )}
              </CardBody>
            </TopCard>
            <CardContainer>
              <Card>
                <CardBody style={{ padding: 0 }}>
                  <CardHeader
                    style={{
                      borderBottom: "2px solid #ebebeb",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 0
                    }}
                  >
                    <h2 style={{ marginLeft: "20px" }}>
                      Average Elapsed Playbook Run
                    </h2>
                    <FormSelect
                      name="orgsPlaybookTimeFrame"
                      value={this.state.orgsPlaybookTimeFrame}
                      onChange={this.handleTimeFrameChange}
                      aria-label="Select Date Range"
                      style={{ margin: "2px 10px", width: "33%" }}
                    >
                      {this.timeFrameOptions.map((option, index) => (
                        <FormSelectOption
                          isDisabled={option.disabled}
                          key={index}
                          value={option.value}
                          label={option.label}
                        />
                      ))}
                    </FormSelect>
                  </CardHeader>
                  {pieChart1Data.length > 0 && activeTabKey == 1 && (
                    <PieChart
                      margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
                      id="d3-donut-1-chart-root"
                      data={pieChart1Data}
                    />
                  )}
                </CardBody>
              </Card>
              <Card>
                <CardBody style={{ padding: 0 }}>
                  <CardHeader
                    style={{
                      borderBottom: "2px solid #ebebeb",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 0
                    }}
                  >
                    <h2 style={{ marginLeft: "20px" }}>Storage</h2>
                    <FormSelect
                      name="orgsStorageTimeFrame"
                      value={this.state.orgsStorageTimeFrame}
                      onChange={this.handleTimeFrameChange}
                      aria-label="Select Date Range"
                      style={{ margin: "2px 10px", width: "33%" }}
                    >
                      {this.timeFrameOptions.map((option, index) => (
                        <FormSelectOption
                          isDisabled={option.disabled}
                          key={index}
                          value={option.value}
                          label={option.label}
                        />
                      ))}
                    </FormSelect>
                  </CardHeader>
                  {pieChart2Data.length > 0 && activeTabKey == 1 && (
                    <PieChart
                      margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
                      id="d3-donut-2-chart-root"
                      data={pieChart2Data}
                    />
                  )}
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
