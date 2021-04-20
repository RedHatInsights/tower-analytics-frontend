/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
    preflightRequest,
    readPlanOptions,
    readPlans
} from '../../Api';

import { Paths } from '../../paths';

import { formatDateTime } from '../../Utilities/helpers';

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

import { ChartBarIcon, CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import styled from 'styled-components';
import { stringify } from 'query-string';


const CardLabel = styled.span`
  margin-right: 5px;
`;

const SavingsPlanner = () => {
    let history = useHistory();
    
    const redirectToJobExplorer = templateId => {
        const { jobExplorer } = Paths;
        const initialQueryParams = {
            quick_date_range: 'last_30_days',
            status: ['failed', 'successful'],
            template_id: [ templateId ]
        };
        const search = stringify(initialQueryParams, { arrayFormat: 'bracket' });
        history.push({
            pathname: jobExplorer,
            search
        });
    }

    const [
        {
            isLoading,
            isSuccess,
            error,
            data: { items: data = [] }
        },
        setData
    ] = useApi({ items: [] });
    const [ options, setOptions ] = useApi({});

    useEffect(() => {
        const fetchEndpoints = () => {
            setData(readPlans({ params: { limit: 10 } }));
            setOptions(readPlanOptions());
        };

        fetchEndpoints();
    }, []);

    const showTemplate = id => {
        if (!id) {
            return;
        };
        if (options.isSuccess) {
            const selectedTemplate = options.data.templates.filter(t => t.id === id);
            return(
                <a onClick={() => redirectToJobExplorer(selectedTemplate[0].id)}>{selectedTemplate[0].name}</a>
            );
        }
    }

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={'Savings Planner'} />
            </PageHeader>
                <Main>
                <Gallery hasGutter>
                    { isSuccess && data.map(i => (
                        <Card isHoverable isCompact key={i.id}>
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
                                {i.description ? (<p>{i.description}</p>) : null}
                                <div>
                                    <CardLabel>Frequency</CardLabel> {i.frequency_period ? i.frequency_period : (<em>None</em>)}
                                </div>
                                <div>
                                    <CardLabel>Template</CardLabel> {i.template_id ? showTemplate(i.template_id) : (<em>None</em>)}
                                </div>
                                <div>
                                    <CardLabel>Automation status</CardLabel>
                                        { i.automation_status.status === 'successful' ? (
                                            <Label variant="outline" color="green" icon={<CheckCircleIcon />}>
                                                Running
                                            </Label>
                                        ) : (
                                            <Label variant="outline" color="red" icon={<ExclamationCircleIcon />}>
                                                Not Running
                                            </Label>
                                        )}
                                </div>
                                <div>
                                    <CardLabel>Last updated</CardLabel> {formatDateTime(i.modified)}
                                </div>
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
