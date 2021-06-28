import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { parse, stringify } from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

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

import LoadingState from '../../../Components/LoadingState';
import EmptyState from '../../../Components/EmptyState';
import NoResults from '../../../Components/NoResults';
import ApiErrorState from '../../../Components/ApiErrorState';
import Pagination from '../../../Components/Pagination';

import { notAuthorizedParams } from '../../../Utilities/constants';
import { useQueryParams } from '../../../Utilities/useQueryParams';
import useApi from '../../../Utilities/useApi';

import {
  preflightRequest,
  readJobExplorer,
  readJobExplorerOptions,
} from '../../../Api';

import FilterableToolbar from '../../../Components/Toolbar/';

import { actions } from './constants';

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
  sort_order: 'desc',
};

const Templates = ({ template_id, dispatch: formDispatch }) => {
  const [sortDirection, setSortDirection] = React.useState('desc');
  const columnIndex = 1;

  const onSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    queryParamsDispatch({
      type: 'SET_SORT_ORDER',
      value: { sort_order: sortDirection },
    });
  };
  const sortParams = {
    sort: {
      sortBy: {
        index: columnIndex,
        direction: sortDirection,
      },
      onSort,
      columnIndex,
    },
  };

  const { pathname, hash, search } = useLocation();
  const history = useHistory();

  const [preflightError, setPreFlightError] = useState(null);
  const [
    {
      isLoading,
      isSuccess,
      error,
      data: { meta = {}, items: templates = [] },
    },
    setData,
  ] = useApi({ meta: {}, items: [] });
  const [options, setOptions] = useApi({});

  const {
    queryParams,
    setFromPagination,
    setFromToolbar,
    dispatch: queryParamsDispatch,
  } = useQueryParams(initialQueryParams);

  useEffect(() => {
    insights.chrome.appNavClick({ id: 'job-explorer', secondaryNav: true });

    preflightRequest().catch((error) => {
      setPreFlightError({ preflightError: error });
    });

    const initialSearchParams = parse(search, {
      arrayFormat: 'bracket',
      parseBooleans: true,
      parseNumbers: true,
    });

    queryParamsDispatch({
      type: 'REINITIALIZE',
      value: {
        ...initialQueryParams,
        ...initialSearchParams,
      },
    });
  }, []);

  useEffect(() => {
    setData(readJobExplorer({ params: queryParams }));
    setOptions(readJobExplorerOptions({ params: queryParams }));
    history.replace({
      pathname,
      hash,
      search: stringify(queryParams, { arrayFormat: 'bracket' }),
    });
  }, [queryParams]);

  if (preflightError?.preflightError?.status === 403) {
    return <NotAuthorized {...notAuthorizedParams} />;
  }

  return (
    <>
      {preflightError && <EmptyState {...preflightError} />}

      {!preflightError && (
        <Form>
          <FormGroup
            label="Link a template to this plan:"
            fieldId="template-link-field"
          >
            <FilterableToolbar
              hideQuickDateRange
              hideSortOptions
              categories={options.data}
              filters={queryParams}
              setFilters={setFromToolbar}
              pagination={
                <Pagination
                  count={meta?.count}
                  params={{
                    limit: queryParams.limit,
                    offset: queryParams.offset,
                  }}
                  setPagination={setFromPagination}
                  isCompact
                />
              }
            />
            {error && <ApiErrorState message={error.error} />}
            {isLoading && <LoadingState />}
            {isSuccess && templates.length <= 0 && <NoResults />}
            {isSuccess && templates.length > 0 && (
              <TableComposable
                aria-label="Template link table"
                variant="compact"
              >
                <Thead>
                  <Tr>
                    <Th />
                    <Th key="0" {...sortParams}>
                      Name
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {templates.map(({ id, name }) => (
                    <Tr key={`template-detail-${id}`}>
                      <Td
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
                count={meta?.count}
                params={{
                  limit: queryParams.limit,
                  offset: queryParams.offset,
                }}
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
