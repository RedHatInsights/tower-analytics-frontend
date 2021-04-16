/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
    Card,
    CardHeader,
    CardHeaderMain,
    CardActions,
    CardTitle,
    CardBody,
    CardFooter,
    Checkbox,
    Dropdown,
    DropdownToggle,
    DropdownItem,
    DropdownSeparator,
    KebabToggle,
    Flex, FlexItem,
    Label,
    Gallery
} from '@patternfly/react-core';

import { ChartBarIcon, CheckIcon } from '@patternfly/react-icons';

const SavingsPlanner = () => {
    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={'Savings Planner'} />
            </PageHeader>
                <Main>
                <Gallery hasGutter>
                    <Card isHoverable isCompact>
                            <CardHeader>
                                <CardHeaderMain>
                                    <CardTitle>Check Uptime</CardTitle>
                                </CardHeaderMain>
                                <CardActions>
                                    <Dropdown
                                        onSelect={() => { }}
                                        toggle={<KebabToggle onToggle={() => { }} />}
                                        isOpen={false}
                                        isPlain
                                        dropdownItems={[]}
                                        position={'right'}
                                    />
                                    <Checkbox
                                        isChecked={false}
                                        onChange={() => { }}
                                        aria-label="card checkbox example"
                                        id="check-1"
                                        name="check1"
                                    />
                                </CardActions>
                            </CardHeader>
                            <CardBody>
                                <p>Farm-to-table vice vape edison bulb kitsch street art gentrify intelligentsia meditation snackwave.</p>
                                <p>Frequency: </p>
                                <p>Template: </p>
                                <p>Automation status{' '}
                                    <Label variant="outline" color="green" icon={<CheckIcon />}>
                                        Running
                                    </Label></p>
                                <p>Last updated: </p>
                            </CardBody>
                            <CardFooter>
                                <Label>Docker</Label>
                            </CardFooter>
                        </Card>
                
                    <Card isHoverable isCompact>
                            <CardHeader>
                                <CardHeaderMain>
                                    <CardTitle>Configure Cron Jobs</CardTitle>
                                </CardHeaderMain>
                                <CardActions>
                                    <Dropdown
                                        onSelect={() => { }}
                                        toggle={<KebabToggle onToggle={() => { }} />}
                                        isOpen={false}
                                        isPlain
                                        dropdownItems={[]}
                                        position={'right'}
                                    />
                                    <Checkbox
                                        isChecked={false}
                                        onChange={() => { }}
                                        aria-label="card checkbox example"
                                        id="check-1"
                                        name="check1"
                                    />
                                </CardActions>
                            </CardHeader>
                            <CardBody>
                                <p>Health goth kogi vaporware gluten-free forage franzen.</p>
                                <p>Frequency: </p>
                                <p>Template: </p>
                                <p>Automation status{' '}
                                    <Label variant="outline" color="red" icon={<CheckIcon />}>
                                        Not Running
                                    </Label></p>
                                <p>Last updated: </p>
                            </CardBody>
                            <CardFooter>
                                <Label>Server</Label>
                            </CardFooter>
                        </Card>
                    <Card isHoverable isCompact>
                            <CardHeader>
                                <CardHeaderMain>
                                    <CardTitle>Gather Stats</CardTitle>
                                </CardHeaderMain>
                                <CardActions>
                                    <Dropdown
                                        onSelect={() => { }}
                                        toggle={<KebabToggle onToggle={() => { }} />}
                                        isOpen={false}
                                        isPlain
                                        dropdownItems={[]}
                                        position={'right'}
                                    />
                                    <Checkbox
                                        isChecked={false}
                                        onChange={() => { }}
                                        aria-label="card checkbox example"
                                        id="check-1"
                                        name="check1"
                                    />
                                </CardActions>
                            </CardHeader>
                            <CardBody>
                                <p>BodCopper mug blog truffaut chambray selvage vinyl fixie kombucha DIY ugh occupy letterpress.</p>
                                <p>Frequency: </p>
                                <p>Template: </p>
                                <p>Automation status{' '}
                                    <Label variant="outline" color="green" icon={<CheckIcon />}>
                                        Running
                                    </Label></p>
                                <p>Last updated: </p>
                            </CardBody>
                            <CardFooter>
                                <Label>Networking</Label>
                            </CardFooter>
                        </Card>
                </Gallery>
                </Main>
        </React.Fragment>
    );
};

SavingsPlanner.propTypes = {
};

export default SavingsPlanner;
