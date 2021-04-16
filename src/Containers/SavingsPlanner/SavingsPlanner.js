/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
    preflightRequest,
    readPlans
} from '../../Api';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import useApi from '../../Utilities/useApi';

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
    KebabToggle,
    Label,
    Gallery
} from '@patternfly/react-core';

import { ChartBarIcon, CheckIcon } from '@patternfly/react-icons';

const SavingsPlanner = () => {
    const [
        {
            isLoading,
            isSuccess,
            error,
            data: { items: data = [] }
        },
        setData
    ] = useApi({ items: [] });
    useEffect(() => {
        const fetchEndpoints = () => {
            setData(readPlans({ params: { limit: 10 } }));
        };

        fetchEndpoints();
    }, []);

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={'Savings Planner'} />
            </PageHeader>
                <Main>
                <Gallery hasGutter>
                    { isSuccess && data.length > 0 && data.map(i => (
                        <Card isHoverable isCompact>
                            <CardHeader>
                                <CardHeaderMain>
                                    <CardTitle>{i.name}</CardTitle>
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
                                <p>{i.description}</p>
                                <p>Frequency: {i.frequency_period}</p>
                                <p>Template: </p>
                                <p>Automation status{' '}
                                    <Label variant="outline" color="green" icon={<CheckIcon />}>
                                        Running
                                    </Label></p>
                                <p>Last updated: {i.modified}</p>
                            </CardBody>
                            <CardFooter>
                                <Label>{i.category}</Label>
                            </CardFooter>
                        </Card>
                    ))}
                </Gallery>
                </Main>
        </React.Fragment>
    );
};

SavingsPlanner.propTypes = {
};

export default SavingsPlanner;
