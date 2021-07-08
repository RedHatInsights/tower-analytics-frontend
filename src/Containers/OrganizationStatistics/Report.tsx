import React, { FunctionComponent, useEffect } from 'react';

import ChartBuilder from 'react-json-chart-builder';
import schema, { customFunctions } from './schema';

import { Card, CardBody, CardFooter, Grid, GridItem } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

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

export const attrPairs: Record<string, string> = {
  id: 'ID',
  name: 'Template name',
  host_count: 'Host count',
  failed_host_count: 'Host failed count',
  unreachable_host_count: 'Host unreachable count',
  elapsed: 'Job elapsed time',
  failed_count: 'Job failed count',
  successful_count: 'Jobs successful count',
  total_count: 'Jobs total count'
}

const getText = (item: Record<string, string | number>, key: string) => {
  if (key === 'id' && item[key] === -1) {
    return '-'
  }

  return `${item[key]}`;
}

const perPageOptions = [
  { title: '4', value: 4 }
];

const Report: FunctionComponent<Record<string, never>> = () => {
  const [
    {
      isSuccess,
      data,
    },
    setData,
  ] = useApi({ meta: {}, dates: [] });
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
              count={data.meta?.count}
              perPageOptions={perPageOptions}
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
          <CardBody >
            <ChartBuilder schema={schema(queryParams)} functions={customFunctions(data)} />
            <TableComposable aria-label="Report Table">
              <Thead>
                <Tr>
                  {Object.values(attrPairs).map(name => (<Th key={name}>{name}</Th>))}
                </Tr>
              </Thead>
              <Tbody>
                {data.meta.legend.map((item: Record<string, string | number>) => (
                  <Tr key={item.id}>
                    {Object.keys(attrPairs).map(key => (
                      <Td key={`${item.id}-${key}`}>{getText(item, key)}</Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </TableComposable>
          </CardBody>
          <CardFooter>
            <Pagination
              count={data.meta?.count}
              perPageOptions={perPageOptions}
              params={{
                limit: queryParams.limit,
                offset: queryParams.offset,
              }}
              setPagination={setFromPagination}
            />
          </CardFooter>
        </Card>
      </GridItem>
    </Grid>
    
  )
}

export default Report;
