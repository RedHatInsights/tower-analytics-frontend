import { DataListCell } from '@patternfly/react-core/dist/dynamic/components/DataList';
import { DataListItem } from '@patternfly/react-core/dist/dynamic/components/DataList';
import { DataList } from '@patternfly/react-core/dist/dynamic/components/DataList';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import LoadingState from '../../Components/ApiStatus/LoadingState';
import NoData from '../../Components/ApiStatus/NoData';
import ModalContents from './ModalContents';

const TLDataListCell = styled(DataListCell)`
  --pf-c-data-list__cell-cell--MarginRight: 0;
  --pf-c-data-list__cell--PaddingBottom: 10px;
`;

const TLDataListItem = styled(DataListItem)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0 15px 10px 15px;
  justify-content: center;
  align-items: center;
`;

const DataCellEnd = styled(TLDataListCell)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TemplatesList = ({ templates, isLoading, qp, title, jobType }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayJobType = (type) => {
    return type === 'job' ? 'templates' : 'workflows';
  };

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
        <TLDataListItem
          aria-labelledby={`top-${displayJobType(jobType)}-header`}
        >
          <TLDataListCell>
            <h3>{title}</h3>
          </TLDataListCell>
          <DataCellEnd>
            <h3>Usage</h3>
          </DataCellEnd>
        </TLDataListItem>
        {isLoading && (
          <DataListItem
            aria-labelledby={`${displayJobType(jobType)}-loading`}
            key={isLoading}
            style={{ border: 'none' }}
          >
            <DataListCell>
              <LoadingState />
            </DataListCell>
          </DataListItem>
        )}
        {!isLoading && templates.length <= 0 && (
          <DataListItem
            aria-labelledby={`${displayJobType(jobType)}-no-data`}
            key={isLoading}
            style={{ border: 'none' }}
          >
            <DataListCell>
              <NoData />
            </DataListCell>
          </DataListItem>
        )}
        {!isLoading &&
          templates.map(({ name, total_count, id }, index) => (
            <TLDataListItem
              aria-labelledby={`top-${displayJobType(jobType)}-detail`}
              key={index}
            >
              <TLDataListCell>
                <a
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedId(id);
                  }}
                >
                  {name}
                </a>
              </TLDataListCell>
              <DataCellEnd>{total_count}</DataCellEnd>
            </TLDataListItem>
          ))}
      </DataList>
      {selectedId && (
        <ModalContents
          isOpen={isModalOpen}
          handleModal={setIsModalOpen}
          selectedId={selectedId}
          qp={qp}
          jobType={jobType}
        />
      )}
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
