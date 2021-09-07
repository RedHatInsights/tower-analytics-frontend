import React, { useEffect } from 'react';

import { useQueryParams } from '../../QueryParams/';
import useRequest from '../../Utilities/useRequest';

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
import ApiStatusWrapper from '../../Components/ApiStatus/ApiStatusWrapper';
import ApiOptionsWrapper from '../../Components/ApiStatus/ApiOptionsWrapper';

const JobExplorer = () => {
  const {
    queryParams,
    setFromPagination,
    setFromToolbar,
    dispatch: queryParamsDispatch,
  } = useQueryParams(jobExplorer.defaultParams);

  const optionsApi = useRequest(readJobExplorerOptions, {});
  const dataApi = useRequest(readJobExplorer, {
    items: [],
    meta: { count: 0 },
  });

  useEffect(() => {
    optionsApi.request(queryParams);
    dataApi.request(queryParams);
  }, [queryParams]);

  const renderToolbar = () => (
    <FilterableToolbar
      categories={optionsApi.result}
      filters={queryParams}
      setFilters={setFromToolbar}
      pagination={
        <Pagination
          count={dataApi.result?.meta?.count}
          params={{
            limit: +queryParams.limit,
            offset: +queryParams.offset,
          }}
          setPagination={setFromPagination}
          isCompact
        />
      }
      hasSettings
    />
  );

  const renderContent = () => (
    <ApiStatusWrapper
      api={{
        ...dataApi,
        result: dataApi.result?.items,
      }}
    >
      <JobExplorerList
        jobs={dataApi.result?.items}
        queryParams={queryParams}
        queryParamsDispatch={queryParamsDispatch}
      />
    </ApiStatusWrapper>
  );

  const renderFooter = () => (
    <Pagination
      count={dataApi.result?.meta?.count}
      params={{
        limit: +queryParams.limit,
        offset: +queryParams.offset,
      }}
      setPagination={setFromPagination}
      variant={PaginationVariant.bottom}
    />
  );

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title={'Job Explorer'} />
      </PageHeader>
      <Main>
        <ApiOptionsWrapper api={optionsApi}>
          <Card>
            <CardBody>
              {renderToolbar()}
              {renderContent()}
              {renderFooter()}
            </CardBody>
          </Card>
        </ApiOptionsWrapper>
      </Main>
    </>
  );
};

export default JobExplorer;
