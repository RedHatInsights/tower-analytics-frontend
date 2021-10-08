/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

import {
  Card,
  CardBody as PFCardBody,
  CardFooter,
  PaginationVariant,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core';

import Pagination from '../../../../Components/Pagination';

import { useQueryParams } from '../../../../QueryParams';

import useRequest from '../../../../Utilities/useRequest';

import ApiStatusWrapper from '../../../../Components/ApiStatus/ApiStatusWrapper';
import FilterableToolbar from '../../../../Components/Toolbar/Toolbar';

import { ReportGeneratorParams } from '../../Shared/types';
import { Chart, Table } from './';
import DownloadPdfButton from '../../../../Components/Toolbar/DownloadPdfButton';
import { useFeatureFlag, ValidFeatureFlags } from '../../../../FeatureFlags';
import { OptionsReturnType } from '../../../../Api';

const CardBody = styled(PFCardBody)`
  & .pf-c-toolbar,
  & .pf-c-toolbar__content {
    padding: 0;
  }
`;

const perPageOptions = [
  { title: '4', value: 4 },
  { title: '6', value: 6 },
  { title: '8', value: 8 },
  { title: '10', value: 10 },
];

const getDateFormatByGranularity = (granularity: string): string => {
  if (granularity === 'yearly') return 'formatAsYear';
  if (granularity === 'monthly') return 'formatAsMonth';
  if (granularity === 'daily') return 'formatDateAsDayMonth';
  return '';
};

const ReportCard: FunctionComponent<ReportGeneratorParams> = ({
  slug,
  defaultParams,
  defaultTableHeaders,
  tableAttributes,
  expandedAttributes,
  availableChartTypes,
  readData,
  readOptions,
  schemaFnc,
}) => {
  const pdfDownloadEnabled = useFeatureFlag(
    ValidFeatureFlags.pdfDownloadButton
  );

  const { queryParams, setFromPagination, setFromToolbar } =
    useQueryParams(defaultParams);

  const { request: setData, ...dataApi } = useRequest(
    useCallback(() => readData(queryParams), [queryParams]),
    { meta: { count: 0, legend: [] } }
  );

  const { result: options, request: setOptions } =
    useRequest<OptionsReturnType>(
      () => readOptions(queryParams) as Promise<OptionsReturnType>,
      { sort_options: [] }
    );

  useEffect(() => {
    setData();
    setOptions();
  }, [queryParams]);

  const [activeChartType, setActiveChartType] = useState('line');

  const tableHeaders = [
    ...defaultTableHeaders,
    ...(tableAttributes
      ? options.sort_options.filter(({ key }) => tableAttributes.includes(key))
      : options.sort_options),
  ];

  const chartParams = {
    y: queryParams.sort_options as string,
    label:
      options.sort_options?.find(({ key }) => key === queryParams.sort_options)
        ?.value || 'Label Y',
    xTickFormat: getDateFormatByGranularity(queryParams.granularity),
    chartType: activeChartType,
  };

  const getSortParams = (currKey: string) => {
    const onSort = (
      _event: unknown,
      index: number,
      direction: 'asc' | 'desc'
    ) => {
      setFromToolbar('sort_order', direction);
      setFromToolbar('sort_options', tableHeaders[index]?.key);
    };

    const whitelistKeys = options?.sort_options?.map(
      ({ key }: { key: string }) => key
    );
    if (!whitelistKeys?.includes(currKey)) return {};

    return {
      sort: {
        sortBy: {
          index:
            tableHeaders.findIndex(
              ({ key }) => key === queryParams.sort_options
            ) || 0,
          direction: queryParams.sort_order || 'none',
        },
        onSort,
        columnIndex: tableHeaders.findIndex(({ key }) => key === currKey),
      },
    };
  };

  const additionalControls = [
    availableChartTypes.length > 1 && (
      <ToggleGroup aria-label="Chart type toggle" key="chart-toggle">
        {availableChartTypes.map((chartType) => (
          <ToggleGroupItem
            key={chartType}
            text={chartType === 'bar' ? 'Bar Chart' : 'Line Chart'}
            buttonId={chartType}
            isSelected={chartType === activeChartType}
            onChange={() => setActiveChartType(chartType)}
          />
        ))}
      </ToggleGroup>
    ),
    pdfDownloadEnabled && (
      <DownloadPdfButton
        key="download-button"
        slug={slug}
        data={dataApi.result}
        y={chartParams.y}
        label={chartParams.label}
        xTickFormat={chartParams.xTickFormat}
      />
    ),
  ];
  return (
    <Card>
      <CardBody>
        <FilterableToolbar
          categories={options}
          filters={queryParams}
          setFilters={setFromToolbar}
          pagination={
            <Pagination
              count={dataApi.result.meta.count}
              perPageOptions={perPageOptions}
              params={{
                limit: +queryParams.limit,
                offset: +queryParams.offset,
              }}
              setPagination={setFromPagination}
              isCompact
            />
          }
          additionalControls={additionalControls}
        />
        {tableHeaders && (
          <ApiStatusWrapper api={dataApi}>
            <Chart
              schema={schemaFnc(
                chartParams.label,
                chartParams.y,
                chartParams.xTickFormat,
                chartParams.chartType
              )}
              data={dataApi.result}
            />
            <Table
              legend={dataApi.result.meta.legend}
              headers={tableHeaders}
              getSortParams={getSortParams}
              expandRows={expandedAttributes.length > 0}
            />
          </ApiStatusWrapper>
        )}
      </CardBody>
      <CardFooter>
        <Pagination
          count={dataApi.result.meta.count}
          perPageOptions={perPageOptions}
          params={{
            limit: +queryParams.limit,
            offset: +queryParams.offset,
          }}
          setPagination={setFromPagination}
          variant={PaginationVariant.bottom}
        />
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
