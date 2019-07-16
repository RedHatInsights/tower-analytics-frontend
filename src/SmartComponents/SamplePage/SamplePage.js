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
  CardHeader,
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

import BarChart from "../../Charts/BarChart";
import LineChart from "../../Charts/LineChart";
import ModulesList from "../../Components/ModulesList";
import TemplatesList from "../../Components/TemplatesList";
import NotificationsList from "../../Components/NotificationsList";

import { forHumans } from "./util.js";

import styled from "styled-components";
import DonutChart from "../../Charts/DonutChart";
import GroupedBarChart from "../../Charts/GroupedBarChart";

const PageHeader = styled(RHPageHeader)`
  padding: 8px 0 0 0;
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
// const PageHeader2 = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header'));
// const PageHeaderTitle2 = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header-title'));

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class ModalTrigger extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onLinkClick(this.props.value);
  }

  render() {
    return (
      <span
        style={{ color: "#007bba", cursor: "pointer" }}
        onClick={this.handleClick}
      >
        {this.props.value}
      </span>
    );
  }
}

class TemplateModal extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.onModalClose(null);
  }

  render() {
    const successfulIcon = (
      <CircleIcon
        size="sm"
        key="5"
        style={{ color: "#52af51", marginRight: "5px" }}
      />
    );
    const failedIcon = (
      <CircleIcon
        size="sm"
        key="5"
        style={{ color: "#d9534f", marginRight: "5px" }}
      />
    );

    var rows = [];
    var i = 0;
    var datum = null;
    var average_time = 0;
    var total_time = 0;
    if (this.props.modalData !== undefined && this.props.modalData !== null) {
      for (i = 0; i < this.props.modalData.length; i++) {
        datum = this.props.modalData[i];
        rows.push([
          [
            datum.status === "successful" ? successfulIcon : failedIcon,
            "" + datum.id + " - " + datum.name
          ],
          datum.label,
          datum.started,
          forHumans(Math.floor(datum.elapsed))
        ]);
      }
      if (this.props.modalData.length > 0) {
        total_time = Math.floor(
          this.props.modalData
            .map(datum => +datum.elapsed)
            .reduce((total, amount) => total + amount)
        );
        average_time = Math.floor(total_time / this.props.modalData.length);
      }
    }
    return (
      <Modal
        className="templateModal"
        title={this.props.modalTemplate}
        isOpen={this.props.isModalOpen}
        onClose={this.handleClose}
        actions={[
          <h4>
            Total Time {forHumans(total_time)} | Avg Time{" "}
            {forHumans(average_time)}
          </h4>,
          <Button key="cancel" variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
        ]}
      >
        <Card>
          <Table
            caption={[""]}
            cells={["Id/Name", "Cluster", "Start Time", "Total Time"]}
            rows={rows}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </Card>
      </Modal>
    );
  }
}
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
    // const modulesUrl = this.getApiUrl("modules");
    // const modulesResponse = await fetch(modulesUrl);
    // const modulesData = await modulesResponse.json();
    // const templateUrl = this.getApiUrl("templates");
    // const templateResponse = await fetch(templateUrl);
    // const templatesData = await templateResponse.json();
    // const notificationsUrl = this.getApiUrl("notifications");
    // const notificationsResponse = await fetch(notificationsUrl);
    // let notificationsData = await notificationsResponse.json();
    // const clustersUrl = this.getApiUrl("clusters");
    // const clustersResponse = await fetch(clustersUrl);
    // const clustersData = await clustersResponse.json();
    // this.setState({ modules: modulesData });
    // this.setState({ templates: templatesData });
    // this.setState({ clusters: clustersData });
    // var rightOptions = this.state.rightOptions;
    // var i = 0;
    // for (i = 0; i < clustersData.length; i++) {
    //   rightOptions.push({
    //     value: clustersData[i].system_id,
    //     label: clustersData[i].label
    //   });
    // }
    // this.setState({ rightOptions: rightOptions });

    // this.setState({ notifications: notificationsData });
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

  getApiUrl(name) {
    return (
      this.protocol + "://" + this.server + "/tower_analytics/" + name + "/"
    );
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
      leftValue: "past week",
      rightValue: "all clusters",
      notificationValue: "all",
      isAccessible: false,
      modules: [],
      templates: [],
      clusters: [],
      notifications: [],
      modalTemplate: null,
      modalData: [],
      rightOptions: [
        { value: "please choose", label: "Select Hosts", disabled: true },
        { value: "all clusters", label: "All Clusters", disabled: false }
      ],
      activeTabKey: 0,
      barChartData: [],
      lineChartData: [],
      groupedBarChartData: [],
      pieChart1Data: [],
      pieChart2Data: []
    };
    this.server = "nginx-tower-analytics2.5a9f.insights-dev.openshiftapps.com";
    //this.server = 'ci.foo.redhat.com:1337';
    this.protocol = "https";

    this.onRightToggle = this.onRightToggle.bind(this);
    this.onRightSelect = this.onRightSelect.bind(this);
    this.handleModalToggle = this.handleModalToggle.bind(this);
    this.getApiUrl = this.getApiUrl.bind(this);
    this.init = this.init.bind(this);

    this.leftChange = (value, event) => {
      this.setState({ leftValue: value });
    };
    this.rightChange = (value, event) => {
      this.setState({ rightValue: value });
    };
    this.handleNotificationChange = (value, event) => {
      this.setState({ notificationValue: value });
    };
    this.handleToggle = isAccessible => {
      this.setState({ isAccessible });
    };
    this.leftOptions = [
      { value: "please choose", label: "Select Date Range", disabled: true },
      { value: "past week", label: "Past Week", disabled: false },
      { value: "past 2 weeks", label: "Past 2 Weeks", disabled: false },
      { value: "past month", label: "Past Month", disabled: false }
    ];
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
    this.handleTabClick = (event, tabIndex) => {
      this.setState({
        activeTabKey: tabIndex
      });
    };
  }

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

  async handleModalToggle(modalTemplate) {
    var data = null;
    if (modalTemplate !== null) {
      const url = this.getApiUrl("template_jobs") + modalTemplate + "/";
      const response = await fetch(url);
      data = await response.json();
    }
    this.setState({
      modalTemplate: modalTemplate,
      isModalOpen: !this.state.isModalOpen,
      modalData: data
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
                <h1>Job Status</h1>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <FormSelect
                    value={this.state.leftValue}
                    onChange={this.leftChange}
                    aria-label="Select Date Range"
                    style={{ margin: "2px 10px" }}
                  >
                    {this.leftOptions.map((option, index) => (
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
                    {this.state.rightOptions.map((option, index) => (
                      <FormSelectOption
                        isDisabled={option.disabled}
                        key={index}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </FormSelect>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-end",
                      padding: "5px",
                      marginLeft: "5px"
                    }}
                  >
                    <label style={{ marginRight: "10px" }}>Accessibility</label>
                    <Switch
                      // label={'Accessibility'}
                      isChecked={this.state.isAccessible}
                      onChange={this.handleToggle}
                      aria-label="Accessibility enabled"
                    />
                  </div>
                  {/* // </div> */}
                </div>
              </CardHeader>
              <CardBody>
                {barChartData.length > 0 && (
                  <BarChart
                    margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
                    id="d3-chart-root"
                    data={barChartData}
                    value={this.state.leftValue}
                    isAccessible={this.state.isAccessible}
                    getApiUrl={this.getApiUrl}
                  />
                )}
                {/* {rightValue !== "all clusters" && (
                                    <LineChart
                                        width={700}
                                        height={350}
                                        id="d3-chart-root"
                                        value={this.state.leftValue}
                                        cluster={this.state.rightValue}
                                        isAccessible={this.state.isAccessible}
                                        getApiUrl={this.getApiUrl}
                                    />
                                )} */}
                {/* {lineChartData.length > 0 && (
                                    <LineChart
                                        margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
                                        id="d3-line-chart-root"
                                        data={lineChartData}
                                        value={this.state.leftValue}
                                        cluster={this.state.rightValue}
                                        isAccessible={this.state.isAccessible}
                                        getApiUrl={this.getApiUrl}
                                    />
                                )} */}
              </CardBody>
            </Card>
            <div
              className="dataCard"
              style={{ display: "flex", marginTop: "20px" }}
            >
              <TemplatesList
                templates={[
                  { name: "Template 1", type: "Playbook Run" },
                  { name: "Template 2", type: "Workflow" },
                  { name: "Template 3", type: "Playbook Run" }
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
            <TemplateModal
              modalTemplate={modalTemplate}
              isModalOpen={isModalOpen}
              onModalClose={this.handleModalToggle}
              getApiUrl={this.getApiUrl}
              modalData={modalData}
            />
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
              <CardBody>
                {groupedBarChartData.length > 0 && activeTabKey == 1 && (
                  <GroupedBarChart
                    margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
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
                      value={this.state.leftValue}
                      onChange={this.leftChange}
                      aria-label="Select Date Range"
                      style={{ margin: "2px 10px", width: "33%" }}
                    >
                      {this.leftOptions.map((option, index) => (
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
                    <DonutChart
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
                      value={this.state.leftValue}
                      onChange={this.leftChange}
                      aria-label="Select Date Range"
                      style={{ margin: "2px 10px", width: "33%" }}
                    >
                      {this.leftOptions.map((option, index) => (
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
                    <DonutChart
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
