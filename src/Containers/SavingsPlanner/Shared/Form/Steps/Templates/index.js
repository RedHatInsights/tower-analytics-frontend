import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { parse, stringify } from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';

import {
  Button,
  Form,
  FormGroup,
  PaginationVariant,
} from '@patternfly/react-core';
import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';

import LoadingState from '../../../../../../Components/LoadingState';
import EmptyState from '../../../../../../Components/EmptyState';
import NoResults from '../../../../../../Components/NoResults';
import ApiErrorState from '../../../../../../Components/ApiErrorState';
import Pagination from '../../../../../../Components/Pagination';

import { notAuthorizedParams } from '../../../../../../Utilities/constants';
import { useQueryParams } from '../../../../../../Utilities/useQueryParams';
import { getQSConfig } from '../../../../../../Utilities/qs';

import {
  preflightRequest,
  readJobExplorer,
  readJobExplorerOptions,
} from '../../../../../../Api/';

import FilterableToolbar from '../../../../../../Components/Toolbar/';

import { actions } from '../../../constants';
import useRequest from '../../../../../../Utilities/useRequest';

const ListFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const initialQueryParams = {
  group_by: 'template',
  limit: 10,
  group_by_time: false,
  offset: 0,
  sort_options: 'name',
  sort_order: 'asc',
  sort_by: 'name:asc',
};
const qsConfig = getQSConfig('job-explorer', { ...initialQueryParams }, [
  'limit',
  'offset',
]);

const Templates = ({ template_id, dispatch: formDispatch }) => {
  const { pathname, hash, search } = useLocation();
  const history = useHistory();
  const {
    queryParams,
    setFromPagination,
    setFromToolbar,
    dispatch: queryParamsDispatch,
  } = useQueryParams(qsConfig);

  const [preflightError, setPreFlightError] = useState(null);

  const {
    result: { options },
    error,
    isSuccess,
    request: fetchOptions,
  } = useRequest(
    useCallback(async () => {
      const response = await readJobExplorerOptions({ params: queryParams });
      return { options: response };
    }, [queryParams]),
    { options: {} }
  );

  const {
    result: { templates, count },
    error: templatesIsError,
    isLoading: templatesIsLoading,
    isSuccess: templatesIsSuccess,
    request: fetchEndpoints,
  } = useRequest(
    useCallback(async () => {
      const response = await readJobExplorer({ params: queryParams });
      return {
        templates: response.items,
        count: response.meta.count,
      };
    }, [queryParams]),
    {
      templates: [],
      count: 0,
      templatesIsError,
      templatesIsLoading,
      templatesIsSuccess,
    }
  );

  const onSort = (_ev, _idx, dir) => {
    queryParamsDispatch({
      type: 'SET_SORT_ORDER',
      value: { sort_order: dir },
    });
  };

  const sortParams = {
    sort: {
      sortBy: {
        direction: queryParams.sort_order,
      },
      onSort,
    },
  };

  useEffect(() => {
    insights.chrome.appNavClick({ id: 'savings-planner', secondaryNav: true });

    preflightRequest().catch((error) => {
      setPreFlightError({ preflightError: error });
    });
  }, []);

  const initialSearchParams = parse(search, {
    arrayFormat: 'bracket',
    parseBooleans: true,
    parseNumbers: true,
  });

  useEffect(() => {
    history.replace({
      pathname,
      hash,
      search: stringify(
        { ...initialQueryParams, ...initialSearchParams },
        { arrayFormat: 'bracket' }
      ),
    });
  }, []);

  useEffect(() => {
    fetchOptions();
    fetchEndpoints();
  }, [queryParams]);

  if (preflightError?.preflightError?.status === 403) {
    return <NotAuthorized {...notAuthorizedParams} />;
  }
  return (
    <>
      {preflightError && <EmptyState {...preflightError} />}

      {isSuccess && (
        <Form>
          <FormGroup
            label="Link a template to this plan:"
            fieldId="template-link-field"
          >
            <FilterableToolbar
              hideQuickDateRange
              hideSortOptions
              categories={options}
              filters={queryParams}
              qsConfig={qsConfig}
              setFilters={setFromToolbar}
              pagination={
                <Pagination
                  count={count}
                  params={{
                    limit: queryParams.limit,
                    offset: queryParams.offset,
                  }}
                  qsConfig={qsConfig}
                  setPagination={setFromPagination}
                  isCompact
                />
              }
            />
            {error && <ApiErrorState message={error.error} />}
            {templatesIsLoading && <LoadingState />}
            {templatesIsSuccess && templates.length <= 0 && <NoResults />}
            {templatesIsSuccess && templates.length > 0 && (
              <TableComposable
                aria-label="Template link table"
                variant="compact"
              >
                <Thead>
                  <Tr>
                    <Th />
                    <Th {...sortParams}>Name</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {templates.map(({ id, name }) => (
                    <Tr key={`template-detail-${id}`}>
                      <Td
                        data-testid={`radio-${id}`}
                        key={`template-detail-${id}-radio-td`}
                        select={{
                          rowIndex: id,
                          onSelect: (event, isSelected, value) =>
                            formDispatch({
                              type: actions.SET_TEMPLATE_ID,
                              value,
                            }),
                          isSelected: template_id === id,
                          variant: 'radio',
                        }}
                      />
                      <Td>{name}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </TableComposable>
            )}
            <ListFooter>
              <div>
                {template_id !== -2 && (
                  <Button
                    key="clear-selection-button"
                    variant="link"
                    aria-label="Clear selection"
                    onClick={() => {
                      formDispatch({
                        type: actions.SET_TEMPLATE_ID,
                        value: -2,
                      });
                    }}
                  >
                    Clear selection
                  </Button>
                )}
              </div>
              <Pagination
                count={count}
                params={{
                  limit: queryParams.limit,
                  offset: queryParams.offset,
                }}
                qsConfig={qsConfig}
                setPagination={setFromPagination}
                variant={PaginationVariant.bottom}
              />
            </ListFooter>
          </FormGroup>
        </Form>
      )}
    </>
  );
};

Templates.propTypes = {
  template_id: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Templates;
