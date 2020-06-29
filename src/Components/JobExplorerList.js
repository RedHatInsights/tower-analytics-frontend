import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
    DataListCell,
    DataListContent,
    DataList,
    DataListItem,
<<<<<<< HEAD
    DataListItemRow as PFDataListItemRow,
    DataListItemCells as PFDataListItemCells,
    DataListToggle
} from '@patternfly/react-core';

import { ExternalLinkAltIcon as PFExternalLinkIcon } from '@patternfly/react-icons';

<<<<<<< HEAD
import LoadingState from '../Components/LoadingState';
import { formatDateTime, formatJobType } from '../Utilities/helpers';
import JobStatus from './JobStatus';
=======
import StatusIcon from '../Icons/StatusIcon/StatusIcon';
import LoadingState from '../Components/LoadingState';
import { formatDateTime, formatJobType, formatJobStatus } from '../Utilities/helpers';
>>>>>>> Squashed commit of the following:
=======
    DataListItemRow,
    DataListItemCells,
    DataListToggle
} from '@patternfly/react-core';

import { ArrowIcon as PFArrowIcon } from '@patternfly/react-icons';

import StatusIcon from '../Icons/StatusIcon/StatusIcon';
import LoadingState from '../Components/LoadingState';
import { formatDateTime, formatJobType, formatJobStatus } from '../Utilities/helpers';
>>>>>>> Squashed commit of the following:

const headerLabels = [
    'Id/Name',
    'Status',
    'Cluster',
    'Organization',
    'Type'
];

<<<<<<< HEAD
const ExternalLinkIcon = styled(PFExternalLinkIcon)`
  margin-left: 7px;
  color: var(--pf-global--Color--400);
`;

const DataListItemCells = styled(PFDataListItemCells)`
align-items: center;
margin-top: 5px;
`;

const DataListItemRow = styled(PFDataListItemRow)`
align-items: center; 
`;

const mobileBreakpoint = 765;

const buildHeader = labels => (
    <DataListItemRow style={ { paddingLeft: '94px', fontWeight: '800' } }>
        { labels.map(label => (
            <DataListCell key={ label }>
                { label }
                { label === 'Id/Name' &&
                    <ExternalLinkIcon />
                }
            </DataListCell>
=======
const ArrowIcon = styled(PFArrowIcon)`
  margin-left: 7px;
`;

const buildHeader = labels => (
    <DataListItemRow style={ { paddingLeft: '94px', fontWeight: '800' } }>
        { labels.map(label => (
            <DataListCell key={ label }>{ label }</DataListCell>
>>>>>>> Squashed commit of the following:
        )) }
    </DataListItemRow>
);

<<<<<<< HEAD
const buildListRow = (items, ariaLabel, ariaLabelledBy, windowWidth) => {
    const [ isExpanded, setIsExpanded ] = useState([]);
    return (
        <DataList aria-label={ ariaLabel } isCompact>
=======
const buildListRow = (items, ariaLabel, ariaLabelledBy) => {
    const [ isExpanded, setIsExpanded ] = useState([]);
    return (
        <DataList aria-label={ ariaLabel }>
>>>>>>> Squashed commit of the following:
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
<<<<<<< HEAD
                        <DataListItemRow>
=======
                        <DataListItemRow key={ item.id.id }>
>>>>>>> Squashed commit of the following:
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
<<<<<<< HEAD
                                            { windowWidth < mobileBreakpoint &&
                                             <span style={ { color: 'initial', fontWeight: 'bold' } }>
                                                 Id/Name<ExternalLinkIcon />:
                                             </span>
                                            }
                                            &nbsp;
                                            { `${item.id.id} - ${item.id.template_name}` }
                                        </a>
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
<<<<<<< HEAD
<<<<<<< HEAD
=======
                                        { windowWidth < mobileBreakpoint &&
                                            <span style={ { color: 'initial', fontWeight: 'bold' } }>Status:</span>
                                        }
                                            &nbsp;
>>>>>>> Handle long dropdowns by setting max height. Use compact datalist. Conditionally render datacell item labels when widnow is mobile sized. Remove datalist headers when window is mobile size.
                                        <JobStatus status={ item.status } />
=======
                                        <StatusIcon status={ item.status } />{ formatJobStatus(item.status) }
>>>>>>> Squashed commit of the following:
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { windowWidth < mobileBreakpoint &&
                                         <span style={ { color: 'initial', fontWeight: 'bold' } }>Cluster:</span>
                                        }
                                        &nbsp;
                                        { item.cluster_name }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { windowWidth < mobileBreakpoint &&
                                         <span style={ { color: 'initial', fontWeight: 'bold' } }>Organization:</span>
                                        }
                                        &nbsp;
                                        { item.org_name }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { windowWidth < mobileBreakpoint &&
                                         <span style={ { color: 'initial', fontWeight: 'bold' } }>Type:</span>
                                        }
                                         &nbsp;
                                        { formatJobType(item.job_type) }
                                    </DataListCell>
=======
                                            { `${item.id.id} - ${item.id.template_name}` } <ArrowIcon />
                                        </a>
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        <StatusIcon status={ item.status } />{ formatJobStatus(item.status) }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { item.cluster_name }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>{ item.org_name }</DataListCell>,
                                    <DataListCell key={ count++ }>{ formatJobType(item.job_type) }</DataListCell>
>>>>>>> Squashed commit of the following:
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

<<<<<<< HEAD
const AllJobsTemplate = ({ jobs, windowWidth }) => {
    return buildListRow(jobs, 'All jobs view', 'all-jobs', windowWidth);
};

const JobExplorerList = ({ jobs, windowWidth }) => (
  <>
<<<<<<< HEAD
    { jobs.length <= 0 && <LoadingState /> }
    <>
<<<<<<< HEAD
      { buildHeader(headerLabels) }
=======
    {jobs.length <= 0 && <LoadingState />}
    <>
      {buildHeader(headerLabels)}
>>>>>>> Squashed commit of the following:
      <AllJobsTemplate jobs={ jobs } />
=======
      { windowWidth > mobileBreakpoint && buildHeader(headerLabels) }
      <AllJobsTemplate jobs={ jobs } windowWidth={ windowWidth }/>
>>>>>>> Handle long dropdowns by setting max height. Use compact datalist. Conditionally render datacell item labels when widnow is mobile sized. Remove datalist headers when window is mobile size.
=======
const AllJobsTemplate = ({ jobs }) => {
    return buildListRow(jobs, 'All jobs view', 'all-jobs');
};

const JobExplorerList = ({ jobs }) => (
  <>
    {jobs.length <= 0 && <LoadingState />}
    <>
      {buildHeader(headerLabels)}
      <AllJobsTemplate jobs={ jobs } />
>>>>>>> Squashed commit of the following:
    </>
  </>
);

JobExplorerList.propTypes = {
<<<<<<< HEAD
    jobs: PropTypes.array,
    windowWidth: PropTypes.number
};

AllJobsTemplate.propTypes = {
    jobs: PropTypes.array,
    windowWidth: PropTypes.number
=======
    jobs: PropTypes.array
};

AllJobsTemplate.propTypes = {
    jobs: PropTypes.array
>>>>>>> Squashed commit of the following:
};

export default JobExplorerList;
