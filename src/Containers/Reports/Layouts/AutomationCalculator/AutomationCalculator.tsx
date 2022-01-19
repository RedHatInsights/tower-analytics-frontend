/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, FC } from 'react';
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Stack,
  StackItem,
  CardHeader,
  CardTitle,
  CardFooter,
  PaginationVariant,
} from '@patternfly/react-core';

// Imports from custom components
import FilterableToolbar from '../../../../Components/Toolbar';
import Pagination from '../../../../Components/Pagination';

// Imports from utilities
import {
  useQueryParams,
  useRedirect,
  DEFAULT_NAMESPACE,
} from '../../../../QueryParams';
import { jobExplorer } from '../../../../Utilities/constants';
import {
  calculateDelta,
  convertSecondsToHours,
} from '../../../../Utilities/helpers';
import useRequest from '../../../../Utilities/useRequest';

// Chart
import Chart from '../../../../Components/Chart';

// Local imports
import TotalSavings from './TotalSavings';
import CalculationCost from './CalculationCost';
import AutomationFormula from './AutomationFormula';
import TemplatesTable from './TemplatesTable';
import { Paths } from '../../../../paths';
import ApiStatusWrapper from '../../../../Components/ApiStatus/ApiStatusWrapper';
import { perPageOptions as defaultPerPageOptions } from '../../Shared/constants';
import DownloadPdfButton from '../../../../Components/Toolbar/DownloadPdfButton';
import { endpointFunctionMap } from '../../../../Api';
import { AutmationCalculatorProps } from '../types';
import hydrateSchema from '../../Shared/hydrateSchema';
import currencyFormatter from '../../../../Utilities/currencyFormatter';

const perPageOptions = [
  ...defaultPerPageOptions,
  { title: '15', value: 15 },
  { title: '20', value: 20 },
  { title: '25', value: 25 },
];

const mapApi = ({ legend = [] }) =>
  legend.map((el) => ({
    ...el,
    delta: 0,
    avgRunTime: 3600,
    manualCost: 0,
    automatedCost: 0,
    enabled: true,
  }));

const filterDisabled = (data) => data.filter(({ enabled }) => enabled);

const updateDeltaCost = (data, costAutomation, costManual) =>
  data.map((el) => {
    const manualCost =
      convertSecondsToHours(el.avgRunTime) *
      el.successful_hosts_total *
      parseFloat(costManual);
    const automatedCost =
      convertSecondsToHours(el.successful_elapsed_total) *
      parseFloat(costAutomation);
    const delta = calculateDelta(automatedCost, manualCost);

    return { ...el, delta, manualCost, automatedCost };
  });

const computeTotalSavings = (data) =>
  data.reduce((sum, curr) => sum + curr.delta, 0);

const AutomationCalculator: FC<AutmationCalculatorProps> = ({
  slug,
  defaultParams,
  dataEndpoint,
  optionsEndpoint,
  schema,
}) => {
  const readData = endpointFunctionMap(dataEndpoint);
  const readOptions = endpointFunctionMap(optionsEndpoint);

  const [costManual, setCostManual] = useState('50');
  const [costAutomation, setCostAutomation] = useState('20');

  const redirect = useRedirect();
  const { queryParams, setFromToolbar, setFromPagination } =
    useQueryParams(defaultParams);

  const { result: options, request: fetchOptions } = useRequest(readOptions, {
    sort_options: [
      {
        key: defaultParams.sort_options,
        value: defaultParams.sort_options,
      },
    ],
  });

  const {
    request: fetchData,
    setValue: setApiData,
    ...api
  } = useRequest(
    async (params) => {
      const response = await readData(params);

      return {
        ...response,
        items: updateDeltaCost(
          mapApi(response.meta),
          costAutomation,
          costManual
        ),
      };
    },
    {
      items: [],
      meta: {
        count: 0,
      },
    }
  );

  const setValue = (items) =>
    setApiData({
      ...api.result,
      items,
    });

  /**
   * Modifies one elements avgRunTime in the unfilteredData
   * and updates all calculated fields.
   * Used in top templates.
   */
  const setDataRunTime = (seconds, id) => {
    const updatedData = api.result.items.map((el) => {
      if (el.id === id) {
        el.avgRunTime = seconds;
        const updatedDelta = updateDeltaCost(
          [el],
          costAutomation,
          costManual
        )[0];
        return updatedDelta;
      } else {
        return el;
      }
    });

    setValue(updatedData);
  };

  const setEnabled = (id) => (value) => {
    if (!id) {
      setValue(api.result.items.map((el) => ({ ...el, enabled: value })));
    } else {
      setValue(
        api.result.items.map((el) =>
          el.id === id ? { ...el, enabled: value } : el
        )
      );
    }
  };

  /**
   * Recalculates the delta and costs in the data after the cost is changed.
   */
  useEffect(() => {
    setValue(updateDeltaCost(api.result.items, costAutomation, costManual));
  }, [costAutomation, costManual]);

  /**
   * Get data from API depending on the queryParam.
   */
  useEffect(() => {
    fetchOptions(queryParams);
    fetchData(queryParams);
  }, [queryParams]);

  /**
   * Function to redirect to the job explorer page
   * with the same filters as is used here.
   */
  const redirectToJobExplorer = (templateId) => {
    const initialQueryParams = {
      [DEFAULT_NAMESPACE]: {
        ...jobExplorer.defaultParams,
        quick_date_range: 'last_30_days',
        template_id: [templateId],
      },
    };

    redirect(Paths.jobExplorer, initialQueryParams);
  };

  const chartParams = {
    y: queryParams.sort_options,
    tooltip: 'Savings for',
    field: queryParams.sort_options,
    label:
      options.sort_options?.find(({ key }) => key === queryParams.sort_options)
        ?.value || 'Label Y',
  };

  const formattedValue = (key: string, value: number) => {
    let val;
    switch (key) {
      case 'elapsed':
        val = value.toFixed(2) + ' seconds';
        break;
      case 'template_automation_percentage':
        val = value.toFixed(2) + '%';
        break;
      case 'successful_hosts_savings':
      case 'failed_hosts_costs':
      case 'monetary_gain':
        val = currencyFormatter(value);
        break;
      default:
        val = value.toFixed(2);
    }
    return val;
  };

  const customTooltipFormatting = ({ datum }) => {
    const tooltip =
      'Savings for ' +
      datum.name +
      ': ' +
      formattedValue(queryParams.sort_options, datum.y);
    return tooltip;
  };

  const renderLeft = () => (
    <Card isPlain>
      <CardHeader>
        <CardTitle>Automation savings</CardTitle>
      </CardHeader>
      <CardBody>
        <Chart
          schema={hydrateSchema(schema)({
            label: chartParams.label,
            tooltip: chartParams.tooltip,
            field: chartParams.field,
          })}
          data={{
            items: filterDisabled(api.result.items),
          }}
          specificFunctions={{
            labelFormat: {
              customTooltipFormatting,
            },
          }}
        />
      </CardBody>
    </Card>
  );

  const renderRight = () => (
    <Stack>
      <StackItem>
        <TotalSavings
          totalSavings={computeTotalSavings(filterDisabled(api.result.items))}
        />
      </StackItem>
      <StackItem>
        <Stack>
          <StackItem>
            <CalculationCost
              costManual={costManual}
              setCostManual={setCostManual}
              costAutomation={costAutomation}
              setCostAutomation={setCostAutomation}
            />
          </StackItem>
          <StackItem>
            <AutomationFormula />
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  );

  const renderContents = () => (
    <Card>
      <CardBody>
        <FilterableToolbar
          categories={options}
          filters={queryParams}
          setFilters={setFromToolbar}
          pagination={
            <Pagination
              count={api.result.meta.count}
              perPageOptions={perPageOptions}
              params={{
                limit: +queryParams.limit,
                offset: +queryParams.offset,
              }}
              setPagination={setFromPagination}
              isCompact
            />
          }
          additionalControls={[
            <DownloadPdfButton
              key="download-button"
              slug={slug}
              endpointUrl={dataEndpoint}
              queryParams={queryParams}
              y={''}
              label={''}
              xTickFormat={''}
              totalCount={api.result.meta.count}
              onPageCount={queryParams.limit}
            />,
          ]}
        />
        <Grid hasGutter>
          <GridItem span={9}>{renderLeft()}</GridItem>
          <GridItem span={3}>{renderRight()}</GridItem>
          <GridItem span={12}>
            <TemplatesTable
              redirectToJobExplorer={redirectToJobExplorer}
              data={api.result.items}
              variableRow={options.sort_options.find(
                ({ key }) => key === queryParams.sort_options
              )}
              setDataRunTime={setDataRunTime}
              setEnabled={setEnabled}
            />
          </GridItem>
        </Grid>
      </CardBody>
      <CardFooter>
        <Pagination
          count={api.result.meta.count}
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

  return <ApiStatusWrapper api={api}>{renderContents()}</ApiStatusWrapper>;
};

export default AutomationCalculator;
