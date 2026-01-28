import {
  DataList,
  DataListCell,
  DataListItem,
} from '@patternfly/react-core/dist/dynamic/components/DataList';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import LoadingState from '../../Components/ApiStatus/LoadingState';
import NoData from '../../Components/ApiStatus/NoData';
import { trimStr } from '../../Utilities/helpers';

const MLDataListCell = styled(DataListCell)`
  --pf-v6-c-data-list__cell-cell--MarginRight: 0;
  --pf-v6-c-data-list__cell--PaddingBottom: 10px;
`;

const MLDataListItem = styled(DataListItem)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0 15px 10px 15px;
`;

const DataCellEnd = styled(MLDataListCell)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ModulesList = ({ modules, isLoading }) => (
  <DataList
    aria-label='Top Modules'
    style={{
      maxHeight: '400px',
      overflow: 'auto',
      height: '400px',
      background: 'white',
    }}
  >
    <MLDataListItem aria-labelledby='top-modules-header'>
      <MLDataListCell>
        <h3>Top modules</h3>
      </MLDataListCell>
      <DataCellEnd>
        <h3>Usage</h3>
      </DataCellEnd>
    </MLDataListItem>
    {isLoading && (
      <DataListItem
        aria-labelledby='modules-loading'
        key={isLoading}
        style={{ border: 'none' }}
      >
        <DataListCell>
          <LoadingState />
        </DataListCell>
      </DataListItem>
    )}
    {!isLoading && modules.length <= 0 && (
      <DataListItem
        aria-labelledby='modules-no-data'
        key={isLoading}
        style={{ border: 'none' }}
      >
        <DataListCell>
          <NoData />
        </DataListCell>
      </DataListItem>
    )}
    {!isLoading &&
      modules
        .filter((module) => module.name !== null)
        .map(({ name, host_task_count }, index) => (
          <MLDataListItem aria-labelledby='top-modules-detail' key={index}>
            <MLDataListCell>
              <span>{trimStr(name)}</span>
            </MLDataListCell>
            <DataCellEnd>{host_task_count}</DataCellEnd>
          </MLDataListItem>
        ))}
  </DataList>
);

ModulesList.propTypes = {
  modules: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default ModulesList;
