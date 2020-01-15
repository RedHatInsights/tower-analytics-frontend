import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDateTime, formatSeconds } from '../Utilities/helpers';
import styled from 'styled-components';
import LoadingState from '../Components/LoadingState';

import {
    Badge,
    Button,
    DataList,
    DataListItem as PFDataListItem,
    DataListCell as PFDataListCell,
    Modal
} from '@patternfly/react-core';

import { CircleIcon } from '@patternfly/react-icons';

import { templatesRequest } from '../Api';

const success = (
    <CircleIcon
        size="sm"
        key="5"
        style={ { color: 'rgb(110, 198, 100)', marginRight: '5px' } }
    />
);
const fail = (
  <>
    <CircleIcon
        size="sm"
        key="5"
        style={ { color: 'rgb(163, 0, 0)', marginRight: '5px' } }
    />
    <span id="fail-icon">!</span>
  </>
);

const DataListCell = styled(PFDataListCell)`
  --pf-c-data-list__cell-cell--MarginRight: 0;
`;

const DataListItem = styled(PFDataListItem)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 10px 15px;
  justify-content: center;
`;
const DataListItemCompact = styled(DataListItem)`
  padding: 0 15px;
  > .pf-c-data-list__cell {
    font-weight: 600;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const DataCellEnd = styled(DataListCell)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TemplatesList = ({ templates }) => {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ selectedId, setSelectedId ] = useState(null);
    const [ selectedTemplate, setSelectedTemplate ] = useState([]);
    const [ relatedJobs, setRelatedJobs ] = useState([]);
    useEffect(() => {
    // Make GET request to get template details
        templatesRequest(selectedId).then(data => {
            if (data) {
                setSelectedTemplate(data);
                setRelatedJobs(data.related_jobs);
            }
        });
    }, [ selectedId ]);

    return (
    <>
      <DataList aria-label="Top Templates" style={ {
          maxHeight: '400px',
          overflow: 'auto'
      } }>
          <DataListItem aria-labelledby="top-templates-header">
              <DataListCell>
                  <h3>Top Templates</h3>
              </DataListCell>
              <DataCellEnd>
                  <h3>
                      <strong>Usage</strong>
                  </h3>
              </DataCellEnd>
          </DataListItem>
          { templates.length <= 0 && <LoadingState /> }
          { templates.map(({ name, count, id }) => (
              <DataListItem aria-labelledby="top-templates-detail" key={ name }>
                  <DataListCell>
                      <a
                          onClick={ () => {
                              setIsModalOpen(true);
                              setSelectedId(id);
                          } }
                      >
                          { name }
                      </a>
                  </DataListCell>
                  <DataCellEnd>
                      <Badge isRead>{ count }</Badge>
                  </DataCellEnd>
              </DataListItem>
          )) }
      </DataList>
      {selectedTemplate && (
          <Modal
              width={ '80%' }
              title={ selectedTemplate.name ? `${selectedTemplate.name}` : '' }
              isOpen={ isModalOpen }
              onClose={ () => {
                  setIsModalOpen(false);
                  setSelectedTemplate([]);
                  setRelatedJobs([]);
                  setSelectedId(null);
              } }
              actions={ [
                  <Button
                      key="cancel"
                      variant="secondary"
                      onClick={ () => {
                          setIsModalOpen(false);
                          setSelectedTemplate([]);
                          setRelatedJobs([]);
                          setSelectedId(null);
                      } }
                  >
              Close
                  </Button>
              ] }
          >
              <DataList aria-label="Selected Template Details">
                  <DataListItemCompact aria-labelledby="datalist header">
                      <PFDataListCell key="job heading">Id/Name</PFDataListCell>
                      <PFDataListCell key="cluster heading">Cluster</PFDataListCell>
                      <PFDataListCell key="start time heading">
                Start Time
                      </PFDataListCell>
                      <PFDataListCell key="total time heading">
                Total Time
                      </PFDataListCell>
                  </DataListItemCompact>
                  { relatedJobs.length <= 0 && <LoadingState /> }
                  { relatedJobs.length > 0 &&
              relatedJobs.map((job, index) => (
                  <DataListItem
                      key={ `job-details-${index}` }
                      aria-labelledby="job details"
                  >
                      <PFDataListCell key="job name">
                          { job.status === 'successful' ? success : fail }{ ' ' }
                          { job.job_name }
                      </PFDataListCell>
                      <PFDataListCell key="job cluster">
                          { job.system_label || job.install_uuid }
                      </PFDataListCell>
                      <PFDataListCell key="start time">
                          { formatDateTime(job.start_time) }
                      </PFDataListCell>
                      <PFDataListCell key="total time">
                          { formatSeconds(job.total_time) }
                      </PFDataListCell>
                  </DataListItem>
              )) }
                  <DataListItemCompact aria-labelledby="playbook run time">
                      <PFDataListCell key="primary content">
                          <span>
                  Total Time: { selectedTemplate.total_run } | Avg Time:{ ' ' }
                              { selectedTemplate.average_run }
                          </span>
                      </PFDataListCell>
                  </DataListItemCompact>
              </DataList>
          </Modal>
      )}
    </>
    );
};

TemplatesList.propTypes = {
    templates: PropTypes.array
};

export default TemplatesList;
