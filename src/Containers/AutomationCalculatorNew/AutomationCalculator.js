import React, { useState, useEffect } from 'react';

import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Stack,
  StackItem,
  CardHeader,
  CardTitle,
} from '@patternfly/react-core';

// Imports from custom components
import FilterableToolbar from '../../Components/Toolbar/';

// Imports from API
import { readROI, readROIOptions } from '../../Api/';

// Imports from utilities
import {
  useQueryParams,
  useRedirect,
  DEFAULT_NAMESPACE,
} from '../../QueryParams/';
import { jobExplorer, roi as roiConst } from '../../Utilities/constants';
import { calculateDelta, convertSecondsToHours } from '../../Utilities/helpers';
import useRequest from '../../Utilities/useRequest';

// Chart
import Chart from './Chart';

// Local imports
import TotalSavings from './TotalSavings';
import CalculationCost from './CalculationCost';
import AutomationFormula from './AutomationFormula';
import TemplatesTable from './TemplatesTable';
import { Paths } from '../../paths';
import ApiStatusWrapper from '../../Components/ApiStatus/ApiStatusWrapper';

const mapApi = ({ items = [] }) =>
  items.map((el) => ({
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

const AutomationCalculator = () => {
  const [costManual, setCostManual] = useState('50');
  const [costAutomation, setCostAutomation] = useState('20');

  const redirect = useRedirect();
  const { queryParams, setFromToolbar } = useQueryParams(
    roiConst.defaultParams
  );

  const { result: options, request: setOptions } = useRequest(
    () => readROIOptions(queryParams),
    {}
  );

  const {
    request: fetchEndpoint,
    setValue,
    ...api
  } = useRequest(async () => {
    const response = await readROI(queryParams);
    return updateDeltaCost(mapApi(response), costAutomation, costManual);
  }, []);

  /**
   * Modifies one elements avgRunTime in the unfilteredData
   * and updates all calculated fields.
   * Used in top templates.
   */
  const setDataRunTime = (seconds, id) => {
    const updatedData = api.result.map((el) => {
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
      setValue(api.result.map((el) => ({ ...el, enabled: value })));
    } else {
      setValue(
        api.result.map((el) => (el.id === id ? { ...el, enabled: value } : el))
      );
    }
  };

  /**
   * Recalculates the delta and costs in the data after the cost is changed.
   */
  useEffect(() => {
    setValue(updateDeltaCost(api.result, costAutomation, costManual));
  }, [costAutomation, costManual]);

  /**
   * Get data from API depending on the queryParam.
   */
  useEffect(() => {
    setOptions();
    fetchEndpoint();
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

  const renderLeft = () => (
    <Card isPlain>
      <CardHeader>
        <CardTitle>Automation savings</CardTitle>
      </CardHeader>
      <CardBody>
        <Chart data={filterDisabled(api.result)} />
      </CardBody>
    </Card>
  );

  const renderRight = () => (
    <Stack>
      <StackItem>
        <TotalSavings
          totalSavings={computeTotalSavings(filterDisabled(api.result))}
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
      <Grid hasGutter>
        <GridItem span={9}>{renderLeft()}</GridItem>
        <GridItem span={3}>{renderRight()}</GridItem>
        <GridItem span={12}>
          <TemplatesTable
            redirectToJobExplorer={redirectToJobExplorer}
            data={api.result}
            setDataRunTime={setDataRunTime}
            setEnabled={setEnabled}
          />
        </GridItem>
      </Grid>
    </Card>
  );

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title={'Automation Calculator'} />
        <FilterableToolbar
          categories={options}
          filters={queryParams}
          setFilters={setFromToolbar}
        />
      </PageHeader>
      <Main>
        <ApiStatusWrapper api={api}>{renderContents()}</ApiStatusWrapper>
      </Main>
    </>
  );
};

export default AutomationCalculator;
