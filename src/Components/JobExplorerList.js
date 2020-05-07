/* eslint-disable react/jsx-key */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
    DataList,
    DataListItemRow,
    DataListItemCells,
    DataListCell
} from '@patternfly/react-core';

import StatusIcon from '../Icons/StatusIcon/StatusIcon';

const headerLabels = [
    'Id/Name',
    'Status',
    'Cluster',
    'Organization',
    'Template',
    'Job Type',
    'Finished'
];

const jobsListHeader = (labels) => (
    <DataListItemRow>
        { labels.map((label) =>
            <DataListCell key = { label }>
                { label }
            </DataListCell>
        ) }
    </DataListItemRow>
);

const AllJobsTemplate = ({ jobs }) =>
    jobs.map(
        ({ job_name: name, job_type: type, org_id: org, cluster_id: cluster, template_name: template, id, finished, status }) => {
            return (
                <DataList>
                    <DataListItemRow key={ id }>
                        <DataListItemCells
                            dataListCells={ [
                                <DataListCell key={ name }>
                                    { `${id} - ${name}` }
                                </DataListCell>,
                                <DataListCell key={ status }>
                                    <StatusIcon status={ status } />
                                    { status }
                                </DataListCell>,
                                <DataListCell key={ cluster }>
                                    { cluster }
                                </DataListCell>,
                                <DataListCell key={ org }>
                                    { org }
                                </DataListCell>,
                                <DataListCell key={ template }>
                                    { template }
                                </DataListCell>,
                                <DataListCell key={ type }>
                                    { type }
                                </DataListCell>,
                                <DataListCell key={ finished }>
                                    { moment(finished).format() }
                                </DataListCell>
                            ] }
                        />
                    </DataListItemRow>
                </DataList>
            );
        }
    );

const JobExplorerList = ({ jobs }) => (
    <React.Fragment>
        { jobsListHeader(headerLabels) }
        <AllJobsTemplate jobs={ jobs } />
    </React.Fragment>
);

JobExplorerList.propTypes = {
    jobs: PropTypes.array
};

AllJobsTemplate.propTypes = {
    jobs: PropTypes.array
};

export default JobExplorerList;
