/* eslint-disable */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './sample-page.scss';
import BarChart from './BarChart.js';

import { Section, Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { WarningTriangleIcon } from '@patternfly/react-icons';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    DataList,
    DataListCell,
    DataListItem,
    Dropdown,
    DropdownItem,
    DropdownSeparator,
    DropdownToggle,
    Modal,
} from '@patternfly/react-core';

import SampleComponent from '../../PresentationalComponents/SampleComponent/sample-component';
// const PageHeader2 = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header'));
// const PageHeaderTitle2 = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header-title'));

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class SamplePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isLeftOpen: false,
          isRightOpen: false,
          isNotificationsOpen: false,
          isModalOpen: false
        };

        this.onLeftToggle = this.onLeftToggle.bind(this);
        this.onRightToggle = this.onRightToggle.bind(this);
        this.onNotificationsToggle = this.onNotificationsToggle.bind(this);
        this.onLeftSelect = this.onLeftSelect.bind(this);
        this.onRightSelect = this.onRightSelect.bind(this);
        this.onNotificationsSelect = this.onNotificationsSelect.bind(this);
        this.handleModalToggle = this.handleModalToggle.bind(this);
    }

    onLeftToggle (isLeftOpen) {
        this.setState({
          isLeftOpen
        });
    };

    onRightToggle (isRightOpen) {
        this.setState({
          isRightOpen
        });
    };

    onNotificationsToggle (isNotificationsOpen) {
        this.setState({
          isNotificationsOpen
        });
    };

    onLeftSelect (event) {
        this.setState({
          isLeftOpen: !this.state.isLeftOpen
        });
    };

    onRightSelect (event) {
        this.setState({
          isRightOpen: !this.state.isRightOpen
        });
    };

    onNotificationsSelect (event) {
        this.setState({
          isNotificationsOpen: !this.state.isNotificationsOpen
        });
    };

    handleModalToggle () {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    };

    render() {
        const {
          isLeftOpen,
          isRightOpen,
          isNotificationsOpen,
          isModalOpen
        } = this.state;

        const dataListCellStyle = {
            display: 'flex',
            justifyContent: 'flex-end'
        };

        const dropdownItems = [
          <DropdownItem key="link">Link</DropdownItem>,
          <DropdownItem key="action" component="button">
            Action
          </DropdownItem>,
          <DropdownItem key="disabled link" isDisabled>
            Disabled Link
          </DropdownItem>,
          <DropdownItem key="disabled action" isDisabled component="button">
            Disabled Action
          </DropdownItem>,
          <DropdownSeparator key="separator" />,
          <DropdownItem key="separated link">Separated Link</DropdownItem>,
          <DropdownItem key="separated action" component="button">
            Separated Action
          </DropdownItem>
        ];

        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='Tower Analytics'/>
                </PageHeader>
                <Main>
                    <Card>
                        <CardHeader style={{ borderBottom: '2px solid #ebebeb', display: 'flex', justifyContent: 'space-between' }}>
                            <h1>Job Status</h1>
                            <div>
                                <Dropdown
                                    style={{ border: '1px solid #ededed', borderBottomColor: '#282d33', marginRight: '20px' }}
                                    onSelect={this.onLeftSelect}
                                    toggle={<DropdownToggle onToggle={this.onLeftToggle}>Left Dropdown</DropdownToggle>}
                                    isOpen={isLeftOpen}
                                    dropdownItems={dropdownItems}
                                />
                                <Dropdown
                                    style={{ border: '1px solid #ededed', borderBottomColor: '#282d33' }}
                                    onSelect={this.onRightSelect}
                                    toggle={<DropdownToggle onToggle={this.onRightToggle}>Right Dropdown</DropdownToggle>}
                                    isOpen={isRightOpen}
                                    dropdownItems={dropdownItems}
                                />
                            </div>
                        </CardHeader>
                        <CardBody>
                            <BarChart width={ 700 } height={ 350 } id='bar-chart-root' />
                        </CardBody>
                    </Card>
                    <div className="dataCard" style={{ display: 'flex', marginTop: '20px' }}>
                        <DataList aria-label="Simple data list example">
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <h3>Top Templates</h3>
                                </DataListCell>
                                <DataListCell style={ dataListCellStyle }>
                                    <h3>Type</h3>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <span style={{ color: '#007bba', cursor: 'pointer' }} onClick={this.handleModalToggle}>Template Name 1</span>
                                </DataListCell>
                                <DataListCell style={ dataListCellStyle }>
                                    <Badge isRead>Playbook Run</Badge>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item2">
                                <DataListCell>
                                <span style={{ color: '#007bba', cursor: 'pointer' }} onClick={this.handleModalToggle}>Template Name 2</span>
                                </DataListCell>
                                <DataListCell style={ dataListCellStyle }>
                                    <Badge isRead>Workflow</Badge>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <span style={{ color: '#007bba', cursor: 'pointer' }} onClick={this.handleModalToggle}>Template Name 3</span>
                                </DataListCell>
                                <DataListCell style={ dataListCellStyle }>
                                    <Badge isRead>Playbook Run</Badge>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <span style={{ color: '#007bba', cursor: 'pointer' }} onClick={this.handleModalToggle}>Template Name 4</span>
                                </DataListCell>
                                <DataListCell style={ dataListCellStyle }>
                                    <Badge isRead>Playbook Run</Badge>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <span style={{ color: '#007bba', cursor: 'pointer' }} onClick={this.handleModalToggle}>Template Name 5</span>
                                </DataListCell>
                                <DataListCell style={ dataListCellStyle }>
                                    <Badge isRead>Playbook Run</Badge>
                                </DataListCell>
                            </DataListItem>
                        </DataList>
                        <DataList aria-label="Simple data list example">
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <h3>Top Modules</h3>
                                </DataListCell>
                                <DataListCell style={ dataListCellStyle }>
                                    <h3>Usage</h3>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <span>Module Name 1</span>
                                </DataListCell>
                                <DataListCell style={ dataListCellStyle }>
                                    <Badge isRead>5</Badge>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item2">
                                <DataListCell>
                                    <span>Module Name 2</span>
                                </DataListCell>
                                <DataListCell style={ dataListCellStyle }>
                                    <Badge isRead>11</Badge>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <span>Module Name 3</span>
                                </DataListCell>
                                <DataListCell style={ dataListCellStyle }>
                                    <Badge isRead>22</Badge>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <span>Module Name 4</span>
                                </DataListCell>
                                <DataListCell style={ dataListCellStyle }>
                                    <Badge isRead>17</Badge>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <span>Module Name 5</span>
                                </DataListCell>
                                <DataListCell style={ dataListCellStyle }>
                                    <Badge isRead>7</Badge>
                                </DataListCell>
                            </DataListItem>
                        </DataList>
                        <DataList style={{ flex: '1' }} aria-label="Simple data list example">
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <h3>Notifications</h3>
                                </DataListCell>
                                <DataListCell style={ dataListCellStyle }>
                                <Dropdown
                                    style={{ border: '1px solid #ededed', borderBottomColor: '#282d33' }}
                                    onSelect={this.onNotificationsSelect}
                                    toggle={<DropdownToggle onToggle={this.onNotificationsToggle}>Notifications Dropdown</DropdownToggle>}
                                    isOpen={isNotificationsOpen}
                                    dropdownItems={dropdownItems}
                                />
                                </DataListCell>
                            </DataListItem>

                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <span><WarningTriangleIcon style={{ color: '#db524b', marginRight: '5px' }}/>It's 3am, time to create some chaos </span>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item2">
                                <DataListCell>
                                    <span><WarningTriangleIcon style={{ color: '#f0ad37', marginRight: '5px' }}/>why use post when this sofa is here.</span>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <span>Kitty scratches couch bad kitty</span>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <span>lick the curtain just to be annoying or bite</span>
                                </DataListCell>
                            </DataListItem>
                            <DataListItem aria-labelledby="simple-item1">
                                <DataListCell>
                                    <span>off human's toes meow loudly just to annoy owners.</span>
                                </DataListCell>
                            </DataListItem>
                        </DataList>
                    </div>
                    <Modal
                        title={'Template Name 1'}
                        isOpen={isModalOpen}
                        onClose={this.handleModalToggle}
                        actions={[
                            <Button key="cancel" variant="secondary" onClick={this.handleModalToggle}>Close</Button>
                        ]}
                    >
                        {/* Table */}
                        <Card>
                            <h1>hi</h1>
                        </Card>
                    </Modal>
                </Main>
            </React.Fragment>
        );
    }
}

export default withRouter(SamplePage);
