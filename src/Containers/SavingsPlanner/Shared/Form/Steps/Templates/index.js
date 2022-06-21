import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
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

import LoadingState from '../../../../../../Components/ApiStatus/LoadingState';
import NoResults from '../../../../../../Components/ApiStatus/NoResults';
import ApiErrorState from '../../../../../../Components/ApiStatus/ApiErrorState';
import Pagination from '../../../../../../Components/Pagination';

import { useQueryParams } from '../../../../../../QueryParams/';

import {
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

  cluster_id: [],
  inventory_id: [],
  job_type: [],
  org_id: [],
  status: [],
  template_id: [],
};

const Templates = ({ template_id, dispatch: formDispatch }) => {
  const {
    queryParams,
    setFromPagination,
    setFromToolbar,
    dispatch: queryParamsDispatch,
  } = useQueryParams(initialQueryParams);

  const {
    result: options,
    error,
    isSuccess,
    request: fetchOptions,
  } = useRequest(async () => {
    // No idea why we are calling this endpoint without query but it seems to work
    const { quick_date_range, sort_options, ...rest } =
      await readJobExplorerOptions();
    return rest;
  }, {});

  const {
    result: { items: templates, meta },
    isLoading: templatesIsLoading,
    isSuccess: templatesIsSuccess,
    request: fetchEndpoints,
  } = useRequest(readJobExplorer, {
    items: [],
    meta: { count: 0 },
  });

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
    fetchOptions();
    fetchEndpoints(queryParams);
  }, [queryParams]);

  return isSuccess ? (
    <Form>
      <FormGroup
        label="Link a template to this plan:"
        fieldId="template-link-field"
      >
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
        />
        {error && <ApiErrorState message={error.error} />}
        {templatesIsLoading && <LoadingState />}
        {templatesIsSuccess && templates.length <= 0 && <NoResults />}
        {templatesIsSuccess && templates.length > 0 && (
          <TableComposable aria-label="Template link table" variant="compact">
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
                    data-cy={`radio-${id}`}
                    data-testid={`radio-${id}`}
                    key={`template-detail-${id}-radio-td`}
                    select={{
                      rowIndex: id,
                      onSelect: (_event, _isSelected, value) =>
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
            count={meta.count}
            params={{
              limit: +queryParams.limit,
              offset: +queryParams.offset,
            }}
            setPagination={setFromPagination}
            variant={PaginationVariant.bottom}
          />
        </ListFooter>
      </FormGroup>
    </Form>
  ) : null;
};

Templates.propTypes = {
  template_id: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Templates;
