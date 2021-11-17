/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  Card,
  CardBody,
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
import Chart from './Chart';
import Table from './Table';
import DownloadPdfButton from '../../../../Components/Toolbar/DownloadPdfButton';
import { endpointFunctionMap, OptionsReturnType } from '../../../../Api';
import { capitalize } from '../../../../Utilities/helpers';
import { perPageOptions } from '../../Shared/constants';
import hydrateSchema from '../../Shared/hydrateSchema';

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
  dataEndpoint,
  optionEndpoint,
  schema,
}) => {
  const { queryParams, setFromPagination, setFromToolbar } =
    useQueryParams(defaultParams);

  const { request: setData, ...dataApi } = useRequest(
    (qp) => endpointFunctionMap(dataEndpoint)(qp),
    { meta: { count: 0, legend: [] } }
  );

  const { result: options, request: setOptions } =
    useRequest<OptionsReturnType>(
      (qp) =>
        endpointFunctionMap(optionEndpoint)(qp) as Promise<OptionsReturnType>,
      { sort_options: [] }
    );

  useEffect(() => {
    setData(queryParams);
    setOptions(queryParams);
  }, [queryParams]);

  const [activeChartType, setActiveChartType] = useState(
    availableChartTypes[0]
  );

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
            text={`${capitalize(chartType)} Chart`}
            buttonId={chartType}
            isSelected={chartType === activeChartType}
            onChange={() => setActiveChartType(chartType)}
          />
        ))}
      </ToggleGroup>
    ),
    <DownloadPdfButton
      key="download-button"
      slug={slug}
      endpointUrl={dataEndpoint}
      queryParams={queryParams}
      y={chartParams.y}
      label={chartParams.label}
      xTickFormat={chartParams.xTickFormat}
      totalCount={dataApi.result.meta.count}
    />,
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
              schema={hydrateSchema(schema)({
                label: chartParams.label,
                y: chartParams.y,
                xTickFormat: chartParams.xTickFormat,
                chartType: chartParams.chartType,
              })}
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
