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
} from '../../../Api/';
import FilterableToolbar from '../../../Components/Toolbar';
import ApiErrorState from '../../../Components/ApiErrorState';
import LoadingState from '../../../Components/LoadingState';
import EmptyState from '../../../Components/EmptyState';
import EmptyList from '../../../Components/EmptyList';
import Pagination from '../../../Components/Pagination';
import PlanCard from './ListItem';
import { useQueryParams } from '../../../Utilities/useQueryParams';
import { savingsPlanner } from '../../../Utilities/constants';
import { notAuthorizedParams } from '../../../Utilities/constants';

import ToolbarDeleteButton from '../../../Components/Toolbar/ToolbarDeleteButton';
import useSelected from '../../../Utilities/useSelected';
import useRequest, { useDeleteItems } from "../../../Utilities/useRequest";
import {encodeQueryString, getQSConfig, parseQueryString} from '../../../Utilities/qs';
import ErrorDetail from '../../../Components/ErrorDetail';
import AlertModal from '../../../Components/AlertModal';

const QS_CONFIG = getQSConfig('savings-planner', { ...savingsPlanner.defaultParams }, ['limit', 'offset']);
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
  const history = useHistory();
  const location = useLocation();
  const { pathname } = useLocation();

  // params from toolbar/searchbar
  const query = location.search ? Object.fromEntries(new URLSearchParams(location.search)) : QS_CONFIG.defaultParams
  const { queryParams, setFromPagination, setFromToolbar } = useQueryParams(query);

  // params from url/querystring
  const [urlstring, setUrlstring] = useState(encodeQueryString(queryParams))

  const [preflightError, setPreFlightError] = useState(null);

  const {
    result: {
      dataResponse,
      rbac,
      total_count,
      optionsResponse
    },
    error,
    isLoading,
    request: fetchEndpoints,
  } = useRequest(
    useCallback(async () => {
      await preflightRequest().catch((error) => {
        setPreFlightError({ preflightError: error });
      });

      const [response, optionsResponse] = await Promise.all([
        readPlans({ params: parseQueryString(queryParams, urlstring) }),
        readPlanOptions()
      ]);
      return {
        dataResponse: response.items,
        rbac: response.rbac,
        total_count: response.meta.total_count,
        optionsResponse: optionsResponse
      };
    }, [location]),
    {
      items: [], optionsResponse: {}
    }
  );

  const [options, setOptions] = useState(optionsResponse);
  const [data, setData] = useState(dataResponse);

  useEffect(() => {
    setData(dataResponse);
    setOptions(optionsResponse);
  }, [dataResponse, optionsResponse]);

  const combinedOptions = {
    ...options,
    name: [{ key: 'name', value: null }],
  };

  useEffect(() => {
    fetchEndpoints();
  }, [fetchEndpoints]);

  useEffect(() => {
    setUrlstring(encodeQueryString(queryParams))
    history.push(`${pathname}?${urlstring}`)
    //fetchEndpoints();
  }, [queryParams, urlstring]);

  const isSuccess = !isLoading && !error && data?.length > 0
  const canWrite =
    isSuccess &&
    (rbac?.perms?.write === true ||
      rbac?.perms?.all === true);

  const { selected, isAllSelected, handleSelect, setSelected } =
    useSelected(data);

  const {
    isLoading: deleteLoading,
    deletionError,
    deleteItems: deleteItems,
    clearDeletionError,
  } = useDeleteItems(
    useCallback(async () => {
      return Promise.all(selected.map((plan) => deletePlan({ id: plan.id })));
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

  const renderContent = () => {
    if (preflightError) return <EmptyState {...preflightError} />;

    if (error) return <ApiErrorState message={error.error} />;

    if (isLoading || deleteLoading) return <LoadingState />;

    if (isSuccess && data?.length === 0 && !(isLoading || deleteLoading))
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

    if (isSuccess && !(isLoading || deleteLoading))
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
            data?.map((datum) => (
              <PlanCard
                key={datum.id}
                isSuccess={isSuccess}
                selected={selected}
                plan={datum}
                handleSelect={handleSelect}
                canWrite={canWrite}
                options={options}
              />
            ))}
        </Gallery>
      );

    return <></>;
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
                      history.push({
                        pathname: `${pathname}/add`,
                      });
                    }}
                  >
                    Add plan
                  </Button>,
                ]
              : []),
            canWrite && isSuccess && data?.length > 0 && (
              <ToolbarDeleteButton
                key="delete-plan-button"
                onDelete={handleDelete}
                itemsToDelete={selected}
                pluralizedItemName={'Savings plan'}
              />
            ),
          ]}
          pagination={
            isSuccess && data?.length > 0 ? (
              <Pagination
                count={total_count}
                params={{
                  limit: parseInt(queryParams.limit),
                  offset: parseInt(queryParams.offset),
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
      <FlexMain>{renderContent()}</FlexMain>
      {data?.length > 0 && !(isLoading || deleteLoading) && (
        <Footer>
          <Pagination
            count={total_count}
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
