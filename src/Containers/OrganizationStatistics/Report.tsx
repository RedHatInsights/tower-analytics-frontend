import React, { FunctionComponent, useEffect, useState } from 'react';

import ChartBuilder, { ApiReturnType, functions } from 'react-json-chart-builder';
import schema from './schema';

import { Card, CardBody, CardFooter, PaginationVariant } from '@patternfly/react-core';
import { TableComposable, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import Pagination from '../../Components/Pagination';

import { useQueryParams } from '../../Utilities/useQueryParams';

import { readJobExplorer, readJobExplorerOptions } from '../../Api';
import useApi from '../../Utilities/useApi';
import { formatTotalTime } from '../../Utilities/helpers';

import { global_disabled_color_300 } from '@patternfly/react-tokens';
import ApiStatusWrapper from '../../Components/ApiStatusWrapper';
import FilterableToolbar from '../../Components/Toolbar/Toolbar';
import currencyFormatter from '../../Utilities/currencyFormatter';

const customFunctions = (data: ApiReturnType) => ({
  ...functions,
  fetchFnc: () => new Promise<ApiReturnType>((resolve) => { resolve(data); })
});

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

const timeFields: string[] = ['elapsed'];
const costFields: string[] = [];

const isOther = (item: Record<string, string | number>, key: string) => (key === 'id' && item[key] === -1);

const getText = (item: Record<string, string | number>, key: string): string => {
  if (isOther(item, key)) return '-';
  if (timeFields.includes(key)) return formatTotalTime(item[key]);
  if (costFields.includes(key)) return currencyFormatter(+item[key]);
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
  const extraAttr: { key: string, value: string }[] = [
    { key: 'id', value: 'ID' },
    { key: 'name', value: 'Template name' },
  ];

  const [apiStatus, setData] = useApi({});
  const [options, setOptions] = useApi({});

  const { queryParams, setFromPagination, setFromToolbar } = useQueryParams(
    defaultParams
  );

  const [attrPairs, setAttrPairs] = useState(extraAttr);

  const chartSchema = schema(
    attrPairs.find(({ key }) => key === queryParams.sort_options)?.value || 'Label Y',
    queryParams.sort_options
  );

  useEffect(() => {
    setData(readJobExplorer({ params: queryParams }));
    setOptions(readJobExplorerOptions({ params: queryParams }));
  }, [queryParams]);

  useEffect(() => {
    if(options.isSuccess) {
      setAttrPairs([
        ...extraAttr,
        ...options.data?.sort_options
      ]);
    }
  }, [options]);

  const onSort = (_event: any, index: number, direction: 'asc' | 'desc') => {
    setFromToolbar('sort_order', direction);
    setFromToolbar('sort_options', attrPairs[index]?.key);
  };

  const getSorParams = (currKey: string) => {
    if (!options.isSuccess)
      return {};

    const whitelistKeys = options?.data?.sort_options?.map(({ key }: { key: string }) => key);
    if (!whitelistKeys.includes(currKey))
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
          <FilterableToolbar
            categories={options.data}
            filters={queryParams}
            setFilters={setFromToolbar}
            pagination={
              <Pagination
                count={apiStatus.data?.meta?.count}
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
          <ChartBuilder schema={chartSchema} functions={customFunctions(apiStatus.data)} />
          <TableComposable aria-label="Report Table" variant={TableVariant.compact}>
            <Thead>
              <Tr>
                {attrPairs.map(({ key, value }) => (
                  <Th
                    key={key}
                    {...getSorParams(key)}
                  >{value}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {apiStatus.data?.meta?.legend.map((item: Record<string, string | number>) => (
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
            count={apiStatus.data?.meta?.count}
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
