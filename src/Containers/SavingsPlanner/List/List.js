import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Button, Gallery, PaginationVariant } from '@patternfly/react-core';

import { deletePlans, readPlanOptions, readPlans } from '../../../Api/';
import FilterableToolbar from '../../../Components/Toolbar';
import ApiErrorState from '../../../Components/ApiStatus/ApiErrorState';
import LoadingState from '../../../Components/ApiStatus/LoadingState';
import EmptyList from '../../../Components/EmptyList';
import Pagination from '../../../Components/Pagination';
import PlanCard from './ListItem';
import { useQueryParams, useRedirect } from '../../../QueryParams/';
import { savingsPlanner } from '../../../Utilities/constants';

import ToolbarDeleteButton from '../../../Components/Toolbar/ToolbarDeleteButton';
import useSelected from '../../../Utilities/useSelected';
import useRequest, { useDeleteItems } from '../../../Utilities/useRequest';
import ErrorDetail from '../../../Components/ErrorDetail';
import AlertModal from '../../../Components/AlertModal';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 76px);
`;

const Footer = styled.div`
  flex-shrink: 0;
`;

const FlexMain = styled(Main)`
  flex-grow: 1;
`;

const List = () => {
  const redirect = useRedirect();
  const { pathname } = useLocation();

  // params from toolbar/searchbar
  const { queryParams, setFromPagination, setFromToolbar } = useQueryParams(
    savingsPlanner.defaultParams
  );

  const {
    result: options,
    error,
    isSuccess,
    request: fetchOptions,
  } = useRequest(
    useCallback(() => readPlanOptions(), [queryParams]),
    {}
  );

  const {
    result: { data, rbac, count },
    isLoading: itemsIsLoading,
    isSuccess: itemsIsSuccess,
    request: fetchEndpoints,
  } = useRequest(
    useCallback(async () => {
      const response = await readPlans(queryParams);
      return {
        data: response.items,
        rbac: response.rbac,
        count: response.meta.count,
      };
    }, [queryParams]),
    {
      data: [],
      rbac: {},
      count: 0,
    }
  );

  const combinedOptions = {
    ...options,
    name: [{ key: 'name', value: null }],
  };

  useEffect(() => {
    fetchOptions();
    fetchEndpoints();
  }, [queryParams]);

  const canWrite =
    itemsIsSuccess &&
    (rbac?.perms?.write === true || rbac?.perms?.all === true);

  const { selected, handleSelect, setSelected } = useSelected(data);

  const {
    isLoading: deleteLoading,
    deletionError,
    deleteItems: deleteItems,
    clearDeletionError,
  } = useDeleteItems(deletePlans, null);

  const handleDelete = async () => {
    await deleteItems(selected.map(({ id }) => id));
    setSelected([]);
    fetchEndpoints();
  };

  const renderContent = () => {
    if (error) return <ApiErrorState message={error.error} />;
    if (itemsIsLoading || deleteLoading) return <LoadingState />;
    if (
      itemsIsSuccess &&
      data.length === 0 &&
      !(itemsIsLoading || deleteLoading)
    )
      return (
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
      );

    if (itemsIsSuccess && !(itemsIsLoading || deleteLoading))
      return (
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
          {isSuccess &&
            itemsIsSuccess &&
            data.map((datum) => (
              <PlanCard
                key={datum.id}
                isSuccess={itemsIsSuccess}
                selected={selected}
                plan={datum}
                handleSelect={handleSelect}
                canWrite={canWrite}
                options={options}
              />
            ))}
        </Gallery>
      );

    return null;
  };

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
                      redirect(`${pathname}/add`);
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
            itemsIsSuccess && data.length > 0 ? (
              <Pagination
                count={count}
                params={{
                  limit: +queryParams.limit,
                  offset: +queryParams.offset,
                }}
                setPagination={setFromPagination}
                isCompact
              />
            ) : null
          }
        />
      </PageHeader>
      <FlexMain>{renderContent()}</FlexMain>
      {data.length > 0 && !(itemsIsLoading || deleteLoading) && (
        <Footer>
          <Pagination
            count={count}
            params={{
              limit: parseInt(queryParams.limit),
              offset: parseInt(queryParams.offset),
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
