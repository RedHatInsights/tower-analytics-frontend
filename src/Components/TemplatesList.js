import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDateTime, formatSeconds, formatPercentage } from '../Utilities/helpers';
import styled from 'styled-components';
import LoadingState from '../Components/LoadingState';
import NoData from '../Components/NoData';

import {
    Badge,
    Button,
    DataList,
    DataListItem as PFDataListItem,
    DataListCell as PFDataListCell,
    Modal
} from '@patternfly/react-core';

import { CircleIcon } from '@patternfly/react-icons';

import { readTemplateJobs } from '../Api';

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
  padding: 0;
  > .pf-c-data-list__cell {
    font-weight: 600;
  }

  &:last-child {
    border-bottom: none;
  }
`;
const DataListFocus = styled.div`
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-gap: 10px;
    padding: var(--pf-c-data-list__cell-cell--PaddingTop);
    background: #ebebeb;
    border: 1px solid #ccc;
    border-top: none;
    margin-bottom: 20px;
`;

const DataCellEnd = styled(DataListCell)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const formatTopFailedTask = data => {
    if (!data) {
        return;
    }

    if (data && data[0]) {
        const percentage = formatPercentage(data[0].fail_rate);
        return `${data[0].task_name} ${percentage}`;
    }

    return `Unavailable`;
};

const renderTemplateTitle = ({ name, type }) => {
    let context;
    if (type === 'job') {
        context = 'Playbook Run';
    }

    return (
        <>
            { name }
            <Badge style={ { marginLeft: '20px' } } isRead>{ context }</Badge>
        </>
    );
};

const TemplatesList = ({ templates, isLoading, queryParams }) => {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ selectedId, setSelectedId ] = useState(null);
    const [ selectedTemplate, setSelectedTemplate ] = useState([]);
    const [ relatedJobs, setRelatedJobs ] = useState([]);

    useEffect(() => {
        const fetchTemplateDetails = () => {
            return readTemplateJobs(selectedId, { params: queryParams });
        };

        const update = async () => {
            await window.insights.chrome.auth.getUser();
            fetchTemplateDetails().then(data => {
                setSelectedTemplate(data);
                setRelatedJobs(data.related_jobs);
            });
        };

        if (selectedId) {
            update();
        }

        ;
    }, [ selectedId ]);

    return (
    <>
      <DataList aria-label="Top Templates" style={ {
          maxHeight: '400px',
          overflow: 'auto',
          height: '400px',
          background: 'white'
      } }>
          <DataListItem aria-labelledby="top-templates-header">
              <DataListCell>
                  <h3>Top templates</h3>
              </DataListCell>
              <DataCellEnd>
                  <h3>Usage</h3>
              </DataCellEnd>
          </DataListItem>
          { isLoading && (
              <PFDataListItem
                  aria-labelledby="templates-loading"
                  key={ isLoading }
                  style={ { border: 'none' } }

              >
                  <PFDataListCell>
                      <LoadingState />
                  </PFDataListCell>
              </PFDataListItem>
          ) }
          { !isLoading && templates.length <= 0 && (
              <PFDataListItem
                  aria-labelledby="templates-no-data"
                  key={ isLoading }
                  style={ { border: 'none' } }
              >
                  <PFDataListCell>
                      <NoData />
                  </PFDataListCell>
              </PFDataListItem>
          ) }
          { !isLoading && templates.map(({ name, count, id }, index) => (
              <DataListItem aria-labelledby="top-templates-detail" key={ index }>
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
              title={ selectedTemplate.name ? renderTemplateTitle(selectedTemplate) : '' }
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
                  <PFDataListItem
                      aria-labelledby="Selected Template Statistics"
                  >
                      <DataListFocus>
                          <div aria-labelledby="job runs">
                              <b style={ { marginRight: '10px' } }>Number of Runs</b>
                              { selectedTemplate.total_run_count ?
                                  selectedTemplate.total_run_count : 'Unavailable' }
                          </div>
                          <div aria-labelledby="total time">
                              <b style={ { marginRight: '10px' } }>Total Time</b>
                              { selectedTemplate.total_run ?
                                  selectedTemplate.total_run : 'Unavailable' }
                          </div>
                          <div aria-labelledby="Avg Time">
                              <b style={ { marginRight: '10px' } }>Avg Time</b>
                              { selectedTemplate.average_run ?
                                  selectedTemplate.average_run : 'Unavailable' }
                          </div>
                          <div aria-labelledby="success rate">
                              <b style={ { marginRight: '10px' } }>Success Rate</b>
                              { selectedTemplate.success_rate ?
                                  formatPercentage(selectedTemplate.success_rate) : 'Unavailable' }
                          </div>
                          <div aria-labelledby="most failed task">
                              <b style={ { marginRight: '10px' } }>Most Failed Task</b>
                              { selectedTemplate.most_failed_tasks ?
                                  formatTopFailedTask(selectedTemplate.most_failed_tasks) : 'Unavailable' }
                          </div>
                      </DataListFocus>
                  </PFDataListItem>
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
                      style={ { padding: '10px 0' } }
                      key={ `job-details-${index}` }
                      aria-labelledby="job details"
                  >
                      <PFDataListCell key="job name">
                          { job.status === 'successful' ? success : fail }{ ' ' }
                          { job.job_id } - { job.job_name }
                      </PFDataListCell>
                      <PFDataListCell key="job cluster">
                          { job.cluster_label || job.install_uuid }
                      </PFDataListCell>
                      <PFDataListCell key="start time">
                          { formatDateTime(job.start_time) }
                      </PFDataListCell>
                      <PFDataListCell key="total time">
                          { formatSeconds(job.total_time) }
                      </PFDataListCell>
                  </DataListItem>
              )) }
              </DataList>
          </Modal>
      )}
    </>
    );
};

TemplatesList.propTypes = {
    templates: PropTypes.array,
    isLoading: PropTypes.bool
};

export default TemplatesList;
