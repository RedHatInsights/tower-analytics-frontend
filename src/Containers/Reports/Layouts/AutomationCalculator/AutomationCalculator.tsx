import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardHeader } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardFooter } from '@patternfly/react-core/dist/dynamic/components/Card';
import { PaginationVariant } from '@patternfly/react-core/dist/dynamic/components/Pagination';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import { ToggleGroup } from '@patternfly/react-core/dist/dynamic/components/ToggleGroup';
import { ToggleGroupItem } from '@patternfly/react-core/dist/dynamic/components/ToggleGroup';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { GridItem } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { Stack } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { StackItem } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { endpointFunctionMap, saveROI } from '../../../../Api';
import ApiStatusWrapper from '../../../../Components/ApiStatus/ApiStatusWrapper';
// Chart
import Chart from '../../../../Components/Chart';
import EmptyList from '../../../../Components/EmptyList';
import Pagination from '../../../../Components/Pagination';
// Imports from custom components
import FilterableToolbar from '../../../../Components/Toolbar';
import DownloadButton from '../../../../Components/Toolbar/DownloadButton';
// Imports from utilities
import {
  DEFAULT_NAMESPACE,
  createUrl,
  useQueryParams,
} from '../../../../QueryParams';
import {
  jobExplorer,
  reportDefaultParams,
} from '../../../../Utilities/constants';
import currencyFormatter from '../../../../Utilities/currencyFormatter';
import {
  calculateDelta,
  convertSecondsToHours,
} from '../../../../Utilities/helpers';
import { getDateFormatByGranularity } from '../../../../Utilities/helpers';
import hoursFormatter from '../../../../Utilities/hoursFormatter';
import useRequest from '../../../../Utilities/useRequest';
import { NotificationType } from '../../../../globalTypes';
import { Paths } from '../../../../paths';
import { perPageOptions as defaultPerPageOptions } from '../../Shared/constants';
import hydrateSchema from '../../Shared/hydrateSchema';
import { AutmationCalculatorProps } from '../types';
import AutomationFormula from './AutomationFormula';
import CalculationCost from './CalculationCost';
import TemplatesTable from './TemplatesTable';
// Local imports
import TotalSavings from './TotalSavings';

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

  const navigate = useNavigate();

  const [costManual, setCostManual] = useState<number | string | undefined>('');
  const [costAutomation, setCostAutomation] = useState<
    number | string | undefined
  >('');
  const [isMoney, setIsMoney] = useState(true);
  const { queryParams, setFromToolbar, setFromPagination } =
    useQueryParams(defaultParams);

  const mapApi = ({ legend = [] }) => {
    return legend.map((el: { [key: string]: number }) => ({
      ...el,
      delta: 0,
      avgRunTime: el.manual_effort_minutes * 60 || 3600,
      manualCost: 0,
      automatedCost: 0,
      enabled: el.template_weigh_in,
    }));
  };
  const { result: options, request: fetchOptions } = useRequest(
    readOptions as any,
    {
      sort_options: isMoney
        ? [
            {
              key: defaultParams.sort_options,
              value: defaultParams.sort_options,
            },
          ]
        : [
            {
              key: 'successful_saved_hours',
              value: 'successful_saved_hours',
            },
          ],
    },
  );

  const {
    request: fetchData,
    setValue: setApiData,
    ...api
  } = useRequest(
    async (params) => {
      const response = (await readData(params as any)) as any;
      return {
        ...response,
        items: updateDeltaCost(
          mapApi(response.meta),
          response.cost.hourly_manual_labor_cost,
          response.cost.hourly_automation_cost,
        ),
      };
    },
    {
      items: [],
      meta: {
        count: 0,
      },
    },
  );

  const setValue = (items) => {
    setApiData({
      ...api.result,
      items,
    });
  };

  const getROISaveData = (
    items: any[],
    manualCost = costManual,
    automationCost = costAutomation,
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

  const update = async () => {
    const res = await readData(queryParams as any);
    api.result.monetary_gain_current_page = res.monetary_gain_current_page;
    api.result.monetary_gain_other_pages = res.monetary_gain_other_pages;
    api.result.successful_hosts_saved_hours_current_page =
      res.successful_hosts_saved_hours_current_page;
    api.result.successful_hosts_saved_hours_other_pages =
      res.successful_hosts_saved_hours_other_pages;
    setValue(mapApi(res.meta as any));
    return res;
  };

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
          hourly_automation_cost,
        ) as any,
      );
    } catch {
      dispatch(
        addNotification({
          title: `Unable to save changes to ${humanVarName}.`,
          description: `Unable to save changes ${humanVarName}. Please try again.`,
          variant: NotificationType.danger,
          autoDismiss: false,
        }),
      );
      // don't update inputs
      return;
    }
    await update();
    if (varName === 'manual_cost') {
      setCostManual(value);
    } else {
      setCostAutomation(value);
    }
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
          costManual,
        )[0];
        return updatedDelta;
      } else {
        return el;
      }
    });
    try {
      await saveROI(getROISaveData(updatedData) as any);
    } catch {
      dispatch(
        addNotification({
          title: 'Unable to save changes to Manual time',
          description:
            'Unable to save changes to Manual time. Please try again.',
          variant: NotificationType.danger,
          autoDismiss: false,
        }),
      );
      // don't update inputs
      return;
    }
    await update();
  };

  const setEnabled = (id) => async (value) => {
    const updatedData = !id
      ? api.result.items.map((el) => ({ ...el, enabled: value }))
      : api.result.items.map((el) =>
          el.id === id ? { ...el, enabled: value } : el,
        );
    try {
      await saveROI(getROISaveData(updatedData) as any);
    } catch {
      dispatch(
        addNotification({
          title: 'Unable to save changes to visibility',
          description:
            'Unable to save changes to visibility. Please try again.',
          variant: NotificationType.danger,
          autoDismiss: false,
        }),
      );
      // don't update inputs
      return;
    }
    await update();
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

  const computeTotalSavings = () =>
    isMoney
      ? api.result?.monetary_gain_other_pages +
        api.result?.monetary_gain_current_page
      : api.result?.successful_hosts_saved_hours_current_page +
        api.result?.successful_hosts_saved_hours_other_pages;

  const computeCurrentPageSavings = () =>
    isMoney
      ? api.result?.monetary_gain_current_page
      : api.result?.successful_hosts_saved_hours_current_page;

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
    (fetchOptions as (any) => void)(queryParams);
    (fetchData as (any) => void)(queryParams);
  }, [queryParams]);
  /**
   * Function to navigate to the job explorer page
   * with the same filters as is used here.
   */
  const navigateToJobExplorer = (templateId) => {
    const initialQueryParams = {
      [DEFAULT_NAMESPACE]: {
        ...jobExplorer.defaultParams,
        quick_date_range: 'last_30_days',
        template_id: [templateId],
      },
      isMoney: true,
    };
    navigate(
      createUrl(Paths.jobExplorer.replace('/', ''), true, initialQueryParams),
    );
  };

  const chartParams = {
    y: queryParams.sort_options,
    tooltip: 'Savings for',
    field: queryParams.sort_options,
    label: (options.sort_options?.find(
      ({ key }) => key === queryParams.sort_options,
    )?.value || 'Label Y') as string,
    themeColor: isMoney ? 'green' : 'blue',
    xTickFormat: getDateFormatByGranularity(queryParams.granularity as any),
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
      case 'successful_hosts_saved_hours':
      case 'successful_hosts_saved_hours_current_page':
      case 'successful_hosts_saved_hours_other_pages':
        val = hoursFormatter(value);
        break;
      default:
        val = value.toFixed(2);
    }
    return val;
  };
  const customTooltipFormatting = ({ datum }) =>
    `${chartParams.label} for ${datum.name}: ${formattedValue(
      queryParams.sort_options as any,
      datum.y,
    )}`;

  const isReadOnly = (api) => {
    return !api.result.rbac?.perms?.all && !api.result.rbac?.perms?.write;
  };

  const renderLeft = () => (
    <Card isPlain>
      {fullCard && (
        <CardHeader
          actions={{
            actions: (
              <>
                <ToggleGroup aria-label='toggleButton'>
                  <ToggleGroupItem
                    id='toggleIsMoneyTrue'
                    text='Money'
                    buttonId='money'
                    isSelected={isMoney}
                    onChange={() => {
                      setIsMoney(true);
                      setFromToolbar(
                        'sort_options',
                        'successful_hosts_savings',
                      );
                    }}
                  />
                  <ToggleGroupItem
                    id='toggleIsMoneyFalse'
                    text='Time'
                    buttonId='time'
                    isSelected={!isMoney}
                    onChange={() => {
                      setIsMoney(false);
                      setFromToolbar(
                        'sort_options',
                        'successful_hosts_saved_hours',
                      );
                    }}
                  />
                </ToggleGroup>
              </>
            ),
            hasNoOffset: false,
            className: undefined,
          }}
        >
          <CardTitle>Automation savings</CardTitle>
        </CardHeader>
      )}
      {api.isLoading ? (
        <SpinnerDiv>
          <Spinner data-cy={'spinner'} />
        </SpinnerDiv>
      ) : filterDisabled(api?.result?.items).length > 0 ? (
        <Chart
          schema={hydrateSchema(schema as any)({
            themeColor: chartParams.themeColor,
            label: chartParams.label as any,
            tooltip: chartParams.tooltip as any,
            field: chartParams.field,
            yAxis: (chartParams as any).yAxis,
          } as any)}
          data={
            {
              items: filterDisabled(api.result.items),
            } as any
          }
          specificFunctions={{
            labelFormat: {
              customTooltipFormatting,
            },
          }}
        />
      ) : (
        <EmptyList
          title={'No results found'}
          message={
            'No results match the filter criteria. Clear all filters and try again.'
          }
          showButton={true}
          label={'Clear all filters'}
          onButtonClick={() => setFromToolbar(undefined, undefined) as any}
        />
      )}
    </Card>
  );

  const renderRight = () => (
    <Stack>
      <StackItem>
        <TotalSavings
          isMoney={isMoney}
          totalSavings={computeTotalSavings()}
          currentPageSavings={computeCurrentPageSavings()}
          isLoading={api.isLoading}
        />
      </StackItem>
      <StackItem>
        <Stack>
          <StackItem>
            <CalculationCost
              costManual={costManual as any}
              setFromCalculation={updateCalculationValues}
              costAutomation={costAutomation as any}
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
            categories={options as any}
            filters={queryParams as any}
            setFilters={setFromToolbar}
            pagination={
              <Pagination
                count={api.result.meta.count}
                perPageOptions={perPageOptions}
                params={{
                  limit: +(queryParams?.limit as unknown as number),
                  offset: +(queryParams?.offset as unknown as number),
                }}
                setPagination={setFromPagination as any}
                isCompact
              />
            }
            additionalControls={[
              <DownloadButton
                key='download-button'
                slug={slug}
                isMoney={isMoney}
                name={name}
                description={description}
                endpointUrl={dataEndpoint}
                queryParams={queryParams as any}
                selectOptions={options as any}
                y={chartParams.y as any}
                label={chartParams.label as any}
                xTickFormat={chartParams.xTickFormat}
                totalPages={Math.ceil(
                  api.result.meta.count / (queryParams.limit as any),
                )}
                pageLimit={queryParams.limit as any}
                sortOptions={chartParams.y as any}
                sortOrder={queryParams.sort_order as any}
                startDate={queryParams.start_date as any}
                endDate={queryParams.end_date as any}
                dateRange={queryParams.quick_date_range as any}
                inputs={
                  {
                    costManual,
                    costAutomation,
                    totalSavings: computeTotalSavings(),
                    currentPageSavings: computeCurrentPageSavings(),
                  } as any
                }
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
                <Spinner data-cy={'spinner'} />
              ) : (
                <TemplatesTable
                  navigateToJobExplorer={navigateToJobExplorer}
                  data={api.result.items}
                  variableRow={
                    options.sort_options.find(
                      ({ key }) => key === queryParams.sort_options,
                    ) as any
                  }
                  setDataRunTime={setDataRunTime}
                  setEnabled={setEnabled}
                  getSortParams={getSortParams as any}
                  readOnly={isReadOnly(api)}
                  isMoney={isMoney}
                />
              )}
            </GridItem>
          </Grid>
        </CardBody>
        <CardFooter>
          <Pagination
            count={api.result.meta.count}
            perPageOptions={perPageOptions}
            params={
              {
                limit: +(queryParams.limit as any),
                offset: +(queryParams.offset as any),
              } as any
            }
            setPagination={setFromPagination as any}
            variant={PaginationVariant.bottom}
          />
        </CardFooter>
      </Card>
    ) : (
      <>
        <FilterableToolbar
          categories={options as any}
          filters={queryParams as any}
          setFilters={setFromToolbar}
        />
        <Grid hasGutter>
          <GridItem span={9}>{renderLeft()}</GridItem>
          <GridItem span={3}>{renderRight()}</GridItem>
        </Grid>
      </>
    );
  return (
    <ApiStatusWrapper
      api={api as any}
      customLoading={true}
      customEmptyState={true}
    >
      {renderContents()}
    </ApiStatusWrapper>
  );
};

export default AutomationCalculator;
