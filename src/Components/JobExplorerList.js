import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
    DataListCell,
    DataListContent,
    DataList,
    DataListItem,
    DataListItemRow,
    DataListItemCells,
    DataListToggle
} from '@patternfly/react-core';

import { ArrowIcon as PFArrowIcon } from '@patternfly/react-icons';

import LoadingState from '../Components/LoadingState';
import { formatDateTime, formatJobType } from '../Utilities/helpers';
import JobStatus from './JobStatus';

const headerLabels = [
    'Id/Name',
    'Status',
    'Cluster',
    'Organization',
    'Type'
];

const ArrowIcon = styled(PFArrowIcon)`
  margin-left: 7px;
`;

const buildHeader = labels => (
    <DataListItemRow style={ { paddingLeft: '94px', fontWeight: '800' } }>
        { labels.map(label => (
            <DataListCell key={ label }>{ label }</DataListCell>
        )) }
    </DataListItemRow>
);

const buildListRow = (items, ariaLabel, ariaLabelledBy) => {
    const [ isExpanded, setIsExpanded ] = useState([]);
    return (
        <DataList aria-label={ ariaLabel }>
            { items.map((item, count) => {
                const toggle = id => {
                    const expanded = isExpanded;
                    const idx = expanded.indexOf(id);
                    const newExpanded =
            idx >= 0
                ? [
                    ...expanded.slice(0, idx),
                    ...expanded.slice(idx + 1, expanded.length)
                ]
                : [ ...expanded, id ];
                    setIsExpanded(newExpanded);
                };

                return (
                    <DataListItem key={ item.id.id } aria-labelledby={ ariaLabelledBy } isExpanded={ isExpanded.includes(`${item.id.id}-toggle`) } >
                        <DataListItemRow key={ item.id.id }>
                            <DataListToggle
                                id={ `${item.id.id}-toggle` }
                                aria-controls={ `${item.id.id}-expand` }
                                onClick={ () => toggle(`${item.id.id}-toggle`) }
                                isExpanded={ isExpanded.includes(`${item.id.id}-toggle`) }
                            />
                            <DataListItemCells
                                dataListCells={ [
                                    <DataListCell key={ count++ }>
                                        <a href={ item.id.tower_link } target='_blank' rel='noopener noreferrer'>
                                            { `${item.id.id} - ${item.id.template_name}` } <ArrowIcon />
                                        </a>
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        <JobStatus status={ item.status } />
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { item.cluster_name }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>{ item.org_name }</DataListCell>,
                                    <DataListCell key={ count++ }>{ formatJobType(item.job_type) }</DataListCell>
                                ] }
                            />
                        </DataListItemRow>
                        <DataListContent
                            aria-label={ `${item.id.id}-details` }
                            id={ '${item.id.id}' }
                            isHidden={ !isExpanded.includes(`${item.id.id}-toggle`) }
                        >
                            <DataListItemCells
                                dataListCells={ [
                                    <DataListCell key={ count++ }>
                                        Created: { formatDateTime(item.created) }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        Started: { formatDateTime(item.started) }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        Finished: { formatDateTime(item.finished) }
                                    </DataListCell>
                                ] }
                            />
                        </DataListContent>
                    </DataListItem>
                );
            }) }
        </DataList>
    );
};

const AllJobsTemplate = ({ jobs }) => {
    return buildListRow(jobs, 'All jobs view', 'all-jobs');
};

const JobExplorerList = ({ jobs }) => (
  <>
    { jobs.length <= 0 && <LoadingState /> }
    <>
      { buildHeader(headerLabels) }
      <AllJobsTemplate jobs={ jobs } />
    </>
  </>
);

JobExplorerList.propTypes = {
    jobs: PropTypes.array
};

AllJobsTemplate.propTypes = {
    jobs: PropTypes.array
};

export default JobExplorerList;
