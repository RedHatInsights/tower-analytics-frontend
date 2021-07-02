import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { Button, Gallery, PaginationVariant } from '@patternfly/react-core';

import {
  deletePlan,
  preflightRequest,
  readPlanOptions,
  readPlans,
} from '../../../Api';
import FilterableToolbar from '../../../Components/Toolbar';
import ApiErrorState from '../../../Components/ApiErrorState';
import LoadingState from '../../../Components/LoadingState';
import EmptyState from '../../../Components/EmptyState';
import EmptyList from '../../../Components/EmptyList';
import Pagination from '../../../Components/Pagination';
import PlanCard from './ListItem';
import { useQueryParams } from '../../../Utilities/useQueryParams';
import useApi from '../../../Utilities/useApi';
import { savingsPlanner } from '../../../Utilities/constants';
import { notAuthorizedParams } from '../../../Utilities/constants';

import ToolbarDeleteButton from '../../../Components/Toolbar/ToolbarDeleteButton';
import useSelected from '../../../Utilities/useSelected';
import { useDeleteItems } from '../../../Utilities/useRequest';
import ErrorDetail from '../../../Components/ErrorDetail';
import AlertModal from '../../../Components/AlertModal';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 76px);
`;

const FlexMain = styled(Main)`
  flex-grow: 1;
`;

const Footer = styled.div`
  flex-shrink: 0;
`;

const List = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  const { queryParams, setFromPagination, setFromToolbar } = useQueryParams(
    savingsPlanner.defaultParams
  );
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
  const [preflightError, setPreFlightError] = useState(null);

  const combinedOptions = {
    ...options.data,
    name: [{ key: 'name', value: null }],
  };

  const fetchEndpoints = () => {
    preflightRequest().catch((error) => {
      setPreFlightError({ preflightError: error });
    });
    setData(readPlans({ params: queryParams }));
    setOptions(readPlanOptions());
  };

  useEffect(() => {
    fetchEndpoints();
  }, [queryParams]);

  const canWrite =
    options.isSuccess &&
    (options.data?.meta?.rbac?.perms?.write === true ||
      options.data?.meta?.rbac?.perms?.all === true);

  const { selected, isAllSelected, handleSelect, setSelected } =
    useSelected(data);

  const {
    isLoading: deleteLoading,
    deletionError,
    deleteItems: deleteItems,
    clearDeletionError,
  } = useDeleteItems(
    useCallback(async () => {
      return Promise.all(
        selected.map((plan) => deletePlan({ params: { id: plan.id } }))
      );
    }, [selected]),
    {
      qsConfig: queryParams,
      allItemsSelected: isAllSelected,
      fetchItems: fetchEndpoints,
    }
  );

  const handleDelete = async () => {
    await deleteItems();
    setSelected([]);
  };

  if (preflightError?.preflightError?.status === 403) {
    return <NotAuthorized {...notAuthorizedParams} />;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderTitle title={'Savings Planner'} />
        <FilterableToolbar
          categories={combinedOptions}
          filters={queryParams}
          setFilters={setFromToolbar}
          additionalControls={[
            ...(canWrite
              ? [
                  <Button
                    key="add-plan-button"
                    variant="primary"
                    aria-label="Add plan"
                    onClick={() => {
                      history.push({
                        pathname: `${pathname}/add`,
                      });
                    }}
                  >
                    Add plan
                  </Button>,
                ]
              : []),
            canWrite && isSuccess && data.length > 0 && (
              <ToolbarDeleteButton
                key="delete-plan-button"
                onDelete={handleDelete}
                itemsToDelete={selected}
                pluralizedItemName={'Savings plan'}
              />
            ),
          ]}
          pagination={
            isSuccess && data.length > 0 ? (
              <Pagination
                count={meta?.total_count}
                params={{
                  limit: queryParams.limit,
                  offset: queryParams.offset,
                }}
                setPagination={setFromPagination}
                isCompact
              />
            ) : (
              <div></div>
            )
          }
        />
      </PageHeader>
      {preflightError && (
        <FlexMain>
          <EmptyState {...preflightError} />
        </FlexMain>
      )}
      {error && (
        <FlexMain>
          <ApiErrorState message={error.error} />
        </FlexMain>
      )}
      {(isLoading || deleteLoading) && (
        <FlexMain>
          <LoadingState />
        </FlexMain>
      )}
      {isSuccess && data.length === 0 && !(isLoading || deleteLoading) && (
        <FlexMain>
          <EmptyList
            label={'Add plan'}
            title={'No plans found'}
            message={
              canWrite
                ? 'Update the applied filters or add a new plan.'
                : 'Update the applied filters.'
            }
            canAdd={canWrite}
            path={`${pathname}/add`}
          />
        </FlexMain>
      )}
      {isSuccess && !(isLoading || deleteLoading) && (
        <FlexMain>
          <Gallery
            hasGutter
            minWidths={{
              sm: '307px',
              md: '307px',
              lg: '307px',
              xl: '307px',
              '2xl': '307px',
            }}
          >
            {options.isSuccess &&
              data.map((datum) => (
                <PlanCard
                  key={datum.id}
                  isSuccess={options.isSuccess}
                  selected={selected}
                  plan={datum}
                  handleSelect={handleSelect}
                  canWrite={canWrite}
                  options={options}
                />
              ))}
          </Gallery>
        </FlexMain>
      )}
      {data.length > 0 && !(isLoading || deleteLoading) && (
        <Footer>
          <Pagination
            count={meta?.total_count}
            params={{
              limit: queryParams.limit,
              offset: queryParams.offset,
            }}
            setPagination={setFromPagination}
            variant={PaginationVariant.bottom}
          />
        </Footer>
      )}
      {deletionError && (
        <AlertModal
          aria-label={'Deletion error'}
          isOpen={deletionError}
          onClose={clearDeletionError}
          title={'Error'}
          variant="error"
        >
          {'Failed to delete one or more plans.'}
          <ErrorDetail error={deletionError.detail} />
        </AlertModal>
      )}
    </PageContainer>
  );
};

export default List;
