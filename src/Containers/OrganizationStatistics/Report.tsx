import React, { FunctionComponent, useEffect } from 'react';

import ChartBuilder from 'react-json-chart-builder';
import schema, { customFunctions } from './schema';

import { Card, CardBody, Grid, GridItem } from '@patternfly/react-core';
import { TableComposable, Tbody, Th, Thead, Tr } from '@patternfly/react-table';

import Pagination from '../../Components/Pagination';


import FilterableToolbar from '../../Components/Toolbar/Toolbar';
import { useQueryParams } from '../../Utilities/useQueryParams';

import { readJobExplorer, readJobExplorerOptions } from '../../Api';
import useApi from '../../Utilities/useApi';

const defaultParams = {
  limit: 4,
  offset: 0,
  attributes: [
    'failed_count',
    'successful_count',
    'canceled_count',
    'total_count',
    'failed_host_count',
    'unreachable_host_count',
    'host_count',
    'elapsed',
  ],
  group_by: 'template',
  group_by_time: true,
  granularity: 'monthly',
  sort_options: 'total_count',
  sort_order: 'desc',
}

const Report: FunctionComponent<Record<string, never>> = () => {
  const [
    {
      isSuccess,
      data: { meta = {}, items: data = [] },
    },
    setData,
  ] = useApi({ meta: {}, items: [] });
  const [options, setOptions] = useApi({}, ({ sort_options, sort_order }) => ({ sort_options, sort_order }));
  const { queryParams, setFromToolbar, setFromPagination } = useQueryParams(
    defaultParams
  );

  useEffect(() => {
    setOptions(readJobExplorerOptions({ params: queryParams }));
    setData(readJobExplorer({ params: queryParams }));
  }, [queryParams]);

  // TODO - make this normal furute me
  if (!isSuccess) {
    return <div style={{ height: '500px' }}></div>;
  }

  return (
    <Grid>
      <GridItem>
        <FilterableToolbar
          categories={options.data}
          filters={queryParams}
          setFilters={setFromToolbar}
          pagination={
            <Pagination
              count={meta?.count}
              perPageOptions={[
                { title: '4', value: 4 }
              ]}
              params={{
                limit: queryParams.limit,
                offset: queryParams.offset,
              }}
              setPagination={setFromPagination}
              isCompact
            />
          }
        />
      </GridItem>
      <GridItem>
        <Card>
          <CardBody>
            <ChartBuilder schema={schema(queryParams)} functions={customFunctions} />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem>
        <Card>
          <CardBody>
            <TableComposable aria-label="Report Table" variant="compact">
              <Thead>
                <Tr>
                  <Th>NonEmpty</Th>
                </Tr>
              </Thead>
              <Tbody></Tbody>
            </TableComposable>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
    
  )
}

export default Report;
