import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardFooter } from '@patternfly/react-core/dist/dynamic/components/Card';
import { PaginationVariant } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { ToggleGroupItem } from '@patternfly/react-core/dist/dynamic/components/ToggleGroup';
import { ToggleGroup } from '@patternfly/react-core/dist/dynamic/components/ToggleGroup';
import React, { FunctionComponent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OptionsReturnType, endpointFunctionMap } from '../../../../Api';
import ApiStatusWrapper from '../../../../Components/ApiStatus/ApiStatusWrapper';
import Chart from '../../../../Components/Chart';
import PlotlyChart from '../../../../Components/Chart/PlotlyChart';
import Pagination from '../../../../Components/Pagination';
import DownloadButton from '../../../../Components/Toolbar/DownloadButton';
import FilterableToolbar from '../../../../Components/Toolbar/Toolbar';
import { DEFAULT_NAMESPACE, useQueryParams } from '../../../../QueryParams';
import { createUrl } from '../../../../QueryParams';
import {
  reportDefaultParams,
  specificReportDefaultParams,
} from '../../../../Utilities/constants';
import { capitalize } from '../../../../Utilities/helpers';
import { getDateFormatByGranularity } from '../../../../Utilities/helpers';
import percentageFormatter from '../../../../Utilities/percentageFormatter';
import useRequest from '../../../../Utilities/useRequest';
import { perPageOptions } from '../../Shared/constants';
import hydrateSchema from '../../Shared/hydrateSchema';
import { StandardProps } from '../types';
import Table from './Table';

const ReportCard: FunctionComponent<StandardProps> = ({
  slug,
  name,
  description,
  tableHeaders,
  expandedTableRowName,
  clickableLinking,
  showPagination,
  showKebab,
  defaultSelectedToolbarCategory = '',
  availableChartTypes,
  dataEndpoint,
  optionsEndpoint,
  schema,
  fullCard = true,
}) => {
  const readData = endpointFunctionMap(dataEndpoint);
  const readOptions = endpointFunctionMap(optionsEndpoint);
  const defaultParams = reportDefaultParams(slug);
  const { queryParams, setFromPagination, setFromToolbar } =
    useQueryParams(defaultParams);
  const { queryParams: settingsQueryParams, dispatch } = useQueryParams(
    {
      chartType: availableChartTypes[0],
    },
    'settings'
  );

  const { result: options, request: fetchOptions } =
    useRequest<OptionsReturnType>(readOptions as any, {});

  const { request: fetchData, ...dataApi } = useRequest(readData as any, {
    meta: { count: 0, legend: [] },
  });

  const navigate = useNavigate();

  const navigateToHostScatter = (
    slug: string,
    templateId: any,
    clusterId: any,
    orgId: any,
    inventoryId: any,
    status: any,
    hostStatus: any,
    quickDateRange: any
  ) => {
    const initialQueryParams = {
      [DEFAULT_NAMESPACE]: {
        ...specificReportDefaultParams(slug),
        template_id: templateId,
        cluster_id: clusterId,
        org_id: orgId,
        inventory_id: inventoryId,
        status: status,
        host_status: hostStatus,
        quick_date_range: quickDateRange,
      },
    };
    navigate(createUrl(`reports\\${slug}`, true, initialQueryParams));
  };

  useEffect(() => {
    (fetchData as (any) => void)(queryParams as any);
    (fetchOptions as (any) => void)(queryParams);
  }, [queryParams]);

  const chartParams = {
    y: queryParams.sort_options as string,
    label:
      (options.sort_options as any)?.find(
        ({ key }) => key === queryParams.sort_options
      )?.value || 'Label Y',
    xTickFormat: getDateFormatByGranularity(queryParams.granularity as string),
    chartType: settingsQueryParams.chartType || availableChartTypes[0],
  };

  const formattedValue = (key: string, value: number) => {
    let val;
    switch (key) {
      case 'average_duration_per_task':
        val = value.toFixed(2) + ' seconds';
        break;
      case 'slow_hosts_percentage':
        val = percentageFormatter(value) + '%';
        break;
      case 'template_success_rate':
        val = percentageFormatter(value) + '%';
        break;
      default:
        val = value.toFixed(2);
    }
    return val;
  };

  const handleClick = (event, props) => {
    navigateToHostScatter(
      'host_anomalies_scatter',
      props.datum.id,
      queryParams.cluster_id,
      queryParams.org_id,
      queryParams.inventory_id,
      queryParams.status,
      queryParams.host_status,
      queryParams.quick_date_range
    );
    window.location.reload();
  };

  const customTooltipFormatting = ({ datum }) => {
    let tooltip;
    if (datum.host_status) {
      tooltip =
        'Host: ' +
        datum.host_name +
        '\nAverage duration per task: ' +
        formattedValue(queryParams.sortOptions as string, datum.y) +
        '\nHost status: ' +
        datum.host_status +
        '\nTotal tasks executed: ' +
        datum.total_tasks_executed +
        '\nLast Referenced: ' +
        datum.last_referenced +
        '\nSlow: ' +
        (datum.failed_duration ? 'True' : 'False');
    } else {
      tooltip =
        chartParams.label +
        ' for ' +
        datum.name +
        ': ' +
        formattedValue(queryParams.sort_options as string, datum.y);
    }
    return tooltip;
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

    const whitelistKeys = (options?.sort_options as any)?.map(
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
      <ToggleGroup aria-label='Chart type toggle' key='chart-toggle'>
        {availableChartTypes.map((chartType) => (
          <ToggleGroupItem
            key={chartType}
            data-cy={'chart_type'}
            text={`${capitalize(chartType)} Chart`}
            buttonId={chartType}
            isSelected={chartType === chartParams.chartType}
            onChange={() => {
              dispatch({ type: 'SET_CHART_TYPE', value: chartType });
            }}
          />
        ))}
      </ToggleGroup>
    ),
    <DownloadButton
      key='download-button'
      slug={slug}
      name={name}
      description={description}
      endpointUrl={dataEndpoint}
      queryParams={queryParams as any}
      selectOptions={options as any}
      y={chartParams.y}
      label={chartParams.label}
      xTickFormat={chartParams.xTickFormat}
      totalPages={Math.ceil(
        ((dataApi.result.meta as any).count as number) /
          (queryParams.limit as any as number)
      )}
      pageLimit={queryParams.limit as any}
      chartType={chartParams.chartType as string}
      sortOptions={chartParams.y}
      sortOrder={queryParams.sortOrder as any}
      dateGranularity={queryParams.granularity as string}
      startDate={queryParams.start_date as string}
      endDate={queryParams.end_date as string}
      dateRange={queryParams.quick_date_range as string}
      adoptionRateType={queryParams.adoption_rate_type as string}
    />,
  ];

  return fullCard ? (
    <Card data-cy={dataApi.isLoading ? 'toolbar_loading' : 'toolbar_loaded'}>
      <CardBody>
        <FilterableToolbar
          categories={options as any}
          defaultSelected={defaultSelectedToolbarCategory}
          filters={queryParams as any}
          setFilters={setFromToolbar}
          pagination={
            showPagination
              ? () => (
                  <Pagination
                    count={(dataApi.result.meta as any).count}
                    perPageOptions={perPageOptions}
                    params={{
                      limit: +(queryParams?.limit as unknown as number),
                      offset: +(queryParams?.offset as unknown as number),
                    }}
                    setPagination={setFromPagination as any}
                    isCompact
                  />
                )
              : null
          }
          additionalControls={additionalControls as any}
        />
        {tableHeaders && !showKebab && slug !== 'templates_by_organization' ? (
          <ApiStatusWrapper api={dataApi as any}>
            <Chart
              schema={hydrateSchema(schema as any)({
                label: chartParams.label,
                y: chartParams.y,
                xTickFormat: chartParams.xTickFormat,
                chartType: chartParams.chartType as any,
              })}
              dataComponent={'foobar'}
              data={dataApi.result as any}
              specificFunctions={{
                labelFormat: {
                  customTooltipFormatting,
                },
                onClick: {
                  handleClick,
                },
              }}
            />
            <Table
              legend={
                (dataApi.result.meta as any).tableData
                  ? (dataApi.result.meta as any).tableData
                  : (dataApi.result.meta as any).legend
              }
              headers={tableHeaders}
              getSortParams={getSortParams as any}
              expandedRowName={expandedTableRowName}
              clickableLinking={clickableLinking}
              showKebab={showKebab}
            />
          </ApiStatusWrapper>
        ) : tableHeaders &&
          !showKebab &&
          slug === 'templates_by_organization' ? (
          <ApiStatusWrapper api={dataApi as any}>
            <PlotlyChart data={(dataApi.result as any).items} />
            <Table
              legend={
                (dataApi.result.meta as any).tableData
                  ? (dataApi.result.meta as any).tableData
                  : (dataApi.result.meta as any).legend
              }
              headers={tableHeaders}
              getSortParams={getSortParams as any}
              expandedRowName={expandedTableRowName}
              clickableLinking={clickableLinking}
              showKebab={showKebab}
            />
          </ApiStatusWrapper>
        ) : (
          <>
            <ApiStatusWrapper api={dataApi as any}>
              <Chart
                schema={hydrateSchema(schema as any)({
                  label: chartParams.label,
                  y: chartParams.y,
                  xTickFormat: chartParams.xTickFormat,
                  chartType: chartParams.chartType as any,
                })}
                dataComponent={'foobar'}
                data={dataApi.result as any}
                specificFunctions={{
                  labelFormat: {
                    customTooltipFormatting,
                  },
                  onClick: {
                    handleClick,
                  },
                }}
              />
            </ApiStatusWrapper>
            <Table
              legend={
                (dataApi.result.meta as any).tableData
                  ? (dataApi.result.meta as any).tableData
                  : (dataApi.result.meta as any).legend
              }
              headers={tableHeaders}
              getSortParams={getSortParams as any}
              expandedRowName={expandedTableRowName}
              clickableLinking={clickableLinking}
              showKebab={showKebab}
            />
          </>
        )}
      </CardBody>
      <CardFooter>
        {showPagination && (
          <Pagination
            count={(dataApi.result.meta as any).count}
            perPageOptions={perPageOptions}
            params={{
              limit: queryParams.limit ? +queryParams.limit : 0,
              offset: queryParams.offset ? +queryParams.offset : 0,
            }}
            setPagination={setFromPagination as any}
            variant={PaginationVariant.bottom}
          />
        )}
      </CardFooter>
    </Card>
  ) : (
    <div data-cy={dataApi.isLoading ? 'toolbar_loading' : 'toolbar_loaded'}>
      <FilterableToolbar
        categories={options as any}
        defaultSelected={defaultSelectedToolbarCategory}
        filters={queryParams as any}
        setFilters={setFromToolbar}
        hasSettings={false}
        additionalControls={[]}
      />
      {tableHeaders && slug === 'templates_by_organization' ? (
        <ApiStatusWrapper api={dataApi as any}>
          <PlotlyChart data={(dataApi.result as any).items} />
        </ApiStatusWrapper>
      ) : (
        <ApiStatusWrapper api={dataApi as any}>
          <Chart
            schema={hydrateSchema(schema as any)({
              label: chartParams.label,
              y: chartParams.y,
              xTickFormat: chartParams.xTickFormat,
              chartType: chartParams.chartType as any,
            })}
            data={dataApi.result as any}
            specificFunctions={{
              labelFormat: {
                customTooltipFormatting,
              },
            }}
          />
        </ApiStatusWrapper>
      )}
    </div>
  );
};

export default ReportCard;
