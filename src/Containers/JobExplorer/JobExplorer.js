import React, { useEffect } from 'react';

import { useQueryParams } from '../../QueryParams/';
import useRequest from '../../Utilities/useRequest';

import LoadingState from '../../Components/ApiStatus/LoadingState';
import NoResults from '../../Components/ApiStatus/NoResults';
import ApiErrorState from '../../Components/ApiStatus/ApiErrorState';
import Pagination from '../../Components/Pagination';

import { readJobExplorer, readJobExplorerOptions } from '../../Api/';
import { jobExplorer } from '../../Utilities/constants';

import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import { Card, CardBody, PaginationVariant } from '@patternfly/react-core';

import JobExplorerList from './JobExplorerList';
import FilterableToolbar from '../../Components/Toolbar/';
import { SettingsPanel } from '../../Components/Toolbar/Groups';

const JobExplorer = () => {
  const {
    queryParams,
    setFromPagination,
    setFromToolbar,
    dispatch: queryParamsDispatch,
  } = useQueryParams(jobExplorer.defaultParams);

  const {
    result: options,
    error,
    request: fetchOptions,
  } = useRequest(readJobExplorerOptions, {});

  const {
    result: { items: data, meta },
    isLoading: dataIsLoading,
    isSuccess: dataIsSuccess,
    request: fetchEndpoints,
  } = useRequest(readJobExplorer, { items: [], meta: { count: 0 } });

  useEffect(() => {
    fetchOptions(queryParams);
    fetchEndpoints(queryParams);
  }, [queryParams]);

  if (error) return <ApiErrorState message={error.error.error} />;

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title={'Job Explorer'} />
      </PageHeader>
      <Main>
        <Card>
          <CardBody>
            <FilterableToolbar
              categories={options}
              filters={queryParams}
              setFilters={setFromToolbar}
              pagination={
                <Pagination
                  count={meta.count}
                  params={{
                    limit: +queryParams.limit,
                    offset: +queryParams.offset,
                  }}
                  setPagination={setFromPagination}
                  isCompact
                />
              }
              settingsPanel={(setSettingsExpanded, settingsExpanded) => (
                <SettingsPanel
                  filters={queryParams}
                  setFilters={setFromToolbar}
                  settingsExpanded={settingsExpanded}
                  setSettingsExpanded={setSettingsExpanded}
                  id={'showRootWorkflowJobs'}
                  label={'Ignore nested workflows and jobs'}
                  labelOff={'Ignore nested workflows and jobs'}
                  isChecked={
                    queryParams.only_root_workflows_and_standalone_jobs
                  }
                  onChange={(value) => {
                    setFromToolbar(
                      'only_root_workflows_and_standalone_jobs',
                      value
                    );
                  }}
                  ariaLabel={'ignore nested workflow popover'}
                  bodyContent={
                    'If enabled, nested workflows and jobs will not be included in the overall totals. Enable this option to filter out duplicate entries.'
                  }
                />
              )}
              hasSettings
            />
            {dataIsLoading && <LoadingState />}
            {dataIsSuccess && data.length <= 0 && <NoResults />}
            {dataIsSuccess && data.length > 0 && (
              <JobExplorerList
                jobs={data}
                queryParams={queryParams}
                queryParamsDispatch={queryParamsDispatch}
              />
            )}
            <Pagination
              count={meta.count}
              params={{
                limit: +queryParams.limit,
                offset: +queryParams.offset,
              }}
              setPagination={setFromPagination}
              variant={PaginationVariant.bottom}
            />
          </CardBody>
        </Card>
      </Main>
    </React.Fragment>
  );
};

export default JobExplorer;
