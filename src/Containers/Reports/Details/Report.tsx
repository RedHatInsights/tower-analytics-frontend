/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
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

import useRequest from '../../../Utilities/useRequest';
import { formatTotalTime } from '../../../Utilities/helpers';

import { global_disabled_color_300 } from '@patternfly/react-tokens';
import ApiStatusWrapper from '../../../Components/ApiStatusWrapper';
import FilterableToolbar from '../../../Components/Toolbar/Toolbar';
import currencyFormatter from '../../../Utilities/currencyFormatter';

import { AttributesType, ReportGeneratorParams } from '../Shared/types';
import { getQSConfig } from '../../../Utilities/qs';

const customFunctions = (data: ApiReturnType) => ({
  ...functions,
  fetchFnc: () =>
    new Promise<ApiReturnType>((resolve) => {
      resolve(data);
    }),
});

const perPageOptions = [
  { title: '4', value: 4 },
  { title: '6', value: 6 },
  { title: '8', value: 8 },
  { title: '10', value: 10 },
];

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qsConfig = getQSConfig('non-unique-report', defaultParams as any, [
    'limit',
    'offset',
  ]);

  const { queryParams, setFromPagination, setFromToolbar } =
    useQueryParams(qsConfig);

  const { request: setData, ...dataApi } = useRequest(
    useCallback(() => readData({ params: queryParams }), [queryParams]),
    {}
  );

  const { result: options, request: setOptions } = useRequest(
    useCallback(() => readOptions({ params: queryParams }), [queryParams]),
    []
  );

  const [attrPairs, setAttrPairs] = useState<AttributesType>([]);
  useEffect(() => {
    if (options.sort_options) {
      setAttrPairs([...extraAttributes, ...options.sort_options]);
    }
  }, [options, extraAttributes]);

  const chartSchema = schemaFnc(
    attrPairs.find(({ key }) => key === queryParams.sort_options)?.value ||
      'Label Y',
    queryParams.sort_options as string
  );

  useEffect(() => {
    setData();
    setOptions();
  }, [queryParams]);

  const onSort = (
    _event: unknown,
    index: number,
    direction: 'asc' | 'desc'
  ) => {
    setFromToolbar('sort_order', direction);
    setFromToolbar('sort_options', attrPairs[index]?.key);
  };

  const getSorParams = (currKey: string) => {
    const whitelistKeys = options?.sort_options?.map(
      ({ key }: { key: string }) => key
    );
    if (!whitelistKeys.includes(currKey)) return {};

    return {
      sort: {
        sortBy: {
          index:
            attrPairs.findIndex(
              ({ key }) => key === queryParams.sort_options
            ) || 0,
          direction: queryParams.sort_order || 'none',
        },
        onSort,
        columnIndex: attrPairs.findIndex(({ key }) => key === currKey),
      },
    };
  };

  return (
    <Card>
      <CardBody>
        <FilterableToolbar
          categories={options}
          filters={queryParams}
          qsConfig={qsConfig}
          setFilters={setFromToolbar}
          pagination={
            <Pagination
              count={dataApi.result?.meta?.count}
              perPageOptions={perPageOptions}
              params={{
                limit: queryParams.limit,
                offset: queryParams.offset,
              }}
              qsConfig={qsConfig.defaultParams}
              setPagination={setFromPagination}
              isCompact
            />
          }
        />
        <ApiStatusWrapper api={dataApi}>
          <ChartBuilder
            schema={chartSchema}
            functions={customFunctions(dataApi.result)}
          />
          <TableComposable
            aria-label="Report Table"
            variant={TableVariant.compact}
          >
            <Thead>
              <Tr>
                {attrPairs.map(({ key, value }) => (
                  <Th key={key} {...getSorParams(key)}>
                    {value}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {dataApi.result.meta?.legend.map(
                (item: Record<string, string | number>) => (
                  <Tr key={item.id} style={getOthersStyle(item, 'id')}>
                    {attrPairs.map(({ key }) => (
                      <Td key={`${item.id}-${key}`}>{getText(item, key)}</Td>
                    ))}
                  </Tr>
                )
              )}
            </Tbody>
          </TableComposable>
        </ApiStatusWrapper>
      </CardBody>
      <CardFooter>
        <Pagination
          count={dataApi.result?.meta?.count}
          perPageOptions={perPageOptions}
          params={{
            limit: queryParams.limit,
            offset: queryParams.offset,
          }}
          qsConfig={qsConfig.defaultParams}
          setPagination={setFromPagination}
          variant={PaginationVariant.bottom}
        />
      </CardFooter>
    </Card>
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
