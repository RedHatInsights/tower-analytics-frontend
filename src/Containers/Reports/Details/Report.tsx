/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { FunctionComponent, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ChartBuilder, {
  ApiReturnType,
  functions,
} from 'react-json-chart-builder';

import {
  Card,
  CardBody,
  CardFooter,
  PaginationVariant,
} from '@patternfly/react-core';
import {
  TableComposable,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';

import Pagination from '../../../Components/Pagination';

import { useQueryParams } from '../../../Utilities/useQueryParams';

import useApi from '../../../Utilities/useApi';
import { formatTotalTime } from '../../../Utilities/helpers';

import { global_disabled_color_300 } from '@patternfly/react-tokens';
import ApiStatusWrapper from '../../../Components/ApiStatusWrapper';
import FilterableToolbar from '../../../Components/Toolbar/Toolbar';
import currencyFormatter from '../../../Utilities/currencyFormatter';

import { ReportGeneratorParams } from '../Shared/types';
import { ApiJson } from '../../../Api';

const customFunctions = (data: ApiReturnType) => ({
  ...functions,
  fetchFnc: () =>
    new Promise<ApiReturnType>((resolve) => {
      resolve(data);
    }),
});

const perPageOptions = [{ title: '4', value: 4 }];

const timeFields: string[] = ['elapsed'];
const costFields: string[] = [];

const isOther = (item: Record<string, string | number>, key: string) =>
  key === 'id' && item[key] === -1;

const getText = (
  item: Record<string, string | number>,
  key: string
): string => {
  if (isOther(item, key)) return '-';
  if (timeFields.includes(key)) return formatTotalTime(item[key]);
  if (costFields.includes(key)) return currencyFormatter(+item[key]);
  return `${item[key]}`;
};

const getOthersStyle = (item: Record<string, string | number>, key: string) => {
  if (isOther(item, key)) {
    return {
      backgroundColor: global_disabled_color_300.value,
    };
  }
  return {};
};

const Report: FunctionComponent<ReportGeneratorParams> = ({
  defaultParams,
  extraAttributes,
  readData,
  readOptions,
  schemaFnc,
}) => {
  const [api, setData] = useApi({} as ApiJson);
  const [options, setOptions] = useApi({} as ApiJson);

  const { queryParams, setFromPagination, setFromToolbar } =
    useQueryParams(defaultParams);

  const [attrPairs, setAttrPairs] = useState<Array<any>>([]);
  useEffect(() => {
    if(options.isSuccess) {
      setAttrPairs([
        ...options.data?.sort_options
      ]);
    }
  }, [options]);

  const combinedAttrPairs = [ ...extraAttributes, ...attrPairs ];

  const chartSchema = schemaFnc(
    combinedAttrPairs.find(({ key }) => key === queryParams.sort_options)?.value || 'Label Y',
    queryParams.sort_options as string
  );

  useEffect(() => {
    setData(readData({ params: queryParams }));
    setOptions(readOptions({ params: queryParams }));
  }, [queryParams]);


  const onSort = (
    _event: unknown,
    index: number,
    direction: 'asc' | 'desc'
  ) => {
    setFromToolbar('sort_order', direction);
    setFromToolbar('sort_options', combinedAttrPairs[index]?.key);
  };

  const getSorParams = (currKey: string) => {
    if (!options.isSuccess) return {};

    const whitelistKeys = options?.data?.sort_options?.map(
      ({ key }: { key: string }) => key
    );
    if (!whitelistKeys.includes(currKey)) return {};

    return {
      sort: {
        sortBy: {
          index: combinedAttrPairs.findIndex(({ key }) => key === queryParams.sort_options) || 0,
          direction: queryParams.sort_order || 'none'
        },
        onSort,
        columnIndex: combinedAttrPairs.findIndex(({ key }) => key === currKey)
      }
    }
  };

  return (
    <ApiStatusWrapper api={api}>
      <Card>
        <CardBody>
          <FilterableToolbar
            categories={options.data}
            filters={queryParams}
            setFilters={setFromToolbar}
            pagination={
              <Pagination
                count={api.data?.meta?.count}
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
          <ChartBuilder
            schema={chartSchema}
            functions={customFunctions(api.data)}
          />
          <TableComposable
            aria-label="Report Table"
            variant={TableVariant.compact}
          >
            <Thead>
              <Tr>
                {combinedAttrPairs.map(({ key, value }) => (
                  <Th
                    key={key}
                    {...getSorParams(key)}
                  >{value}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {api.data?.meta?.legend.map((item: Record<string, string | number>) => (
                <Tr key={item.id} style={getOthersStyle(item, 'id')}>
                  {combinedAttrPairs.map(({ key }) => (
                    <Td key={`${item.id}-${key}`}>{getText(item, key)}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </CardBody>
        <CardFooter>
          <Pagination
            count={api.data?.meta?.count}
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
  );
};

Report.propTypes = {
  defaultParams: PropTypes.any,
  extraAttributes: PropTypes.arrayOf(
    PropTypes.exact({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  readData: PropTypes.func.isRequired,
  readOptions: PropTypes.func.isRequired,
  schemaFnc: PropTypes.func.isRequired,
};

export default Report;
