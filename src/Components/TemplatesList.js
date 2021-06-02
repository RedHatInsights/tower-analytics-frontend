import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LoadingState from '../Components/LoadingState';
import NoData from '../Components/NoData';

import {
  DataList,
  DataListItem as PFDataListItem,
  DataListCell as PFDataListCell,
} from '@patternfly/react-core';

import ModalContents from './ModalContents';

const DataListCell = styled(PFDataListCell)`
  --pf-c-data-list__cell-cell--MarginRight: 0;
`;

const DataListItem = styled(PFDataListItem)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0 15px 10px 15px;
  justify-content: center;
  align-items: center;
`;

const DataCellEnd = styled(DataListCell)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TemplatesList = ({ templates, isLoading, qp, title, jobType }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayJobType = type => {
    return (type === 'job' ? 'templates' : 'workflows');
  }

  return (
    <>
      <DataList
        aria-label={`Top ${displayJobType(jobType)}`}
        style={{
          maxHeight: '400px',
          overflow: 'auto',
          height: '400px',
          background: 'white',
        }}
      >
        <DataListItem aria-labelledby={`top-${displayJobType(jobType)}-header`}>
          <DataListCell>
            <h3>{title}</h3>
          </DataListCell>
          <DataCellEnd>
            <h3>Usage</h3>
          </DataCellEnd>
        </DataListItem>
        {isLoading && (
          <PFDataListItem
            aria-labelledby={`${displayJobType(jobType)}-loading`}
            key={isLoading}
            style={{ border: 'none' }}
          >
            <PFDataListCell>
              <LoadingState />
            </PFDataListCell>
          </PFDataListItem>
        )}
        {!isLoading && templates.length <= 0 && (
          <PFDataListItem
            aria-labelledby={`${displayJobType(jobType)}-no-data`}
            key={isLoading}
            style={{ border: 'none' }}
          >
            <PFDataListCell>
              <NoData />
            </PFDataListCell>
          </PFDataListItem>
        )}
        {!isLoading &&
          templates.map(({ name, total_count, id }, index) => (
            <DataListItem aria-labelledby={`top-${displayJobType(jobType)}-detail`} key={index}>
              <DataListCell>
                <a
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedId(id);
                  }}
                >
                  {name}
                </a>
              </DataListCell>
              <DataCellEnd>{total_count}</DataCellEnd>
            </DataListItem>
          ))}
      </DataList>
      <ModalContents
        isOpen={isModalOpen}
        handleModal={setIsModalOpen}
        selectedId={selectedId}
        qp={qp}
        jobType={jobType}
        handleCloseBtn={setSelectedId}
      />
    </>
  );
};

TemplatesList.propTypes = {
  templates: PropTypes.array,
  isLoading: PropTypes.bool,
  queryParams: PropTypes.object,
  title: PropTypes.string,
  qp: PropTypes.object,
  jobType: PropTypes.string,
};

export default TemplatesList;
