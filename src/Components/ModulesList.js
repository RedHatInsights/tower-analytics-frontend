import React from 'react';
import PropTypes from 'prop-types';
import { trimStr } from '../Utilities/helpers';
import styled from 'styled-components';
import NoData from '../Components/NoData';

import {
    DataList,
    DataListItem as PFDataListItem,
    DataListCell as PFDataListCell
} from '@patternfly/react-core';

import { Spinner } from '@redhat-cloud-services/frontend-components';

const DataListCell = styled(PFDataListCell)`
    --pf-c-data-list__cell-cell--MarginRight: 0;
`;

const DataListItem = styled(PFDataListItem)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0 15px 10px 15px;
`;

const DataCellEnd = styled(DataListCell)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ModulesList = ({ modules, isLoading }) => (
    <DataList aria-label="Top Modules" style={ {
        maxHeight: '400px',
        overflow: 'auto',
        height: '400px',
        background: 'white'
    } }>
        <DataListItem aria-labelledby="top-modules-header">
            <DataListCell>
                <h3>Top modules</h3>
            </DataListCell>
            <DataCellEnd>
                <h3>Usage</h3>
            </DataCellEnd>
        </DataListItem>
        { isLoading && (
            <PFDataListItem
                aria-labelledby="modules-loading"
                key={ isLoading }
                style={ { border: 'none' } }
            >
                <PFDataListCell>
                    <Spinner centered />
                </PFDataListCell>
            </PFDataListItem>
        ) }
        { !isLoading && modules.length <= 0 && (
            <PFDataListItem
                aria-labelledby="modules-no-data"
                key={ isLoading }
                style={ { border: 'none' } }
            >
                <PFDataListCell>
                    <NoData />
                </PFDataListCell>
            </PFDataListItem>
        ) }
        { !isLoading && modules.filter(module => module.module !== null).map(({ module, count }, index) => (
            <DataListItem aria-labelledby="top-modules-detail" key={ index }>
                <DataListCell>
                    <span>{ trimStr(module) }</span>
                </DataListCell>
                <DataCellEnd>
                    { count }
                </DataCellEnd>
            </DataListItem>
        )) }
    </DataList>
);

ModulesList.propTypes = {
    modules: PropTypes.array,
    isLoading: PropTypes.bool
};

export default ModulesList;
