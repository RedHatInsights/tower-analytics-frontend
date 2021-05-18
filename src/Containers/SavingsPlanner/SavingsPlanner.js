import React, { useEffect, useState } from 'react';

import { preflightRequest, readPlanOptions, readPlans } from '../../Api';
import FilterableToolbar from '../../Components/Toolbar/';
import ApiErrorState from '../../Components/ApiErrorState';
import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import Pagination from '../../Components/Pagination';
import PlanCard from './PlanCard';
import { useQueryParams } from '../../Utilities/useQueryParams';
import useApi from '../../Utilities/useApi';
import { savingsPlanner } from '../../Utilities/constants';
import { notAuthorizedParams } from '../../Utilities/constants';

import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';

import { Gallery, PaginationVariant } from '@patternfly/react-core';

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
              count={meta?.total_count ? meta.total_count : 0}
              limit={queryParams.limit}
              handleSetLimit={setLimit}
              handleSetOffset={setOffset}
              handleSetCurrPage={setCurrPage}
              currPage={currPage}
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
        count={meta?.total_count ? meta.total_count : 0}
        limit={queryParams.limit}
        variant={PaginationVariant.bottom}
        handleSetLimit={setLimit}
        handleSetOffset={setOffset}
        handleSetCurrPage={setCurrPage}
        currPage={currPage}
        isSticky
      />
    </React.Fragment>
  );
};

export default SavingsPlanner;
