import React, { useEffect, useState } from 'react';

import { preflightRequest, readPlanOptions, readPlans } from '../../Api';
import FilterableToolbar from '../../Components/Toolbar/';
import ApiErrorState from '../../Components/ApiErrorState';
import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import PlanCard from './PlanCard';
import { useQueryParams } from '../../Utilities/useQueryParams';
import useApi from '../../Utilities/useApi';
import { savingsPlanner } from '../../Utilities/constants';
import { notAuthorizedParams } from '../../Utilities/constants';

import Main from '@redhat-cloud-services/frontend-components/Main';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';

import { Gallery, Pagination, PaginationVariant } from '@patternfly/react-core';

const perPageOptions = [
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '15', value: 15 },
  { title: '20', value: 20 },
  { title: '25', value: 25 },
];

const qp = {
  limit: 5,
  sort_options: 'modified',
  sort_order: 'desc',
};

const combined = {
  ...savingsPlanner.defaultParams,
  ...qp,
};

const SavingsPlanner = () => {
  const { queryParams, setLimit, setOffset, setFromToolbar } =
    useQueryParams(combined);
  const [
    {
      isLoading,
      isSuccess,
      error,
      data: { meta = {}, items: data = [] },
    },
    setData,
  ] = useApi({ meta: {}, items: [] });
  const [options, setOptions] = useApi({});
  const [currPage, setCurrPage] = useState(1);
  const [preflightError, setPreFlightError] = useState(null);

  const combinedOptions = {
    ...options.data,
    name: [{ key: 'name', value: null }],
  };

  const returnOffsetVal = (page) => (page - 1) * queryParams.limit;

  const handleSetPage = (page) => {
    const nextOffset = returnOffsetVal(page);
    setOffset(nextOffset);
    setCurrPage(page);
  };

  const handlePerPageSelect = (perPage, page) => {
    setLimit(perPage);
    const nextOffset = returnOffsetVal(page);
    setOffset(nextOffset);
    setCurrPage(page);
  };

  useEffect(() => {
    const fetchEndpoints = () => {
      preflightRequest().catch((error) => {
        setPreFlightError({ preflightError: error });
      });
      setData(readPlans({ params: queryParams }));
      setOptions(readPlanOptions());
    };

    fetchEndpoints();
  }, [queryParams]);

  if (preflightError?.preflightError?.status === 403) {
    return <NotAuthorized {...notAuthorizedParams} />;
  }

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title={'Savings Planner'} />
        <FilterableToolbar
          categories={combinedOptions}
          filters={queryParams}
          setFilters={setFromToolbar}
          pagination={
            <Pagination
              itemCount={meta && meta.total_count ? meta.total_count : 0}
              widgetId="pagination-options-menu-top"
              perPageOptions={perPageOptions}
              perPage={queryParams.limit}
              page={currPage}
              variant={PaginationVariant.top}
              onPerPageSelect={(_event, perPage, page) => {
                handlePerPageSelect(perPage, page);
              }}
              onSetPage={(_event, pageNumber) => {
                handleSetPage(pageNumber);
              }}
              isCompact
            />
          }
        />
      </PageHeader>
      {preflightError && (
        <Main>
          <EmptyState {...preflightError} />
        </Main>
      )}
      {error && (
        <Main style={{ height: '100vh' }}>
          <ApiErrorState message={error.error} />
        </Main>
      )}
      {isLoading && (
        <Main style={{ height: '100vh' }}>
          <LoadingState />
        </Main>
      )}
      {isSuccess && (
        <Main style={{ height: '100vh' }}>
          <Gallery hasGutter>
            {options.isSuccess &&
              data.map((datum) => (
                <PlanCard
                  key={datum.id}
                  isSuccess={options.isSuccess}
                  {...datum}
                />
              ))}
          </Gallery>
        </Main>
      )}
      <Pagination
        itemCount={meta && meta.total_count ? meta.total_count : 0}
        widgetId="pagination-options-menu-top"
        perPageOptions={perPageOptions}
        perPage={queryParams.limit}
        page={currPage}
        variant={PaginationVariant.bottom}
        onPerPageSelect={(_event, perPage, page) => {
          handlePerPageSelect(perPage, page);
        }}
        onSetPage={(_event, pageNumber) => {
          handleSetPage(pageNumber);
        }}
        isSticky
      />
    </React.Fragment>
  );
};

export default SavingsPlanner;
