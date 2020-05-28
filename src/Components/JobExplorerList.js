/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
    DataListCell,
    DataListContent,
    DataList,
    DataListItem,
    DataListItemRow,
    DataListItemCells,
    DataListToggle
} from '@patternfly/react-core';

import StatusIcon from '../Icons/StatusIcon/StatusIcon';
import LoadingState from '../Components/LoadingState';
import { formatDateTime, formatJobType, formatJobStatus } from '../Utilities/helpers';

const headerLabels = [
    'Id/Name',
    'Status',
    'Cluster',
    'Organization',
    'Template',
    'Type'
];

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
                    <DataListItem key={ item.id } aria-labelledby={ ariaLabelledBy } isExpanded={ isExpanded.includes(`${item.id}-toggle`) } >
                        <DataListItemRow key={ item.id }>
                            <DataListToggle
                                id={ `${item.id}-toggle` }
                                aria-controls={ `${item.id}-expand` }
                                onClick={ () => toggle(`${item.id}-toggle`) }
                                isExpanded={ isExpanded.includes(`${item.id}-toggle`) }
                            />
                            <DataListItemCells
                                dataListCells={ [
                                    <DataListCell key={ count++ }>
                                        { `${item.id} - ${item.cluster_name}` }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        <StatusIcon status={ item.status } />{ formatJobStatus(item.status) }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { item.cluster_name }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>{ item.org_name }</DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { item.template_name }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>{ formatJobType(item.job_type) }</DataListCell>
                                ] }
                            />
                        </DataListItemRow>
                        <DataListContent
                            aria-label={ `${item.id}-details` }
                            id={ '${item.id}' }
                            isHidden={ !isExpanded.includes(`${item.id}-toggle`) }
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
    {jobs.length <= 0 && <LoadingState />}
    <>
      {buildHeader(headerLabels)}
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
