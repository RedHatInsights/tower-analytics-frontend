import React, { FunctionComponent, useEffect } from 'react';

import ChartBuilder from 'react-json-chart-builder';
import schema, { customFunctions } from './schema';

import { Card, CardBody, CardFooter, PaginationVariant } from '@patternfly/react-core';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import Pagination from '../../Components/Pagination';

import { useQueryParams } from '../../Utilities/useQueryParams';

import { readJobExplorer } from '../../Api';
import useApi from '../../Utilities/useApi';
import { formatTotalTime } from '../../Utilities/helpers';

import { global_disabled_color_300 } from '@patternfly/react-tokens';
import ApiStatusWrapper from '../../Components/ApiStatusWrapper';

const perPageOptions = [
  { title: '4', value: 4 }
];

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

export const attrPairs: { key: string, name: string }[] = [
  { key: 'id', name: 'ID' },
  { key: 'name', name: 'Template name' },
  { key: 'host_count', name: 'Host count' },
  { key: 'failed_host_count', name: 'Host failed count' },
  { key: 'unreachable_host_count', name: 'Host unreachable count' },
  { key: 'elapsed', name: 'Job elapsed time' },
  { key: 'failed_count', name: 'Job failed count' },
  { key: 'successful_count', name: 'Jobs successful count' },
  { key: 'total_count', name: 'Jobs total count' }
];

const isOther = (item: Record<string, string | number>, key: string) => (key === 'id' && item[key] === -1);

const getText = (item: Record<string, string | number>, key: string) => {
  if (isOther(item, key)) {
    return '-'
  } else if (key === "elapsed") {
    return formatTotalTime(item[key])
  }
  return `${item[key]}`;
}

const getOthersStyle = (item: Record<string, string | number>, key: string) => {
  if (isOther(item, key)) {
    return {
      backgroundColor: global_disabled_color_300.value
    }
  }
  return {};
}

const Report: FunctionComponent<Record<string, never>> = () => {
  const [
    apiStatus,
    setData,
  ] = useApi({ meta: { legend: [], count: 0 }, dates: [] });
  const { queryParams, setFromPagination, setFromToolbar } = useQueryParams(
    defaultParams
  );

  useEffect(() => {
    setData(readJobExplorer({ params: queryParams }));
  }, [queryParams]);

  const onSort = (_event: any, index: number, direction: 'asc' | 'desc') => {
    setFromToolbar('sort_order', direction);
    setFromToolbar('sort_options', attrPairs[index]?.key);
  };

  const getSorParams = (currKey: string) => {
    const blaclistKeys = ['id', 'name'];

    if (blaclistKeys.includes(currKey))
      return {};

    return {
      sort: {
        sortBy: {
          index: attrPairs.findIndex(({ key }) => key === queryParams.sort_options) || 0,
          direction: queryParams.sort_order || 'none'
        },
        onSort,
        columnIndex: attrPairs.findIndex(({ key }) => key === currKey)
      }
    }
  };

  return (
    <ApiStatusWrapper api={apiStatus}>
      <Card>
        <CardBody>
          <Pagination
            count={apiStatus.data.meta.count}
            perPageOptions={perPageOptions}
            params={{
              limit: queryParams.limit,
              offset: queryParams.offset,
            }}
            setPagination={setFromPagination}
          />
          <ChartBuilder schema={schema(queryParams)} functions={customFunctions(apiStatus.data)} />
          <TableComposable aria-label="Report Table">
            <Thead>
              <Tr>
                {attrPairs.map(({ key, name }) => (
                  <Th
                    key={key}
                    {...getSorParams(key)}
                  >{name}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {apiStatus.data.meta.legend.map((item: Record<string, string | number>) => (
                <Tr key={item.id} style={getOthersStyle(item, 'id')}>
                  {attrPairs.map(({ key }) => (
                    <Td key={`${item.id}-${key}`}>{getText(item, key)}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </CardBody>
        <CardFooter>
          <Pagination
            count={apiStatus.data.meta.count}
            perPageOptions={perPageOptions}
            params={{
              limit: queryParams.limit,
              offset: queryParams.offset,
            }}
            setPagination={setFromPagination}
            variant={PaginationVariant.bottom}
          />
        </CardFooter>
      </Card>
    </ApiStatusWrapper>
  )
}

export default Report;
