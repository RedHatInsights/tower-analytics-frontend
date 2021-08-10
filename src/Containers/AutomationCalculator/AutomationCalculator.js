import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

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
} from '@patternfly/react-core';

// Imports from custom components
import LoadingState from '../../Components/LoadingState';
import NoData from '../../Components/NoData';
import ApiErrorState from '../../Components/ApiErrorState';
import FilterableToolbar from '../../Components/Toolbar/';

// Imports from API
import { readROI, readROIOptions } from '../../Api/';

// Imports from utilities
import { useQueryParams } from '../../Utilities/useQueryParams';
import { roi as roiConst } from '../../Utilities/constants';
import useRedirect from '../../Utilities/useRedirect';
import { calculateDelta, convertSecondsToHours } from '../../Utilities/helpers';
import useRequest from '../../Utilities/useRequest';
import { getQSConfig } from '../../Utilities/qs';

// Chart
import TopTemplatesSavings from '../../Charts/ROITopTemplates';

// Local imports
import { BorderedCardTitle } from './helpers';
import TotalSavings from './TotalSavings';
import CalculationCost from './CalculationCost';
import AutomationFormula from './AutomationFormula';
import TopTemplates from './TopTemplates';

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

const qsConfig = getQSConfig('clusters', { ...roiConst.defaultParams }, [
  'limit',
  'offset',
]);

const AutomationCalculator = ({ history }) => {
  const toJobExplorer = useRedirect(history, 'jobExplorer');
  const [costManual, setCostManual] = useState('50');
  const [costAutomation, setCostAutomation] = useState('20');

  // params from toolbar/searchbar
  const { queryParams, setFromToolbar } = useQueryParams(qsConfig);

  const { result: options, request: setOptions } = useRequest(
    useCallback(() => readROIOptions(queryParams), [queryParams]),
    {}
  );

  const {
    result: api,
    error: apiError,
    isLoading: apiIsLoading,
    isSuccess: apiIsSuccess,
    request: fetchEndpoint,
    setValue,
  } = useRequest(
    useCallback(async () => {
      const response = await readROI(queryParams);
      return updateDeltaCost(mapApi(response), costAutomation, costManual);
    }, [queryParams]),
    []
  );

  /**
   * Modifies one elements avgRunTime in the unfilteredData
   * and updates all calculated fields.
   * Used in top templates.
   */
  const setDataRunTime = (seconds, id) => {
    const updatedData = api.map((el) => {
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
    setValue(api.map((el) => (el.id === id ? { ...el, enabled: value } : el)));
  };

  useEffect(() => {
    setOptions();
  }, []);

  /**
   * Recalculates the delta and costs in the data after the cost is changed.
   */
  useEffect(() => {
    setValue(updateDeltaCost(api, costAutomation, costManual));
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
      'job-explorer.quick_date_range': 'last_30_days',
      'job-explorer.template_id': templateId,
    };
    toJobExplorer(initialQueryParams);
  };

  const renderLeft = () => (
    <Stack hasGutter>
      <StackItem>
        <Card>
          <BorderedCardTitle>Automation savings</BorderedCardTitle>
          <CardBody>
            <TopTemplatesSavings
              margin={{ top: 20, right: 20, bottom: 20, left: 70 }}
              id="d3-roi-chart-root"
              data={filterDisabled(api)}
            />
            <p style={{ textAlign: 'center' }}>Templates</p>
          </CardBody>
        </Card>
      </StackItem>
      <StackItem isFilled>
        <AutomationFormula />
      </StackItem>
    </Stack>
  );

  const renderRight = () => (
    <Stack hasGutter>
      <StackItem>
        <TotalSavings totalSavings={computeTotalSavings(filterDisabled(api))} />
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
          <StackItem style={{ overflow: 'auto', maxHeight: '48vh' }}>
            <TopTemplates
              redirectToJobExplorer={redirectToJobExplorer}
              data={api}
              setDataRunTime={setDataRunTime}
              setUnfilteredData={api}
              setEnabled={setEnabled}
              sortBy={`${queryParams.sort_options}:${queryParams.sort_order}`}
            />
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  );

  const renderContents = () => {
    if (apiIsLoading) return <LoadingState />;
    if (apiError) return <ApiErrorState message={apiError.error} />;
    if (apiIsSuccess && api.length <= 0) return <NoData />;
    if (apiIsSuccess && api.length > 0)
      return (
        <Grid hasGutter className="automation-wrapper">
          <GridItem span={9}>{renderLeft()}</GridItem>
          <GridItem span={3}>{renderRight()}</GridItem>
        </Grid>
      );

    return null;
  };

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title={'Automation Calculator'} />
        <FilterableToolbar
          categories={options}
          filters={queryParams}
          qsConfig={qsConfig}
          setFilters={setFromToolbar}
        />
      </PageHeader>
      <Main>{renderContents()}</Main>
    </>
  );
};

AutomationCalculator.propTypes = {
  history: PropTypes.object,
};

export default AutomationCalculator;
