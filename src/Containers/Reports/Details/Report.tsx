/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ChartBuilder, {
  ApiReturnType,
  functions,
} from 'react-json-chart-builder';

import {
  Card,
  CardBody as PFCardBody,
  CardFooter,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm, Divider,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  PaginationVariant,
} from '@patternfly/react-core';
import {
  ExpandableRowContent,
  TableComposable,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr as PFTr,
} from '@patternfly/react-table';

import Pagination from '../../../Components/Pagination';

import { useQueryParams } from '../../../Utilities/useQueryParams';

import useRequest from '../../../Utilities/useRequest';
import { formatDateTime, formatTotalTime } from '../../../Utilities/helpers';

import ApiStatusWrapper from '../../../Components/ApiStatus/ApiStatusWrapper';
import FilterableToolbar from '../../../Components/Toolbar/Toolbar';
import currencyFormatter from '../../../Utilities/currencyFormatter';

import { AttributesType, ReportGeneratorParams } from '../Shared/types';
import { getQSConfig } from '../../../Utilities/qs';
import EmptyList from '../../../Components/EmptyList';
import Breakdown from '../../../Charts/Breakdown';
import {categoryColor} from "../../../Utilities/constants";

const CardBody = styled(PFCardBody)`
  & .pf-c-toolbar,
  & .pf-c-toolbar__content {
    padding: 0;
  }
`;

const Tr = styled(PFTr)`
  & td:first-child {
    width: 50px;
  }
`;

const customFunctions = (data: ApiReturnType) => ({
  ...functions,
  axisFormat: {
    ...functions.axisFormat,
    formatAsYear: (tick: string) =>
      Intl.DateTimeFormat('en', { year: 'numeric' }).format(new Date(tick)),
    formatAsMonth: (tick: string) =>
      Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(tick)),
  },
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

const isNoName = (item: Record<string, string | number>, key: string) =>
  key === 'id' && item[key] === -2;

const getText = (
  item: Record<string, string | number>,
  key: string
): string => {
  if (isNoName(item, key)) return '-';
  if (isOther(item, key)) return '-';
  if (timeFields.includes(key)) return formatTotalTime(item[key]);
  if (costFields.includes(key)) return currencyFormatter(+item[key]);
  // TODO: Remove no name when api does not return empty values
  // https://issues.redhat.com/browse/AA-691
  return `${item[key]}` || 'No name';
};

const getOthersStyle = (item: Record<string, string | number>, key: string) => {
  if (isOther(item, key)) {
    return {
      backgroundColor: global_disabled_color_300.value,
    };
  }
  return {};
};

const getDateFormatByGranularity = (granularity: string): string => {
  if (granularity === 'yearly') return 'formatAsYear';
  if (granularity === 'monthly') return 'formatAsMonth';
  if (granularity === 'daily') return 'formatDateAsDayMonth';
};

const renderData = (
  dataApi,
  chartSchema,
  attrPairs,
  getSorParams,
  expandRows
) => {
  const [expanded, setExpanded] = useState([]);
  const handleExpansion = (row) => {
    if (expanded.some((s) => s.id === row.id)) {
      setExpanded((prevState) => [...prevState.filter((i) => i.id !== row.id)]);
    } else {
      setExpanded((prevState) => [...prevState, row]);
    }
  };

  if (dataApi.isSuccess && dataApi.result.meta?.count === 0)
    return <EmptyList />;

  const totalCount = (item) =>
    item
      ? {
          ok: item?.successful_count ?? 0,
          skipped: item?.skipped_count ?? 0,
          failed: item?.failed_count ?? 0,
          error: item?.error_count ?? 0,
        }
      : null;

  const totalTaskCount = (item) =>
    item
      ? {
          ok: item?.average_host_task_ok_count_per_host ?? 0,
          skipped: item?.average_host_task_skipped_count_per_host ?? 0,
          changed: item?.average_host_task_changed_count_per_host ?? 0,
          failed: item?.average_host_task_failed_count_per_host ?? 0,
          unreachable: item?.average_host_task_unreachable_count_per_host ?? 0,
        }
      : null;

  const totalHostCount = (item) =>
    item
      ? {
          ok: item?.ok_host_count ?? 0,
          skipped: item?.skipped_host_count ?? 0,
          changed: item?.changed_host_count ?? 0,
          failed: item?.failed_host_count ?? 0,
          unreachable: item?.unreachable_host_count ?? 0,
        }
      : null;

  const taskInfo = (task) => {
    return [
      {
        label: 'Task name',
        value: task.task_name,
      },
      {
        label: 'Module name',
        value: task.module_name,
      }
    ];
  }

  const renderFailedTaskBar = (item) => {
    const failed_tasks = item.most_failed_tasks
    if (failed_tasks != null) {
      return (
        <>
          <Flex>
            <FlexItem>
              <strong>Host status</strong>
            </FlexItem>
            <FlexItem align={{ default: 'alignRight' }}>
              <strong>Hosts</strong>
              {'  '}
              {item?.host_count ?? 0}
            </FlexItem>
            <FlexItem>
              <strong>Task status</strong>
            </FlexItem>
            <FlexItem align={{ default: 'alignRight' }}>
              <strong>Tasks</strong>
              {'  '}
              {item?.host_task_count ?? 0}
            </FlexItem>
          </Flex>
          <br />
          <p>
            <strong>All failed tasks</strong>
          </p>
          <Grid hasGutter>
            {failed_tasks
              .slice(0, failed_tasks.length)
              .map((task, idx) => {
                const hostCount = {
                  passed: task?.passed_host_count ?? 0,
                  failed: task?.failed_host_count ?? 0,
                  unreachable: task?.unreachable_host_count ?? 0,
                };
                const taskCount = {
                  passed: task?.successful_count ?? 0,
                  failed: task?.failed_count ?? 0,
                  unfinished: task?.unfinished_count ?? 0,
                };
                return (
                  <>
                    <Grid>
                      <GridItem>
                        <DescriptionList isHorizontal columnModifier={{ lg: '3Col' }}>
                          {taskInfo(task).map(({ label, value }) => (
                            <DescriptionListGroup key={label}>
                              <DescriptionListTerm>{label}</DescriptionListTerm>
                              <DescriptionListDescription>
                                {value}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          ))}
                        </DescriptionList>
                      </GridItem>
                      <GridItem lg={6} md={12} key={`hosts-${idx}`}>
                        <Breakdown
                          categoryCount={hostCount}
                          categoryColor={categoryColor}
                          showPercent
                        />
                      </GridItem>
                      {/*<GridItem lg={1} md={12} key={`divider-${idx}`}>*/}
                      {/*  <Divider isVertical />*/}
                      {/*</GridItem>**/}
                      <GridItem lg={6} md={12} key={`tasks-${idx}`}>
                        <Breakdown
                          categoryCount={taskCount}
                          categoryColor={categoryColor}
                          showPercent
                        />
                      </GridItem>
                    </Grid>
                  </>
                );
              })}
          </Grid>
        </>
      );
    }
  };

  const expandedInfo = (item) => {
    return [
      {
        label: 'Clusters',
        value: item.total_cluster_count ?? 0,
      },
      {
        label: 'Organizations',
        value: item.total_org_count ?? 0,
      }
    ];
  }

  return (
    <>
      <ChartBuilder
        schema={chartSchema}
        functions={customFunctions(dataApi.result as unknown as ApiReturnType)}
      />
      <TableComposable aria-label="Report Table" variant={TableVariant.compact}>
        <Thead>
          <Tr>
            {expandRows && <Th></Th>}
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
              <>
                <Tr key={item.id} style={getOthersStyle(item, 'id')}>
                  {attrPairs.map(({ key, value }, index) => (
                    <>
                      {expandRows && index === 0 && (
                        <Td
                          expand={{
                            rowIndex: item.id.id,
                            isExpanded: expanded.some((s) => s.id === item.id),
                            onToggle: () => handleExpansion(item),
                          }}
                        />
                      )}
                      {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
                      <Td key={`${item.id}-${key}`}>{getText(item, key)}</Td>
                    </>
                  ))}
                </Tr>
                {expandRows && (
                  <Tr isExpanded={expanded.some((s) => s.id === item.id)}>
                    <Td colSpan={6}>
                      <ExpandableRowContent>
                        <Flex>
                          <FlexItem>
                            <strong>Job status</strong>
                          </FlexItem>
                          <FlexItem align={{ default: 'alignRight' }}>
                            <strong>Jobs</strong>
                            {'  '}
                            {item?.total_count ?? 0}
                          </FlexItem>
                        </Flex>
                        <Breakdown
                          categoryCount={totalCount(item)}
                          categoryColor={categoryColor}
                          showPercent
                        />

                        <Flex>
                          <FlexItem>
                            <strong>All Host status</strong>
                          </FlexItem>
                          <FlexItem align={{ default: 'alignRight' }}>
                            <strong>Hosts</strong>
                            {'  '}
                            {item?.host_count ?? 0}
                          </FlexItem>
                        </Flex>
                        <Breakdown
                          categoryCount={totalHostCount(item)}
                          categoryColor={categoryColor}
                          showPercent
                        />

                        <Flex>
                          <FlexItem>
                            <strong>All Task status</strong>
                          </FlexItem>
                          <FlexItem align={{ default: 'alignRight' }}>
                            <strong>Tasks</strong>
                            {'  '}
                            {item?.host_task_count ?? 0}
                          </FlexItem>
                        </Flex>
                        <Breakdown
                          categoryCount={totalTaskCount(item)}
                          categoryColor={categoryColor}
                          showPercent
                        />

                        <Divider
                          component="div"
                          style={{ marginTop: '2rem', marginBottom: '1.5rem' }}
                        />

                        {renderFailedTaskBar(item)}

                        <DescriptionList isHorizontal columnModifier={{ lg: '3Col' }}>
                          {expandedInfo(item).map(({ label, value }) => (
                            <DescriptionListGroup key={label}>
                              <DescriptionListTerm>{label}</DescriptionListTerm>
                              <DescriptionListDescription>
                                {value}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          ))}
                        </DescriptionList>
                      </ExpandableRowContent>
                    </Td>
                  </Tr>
                )}
              </>
            )
          )}
        </Tbody>
      </TableComposable>
    </>
  );
};

const Report: FunctionComponent<ReportGeneratorParams> = ({
  defaultParams,
  extraAttributes,
  readData,
  readOptions,
  schemaFnc,
  expandRows,
  listAttributes
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qsConfig = getQSConfig('non-unique-report', defaultParams as any, [
    'limit',
    'offset',
  ]);

  const { queryParams, setFromPagination, setFromToolbar } =
    useQueryParams(qsConfig);

  const { request: setData, ...dataApi } = useRequest(
    useCallback(() => readData(queryParams), [queryParams]),
    {}
  );

  const { result: options, request: setOptions } = useRequest(
    useCallback(() => readOptions(queryParams), [queryParams]),
    {}
  );

  const [attrPairs, setAttrPairs] = useState<AttributesType>([]);
  useEffect(() => {
    if (listAttributes && options.sort_options) {
      const attrsList = options.sort_options.filter(({ key }) => listAttributes.includes(key));
      setAttrPairs([...extraAttributes, ...attrsList]);
    } else if (options.sort_options) {
      setAttrPairs([...extraAttributes, ...options.sort_options]);
    }
  }, [options, extraAttributes]);

  const chartSchema = schemaFnc(
    attrPairs.find(({ key }) => key === queryParams.sort_options)?.value ||
      'Label Y',
    queryParams.sort_options as string,
    getDateFormatByGranularity(queryParams.granularity)
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
    if (!whitelistKeys?.includes(currKey)) return {};

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
          {renderData(
            dataApi,
            chartSchema,
            attrPairs,
            getSorParams,
            expandRows
          )}
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

export default Report;
