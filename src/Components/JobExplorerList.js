/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
    DataListCell as PFDataListCell,
    DataListContent,
    DataList,
    DataListItem,
    DataListItemRow,
    DataListItemCells as PFDataListItemCells,
    DataListToggle
} from '@patternfly/react-core';

import { ArrowIcon as PFArrowIcon } from '@patternfly/react-icons';

import StatusIcon from '../Icons/StatusIcon/StatusIcon';
import LoadingState from '../Components/LoadingState';
import { formatDateTime, formatJobType, formatJobStatus } from '../Utilities/helpers';

const headerLabels = [
    'Id/Name',
    'Status',
    'Cluster',
    'Organization',
    'Type'
];

const ArrowIcon = styled(PFArrowIcon)`
  margin-left: 7px;
  color: var(--pf-global--palette--black-500);
`;

const DataListCell = styled(PFDataListCell)`
    display: flex;
    align-items: flex-start;
`;

const DataListItemCells = styled(PFDataListItemCells)`
    padding-bottom: 0;
    @media (max-width: 1120px) {
        flex-direction: column;
    }
`;

const StyledStatusIcon = styled(StatusIcon)`
    margin-right: 15px;
`;

const Label = styled.span`
    margin-right: 5px;
`;

const buildHeader = labels => (
    <DataListItemRow style={ { paddingLeft: '94px', fontWeight: '800' } }>
        { labels.map(label => {
            if (label === 'Id/Name') {
                return (
                    <DataListCell key={ label } style={ { alignItems: 'center' } }>
                        { label }
                        <ArrowIcon />
                    </DataListCell>
                );
            }

            return <DataListCell key={ label }>{ label }</DataListCell>;
        }) }
    </DataListItemRow>
);

const buildListRow = (items, ariaLabel, ariaLabelledBy) => {
    const [ isExpanded, setIsExpanded ] = useState([]);;
    const [ width, setWitdh ] = useState(window.innerWidth);

    const handleSetWidth = () => {
        setWitdh(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', () => {
            handleSetWidth();
        });

        return () => {
            window.removeEventListener('resize', handleSetWidth());
        };
    });

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
                                        { width <= 1120 && <Label>Id/Name<ArrowIcon/>:</Label> }
                                        <a href={ item.id.tower_link } target='_blank' rel='noopener noreferrer'>
                                            { `${item.id.id} - ${item.id.template_name}` }
                                        </a>
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { width <= 1120 && <Label>Status:</Label> }
                                        <StyledStatusIcon
                                            status={ item.status }
                                        />
                                        { formatJobStatus(item.status) }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { width <= 1120 && <Label>Cluster:</Label> }
                                        { item.cluster_name }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { width <= 1120 && <Label>Organization:</Label> }
                                        { item.org_name }
                                    </DataListCell>,
                                    <DataListCell key={ count++ }>
                                        { width <= 1120 && <Label>Type:</Label> }
                                        { formatJobType(item.job_type) }
                                    </DataListCell>
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

const JobExplorerList = ({ jobs }) => {
    const [ width, setWitdh ] = useState(window.innerWidth);

    const handleSetWidth = () => {
        setWitdh(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', () => {
            handleSetWidth();
        });

        return () => {
            window.removeEventListener('resize', handleSetWidth());
        };
    });
    return (
        <>
        {jobs.length <= 0 && <LoadingState />}
        <>
            { width >= 1120 ? buildHeader(headerLabels) : null}
            <AllJobsTemplate jobs={ jobs } />

        </>
    </>
    );
};

JobExplorerList.propTypes = {
    jobs: PropTypes.array
};

AllJobsTemplate.propTypes = {
    jobs: PropTypes.array
};

export default JobExplorerList;
