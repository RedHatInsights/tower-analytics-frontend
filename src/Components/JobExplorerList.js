/* eslint-disable react/jsx-key */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
    DataListCell,
    DataList,
    DataListItem,
    DataListItemRow,
    DataListItemCells
} from '@patternfly/react-core';

import StatusIcon from '../Icons/StatusIcon/StatusIcon';
import LoadingState from '../Components/LoadingState';

const headerLabels = [
    'Id/Name',
    'Status',
    'Cluster',
    'Organization',
    'Job Type',
    'Finished'
];

const buildHeader = (labels) => (
    <DataListItemRow>
        { labels.map((label) =>
            <DataListCell key = { label }>
                { label }
            </DataListCell>
        ) }
    </DataListItemRow>
);

const buildListRow = (items, ariaLabel, ariaLabelledBy) => {
    return (
        <DataList aria-label={ ariaLabel }>
            { items.map((item, count) => {
                return (
                    <DataListItem key={ item.id } aria-labelledby={ ariaLabelledBy }>
                        <DataListItemRow key={ item.id }>
                            <DataListItemCells
                                dataListCells={ [
                                    <DataListCell key={ count++ }>
                                        { `${item.id} - ${item.template_name}` }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        <StatusIcon status={ item.status } />
                                        { item.status }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { item.cluster_id }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { item.org_id }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { item.job_ype }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { moment(item.finished).format() }
                                    </DataListCell>
                                ] }
                            />
                        </DataListItemRow>
                    </DataListItem>
                );
            }) }
        </DataList>);
};

const AllJobsTemplate = ({ jobs }) => {
    return buildListRow(jobs, 'All jobs view', 'all-jobs');
};

const FailedJobsTemplate = ({ jobs }) => {
    return buildListRow(
        jobs.filter((job) => job.status === 'failed'),
        'Failed jobs view',
        'failed-jobs'
    );
};

const SuccessfulJobsTemplate = ({ jobs }) => {
    return buildListRow(
        jobs.filter((job) => job.status === 'successful'),
        'Successful jobs view',
        'successful-jobs'
    );
};

const JobExplorerList = ({ filterByStatus, filterByType, jobs }) => (
    <>
        { jobs.length <= 0 && <LoadingState /> }
        { filterByStatus === '' && (
          <>
            { buildHeader(headerLabels) }
            <AllJobsTemplate jobs={ jobs } />
          </>
        ) }
        { filterByStatus === 'failed' && (
          <>
            { buildHeader(headerLabels) }
            <FailedJobsTemplate jobs={ jobs } />
          </>
        ) }
        { filterByStatus === 'success' && (
          <>
            { buildHeader(headerLabels) }
            <SuccessfulJobsTemplate jobs={ jobs } />
          </>
        ) }
    </>
);

JobExplorerList.propTypes = {
    jobs: PropTypes.array,
    filterBy: PropTypes.string
};

AllJobsTemplate.propTypes = {
    jobs: PropTypes.array
};

FailedJobsTemplate.propTypes = {
    jobs: PropTypes.array
};

SuccessfulJobsTemplate.propTypes = {
    jobs: PropTypes.array
};

export default JobExplorerList;
