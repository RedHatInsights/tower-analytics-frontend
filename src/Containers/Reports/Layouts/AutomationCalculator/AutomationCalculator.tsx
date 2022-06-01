/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, FC } from 'react';
import {
  Button,
  Card,
  CardBody,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Grid,
  GridItem,
  Stack,
  StackItem,
  CardHeader,
  CardTitle,
  CardFooter,
  PaginationVariant,
  Title,
  Spinner,
} from '@patternfly/react-core';
import { CubesIcon as CubesIcon } from '@patternfly/react-icons';
// Imports from custom components
import FilterableToolbar from '../../../../Components/Toolbar';
import Pagination from '../../../../Components/Pagination';
// Imports from utilities
import {
  useQueryParams,
  useRedirect,
  DEFAULT_NAMESPACE,
} from '../../../../QueryParams';
import {
  jobExplorer,
  reportDefaultParams,
} from '../../../../Utilities/constants';
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
import DownloadButton from '../../../../Components/Toolbar/DownloadButton';
import { endpointFunctionMap, saveROI } from '../../../../Api';
import { AutmationCalculatorProps } from '../types';
import hydrateSchema from '../../Shared/hydrateSchema';
import currencyFormatter from '../../../../Utilities/currencyFormatter';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { NotificationType } from '../../../../globalTypes';

const SpinnerDiv = styled.div`
  height: 400px;
  padding-top: 200px;
  padding-left: 400px;
`;
const perPageOptions = [
  ...defaultPerPageOptions,
  { title: '15', value: 15 },
  { title: '20', value: 20 },
  { title: '25', value: 25 },
];

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
  name,
  description,
  dataEndpoint,
  optionsEndpoint,
  schema,
  fullCard = true,
}) => {
  const readData = endpointFunctionMap(dataEndpoint);
  const readOptions = endpointFunctionMap(optionsEndpoint);
  const defaultParams = reportDefaultParams(slug);
  const redirect = useRedirect();
  const { queryParams, setFromToolbar, setFromPagination } =
    useQueryParams(defaultParams);

  const [costManual, setCostManual] = useState('');
  const [costAutomation, setCostAutomation] = useState('');

  const mapApi = ({ legend = [] }) => {
    return legend.map((el) => ({
      ...el,
      delta: 0,
      avgRunTime: el.manual_effort_minutes * 60 || 3600,
      manualCost: 0,
      automatedCost: 0,
      enabled: el.template_weigh_in,
    }));
  };
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
          response.cost.hourly_manual_labor_cost,
          response.cost.hourly_automation_cost
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
  const getROISaveData = (
    items: any[],
    manualCost?: number = costManual,
    automationCost?: number = costAutomation
  ) => {
    const updatedDataApi = items.map((el) => ({
      template_id: el.id,
      effort_minutes: el.avgRunTime / 60,
      template_weigh_in: el.enabled,
    }));
    return {
      currency: 'USD',
      hourly_manual_labor_cost: manualCost,
      hourly_automation_cost: automationCost,
      templates_manual_equivalent: updatedDataApi,
    };
  };
  const dispatch = useDispatch();

  const updateCalculationValues = async (varName: string, value: number) => {
    const hourly_automation_cost =
      varName === 'automation_cost' ? value : costAutomation;
    const hourly_manual_labor_cost =
      varName === 'manual_cost' ? value : costManual;
    const humanVarName =
      varName === 'automation_cost' ? 'Automation cost' : 'Manual cost';
    try {
      await saveROI(
        getROISaveData(
          api.result.items,
          hourly_manual_labor_cost,
          hourly_automation_cost
        )
      );
    } catch {
      dispatch(
        addNotification({
          title: `Unable to save changes to ${humanVarName}.`,
          description: `Unable to save changes ${humanVarName}. Please try again.`,
          variant: NotificationType.danger,
          autoDismiss: false,
        })
      );
      // don't update inputs
      return;
    }
    varName === 'manual_cost' ? setCostManual(value) : setCostAutomation(value);
  };

  /**
   * Modifies one elements avgRunTime in the unfilteredData
   * and updates all calculated fields.
   * Used in top templates.
   */
  const setDataRunTime = async (seconds, id) => {
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
    try {
      await saveROI(getROISaveData(updatedData), dispatch);
    } catch {
      dispatch(
        addNotification({
          title: 'Unable to save changes to Manual time',
          description:
            'Unable to save changes to Manual time. Please try again.',
          variant: NotificationType.danger,
          autoDismiss: false,
        })
      );
      // don't update inputs
      return;
    }
    setValue(updatedData);
  };

  const setEnabled = (id) => async (value) => {
    const updatedData = !id
      ? api.result.items.map((el) => ({ ...el, enabled: value }))
      : api.result.items.map((el) =>
          el.id === id ? { ...el, enabled: value } : el
        );
    try {
      await saveROI(getROISaveData(updatedData));
    } catch {
      dispatch(
        addNotification({
          title: 'Unable to save changes to visibility',
          description:
            'Unable to save changes to visibility. Please try again.',
          variant: NotificationType.danger,
          autoDismiss: false,
        })
      );
      // don't update inputs
      return;
    }
    setValue(updatedData);
  };
  const getSortParams = () => {
    const onSort = (_event, index, direction) => {
      setFromToolbar('sort_order', direction);
    };
    return {
      sort: {
        sortBy: {
          index: 2,
          direction: queryParams.sort_order || 'none',
        },
        onSort,
        columnIndex: 2,
      },
    };
  };
  /**
   * Set cost from API on load. Don't reload it.
   */
  useEffect(() => {
    if (api.result?.cost && !costAutomation && !costManual) {
      setCostManual(api.result.cost.hourly_manual_labor_cost);
      setCostAutomation(api.result.cost.hourly_automation_cost);
    }
  }, [api]);

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
      chartParams.label +
      ' for ' +
      datum.name +
      ': ' +
      formattedValue(queryParams.sort_options, datum.y);
    return tooltip;
  };

  const isReadOnly = (api) => {
    return !api.result.rbac?.perms?.all && !api.result.rbac?.perms?.write;
  };

  const renderLeft = () => (
    <Card isPlain>
      {fullCard && (
        <CardHeader>
          <CardTitle>Automation savings</CardTitle>
        </CardHeader>
      )}
      {api.isLoading ? (
        <SpinnerDiv>
          <Spinner isSVG />
        </SpinnerDiv>
      ) : filterDisabled(api?.result?.items).length > 0 ? (
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
      ) : (
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No results
          </Title>
          <EmptyStateBody>
            The current filter has no results. Clear the filter and try again.
          </EmptyStateBody>
          <Button variant="primary" onClick={() => setEnabled(undefined)(true)}>
            Clear filter
          </Button>
        </EmptyState>
      )}
    </Card>
  );

  const renderRight = () => (
    <Stack>
      <StackItem>
        <TotalSavings
          totalSavings={computeTotalSavings(filterDisabled(api.result.items))}
          isLoading={api.isLoading}
        />
      </StackItem>
      <StackItem>
        <Stack>
          <StackItem>
            <CalculationCost
              costManual={costManual}
              setFromCalculation={updateCalculationValues}
              costAutomation={costAutomation}
              readOnly={isReadOnly(api)}
            />
          </StackItem>
          <StackItem>
            <AutomationFormula />
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  );

  const renderContents = () =>
    fullCard ? (
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
              <DownloadButton
                key="download-button"
                slug={slug}
                name={name}
                description={description}
                endpointUrl={dataEndpoint}
                queryParams={queryParams}
                selectOptions={options}
                y={''}
                label={''}
                xTickFormat={''}
                totalPages={Math.ceil(
                  api.result.meta.count / queryParams.limit
                )}
                pageLimit={queryParams.limit}
                sortOptions={chartParams.y}
                sortOrder={queryParams.sort_order}
                startDate={queryParams.start_date}
                endDate={queryParams.end_date}
                dateRange={queryParams.quick_date_range}
                inputs={{ costManual, costAutomation }}
              />,
            ]}
          />
          <Grid hasGutter>
            <GridItem span={9}>{renderLeft()}</GridItem>
            <GridItem span={3}>{renderRight()}</GridItem>
            <GridItem span={12}>
              <p>
                Enter the time it takes to run the following templates manually.
              </p>
              {api.isLoading ? (
                <Spinner isSVG />
              ) : (
                <TemplatesTable
                  redirectToJobExplorer={redirectToJobExplorer}
                  data={api.result.items}
                  variableRow={options.sort_options.find(
                    ({ key }) => key === queryParams.sort_options
                  )}
                  setDataRunTime={setDataRunTime}
                  setEnabled={setEnabled}
                  getSortParams={getSortParams}
                  readOnly={isReadOnly(api)}
                />
              )}
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
    ) : (
      <>
        <FilterableToolbar
          categories={options}
          filters={queryParams}
          setFilters={setFromToolbar}
        />
        <Grid hasGutter>
          <GridItem span={9}>{renderLeft()}</GridItem>
          <GridItem span={3}>{renderRight()}</GridItem>
        </Grid>
      </>
    );
  return (
    <ApiStatusWrapper api={api} customLoading={true} customEmptyState={true}>
      {renderContents()}
    </ApiStatusWrapper>
  );
};

export default AutomationCalculator;
