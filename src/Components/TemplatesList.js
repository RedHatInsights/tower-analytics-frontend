/*eslint camelcase: ["error", {allow: ["template_id", "job_type", "cluster_id", "start_date", "end_date", "quick_date_range"]}]*/
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDateTime, formatSeconds, formatPercentage } from '../Utilities/helpers';
import styled from 'styled-components';
import LoadingState from '../Components/LoadingState';
import NoData from '../Components/NoData';
import { Paths } from '../paths';
import { formatQueryStrings } from '../Utilities/formatQueryStrings';

import {
    Button,
    DataList,
    DataListItem as PFDataListItem,
    DataListCell as PFDataListCell,
    Modal,
    Label
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

const PFDataListItemNoBorder = styled(PFDataListItem)`
    border-bottom: none;
    margin-bottom: -20px;
`;

const DataListItem = styled(PFDataListItem)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0 15px 10px 15px;
  justify-content: center;
  align-items: center;
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

const DataListCellCompact = styled(DataListCell)`
    padding: 7px;
`;

const DataListFocus = styled.div`
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-gap: 10px;
    padding: var(--pf-global--spacer--lg);
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

const DataCellEndCompact = styled(DataCellEnd)`
    padding: 7px !important;
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

const TemplatesList = ({ history, clusterId, templates, isLoading, queryParams }) => {
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

    }, [ selectedId ]);

    const redirectToJobExplorer = () => {
        const { jobExplorer } = Paths;
        const initialQueryParams = {
            template_id: selectedId,
            status: [ 'successful', 'failed', 'new', 'pending', 'waiting', 'error', 'canceled', 'running' ],
            job_type: [ 'job' ],
            start_date: queryParams.startDate,
            end_date: queryParams.endDate,
            quick_date_range: 'custom',
            cluster_id: clusterId
        };

        const { strings, stringify } = formatQueryStrings(initialQueryParams);
        const search = stringify(strings);
        history.push({
            pathname: jobExplorer,
            search
        });
    };

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
                      { count }
                  </DataCellEnd>
              </DataListItem>
          )) }
      </DataList>
      { selectedTemplate && selectedTemplate !== [] && (
          <Modal
              width={ '80%' }
              title={ selectedTemplate.name ? selectedTemplate.name : 'no-template-name' }
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
                  <PFDataListItemNoBorder
                      aria-labelledby="Selected Template Statistics"
                  >
                      <DataListFocus>
                          <div aria-labelledby="job runs">
                              <b style={ { marginRight: '10px' } }>Number of runs</b>
                              { selectedTemplate.total_run_count ?
                                  selectedTemplate.total_run_count : 'Unavailable' }
                          </div>
                          <div aria-labelledby="total time">
                              <b style={ { marginRight: '10px' } }>Total time</b>
                              { selectedTemplate.total_run ?
                                  selectedTemplate.total_run : 'Unavailable' }
                          </div>
                          <div aria-labelledby="Avg Time">
                              <b style={ { marginRight: '10px' } }>Avg time</b>
                              { selectedTemplate.average_run ?
                                  selectedTemplate.average_run : 'Unavailable' }
                          </div>
                          <div aria-labelledby="success rate">
                              <b style={ { marginRight: '10px' } }>Success rate</b>
                              { !isNaN(selectedTemplate.success_rate) ?
                                  formatPercentage(selectedTemplate.success_rate) : 'Unavailable' }
                          </div>
                          <div aria-labelledby="most failed task">
                              <b style={ { marginRight: '10px' } }>Most failed task</b>
                              { selectedTemplate.most_failed_tasks ?
                                  formatTopFailedTask(selectedTemplate.most_failed_tasks) : 'Unavailable' }
                          </div>
                      </DataListFocus>
                  </PFDataListItemNoBorder>
                  <DataListItemCompact>
                      <DataListCellCompact key="last5jobs">
                          <Label variant="outline">Last 5 jobs</Label>
                      </DataListCellCompact>,
                      <DataCellEndCompact>
                          <Button component="a" onClick={ redirectToJobExplorer } variant="link">
                              View all jobs
                          </Button>
                      </DataCellEndCompact>
                  </DataListItemCompact>
                  <DataListItemCompact aria-labelledby="datalist header">
                      <PFDataListCell key="job heading">Id/Name</PFDataListCell>
                      <PFDataListCell key="cluster heading">Cluster</PFDataListCell>
                      <PFDataListCell key="start time heading">Start Time</PFDataListCell>
                      <PFDataListCell key="total time heading">Total Time</PFDataListCell>
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
      ) }
    </>
    );
};

TemplatesList.propTypes = {
    templates: PropTypes.array,
    isLoading: PropTypes.bool,
    queryParams: PropTypes.object
};

export default TemplatesList;
