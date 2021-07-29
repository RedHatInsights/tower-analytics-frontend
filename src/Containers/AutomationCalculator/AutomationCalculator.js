import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import Main from '@redhat-cloud-services/frontend-components/Main';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
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
import { notAuthorizedParams } from '../../Utilities/constants';

// Imports from custom components
import LoadingState from '../../Components/LoadingState';
import NoData from '../../Components/NoData';
import EmptyState from '../../Components/EmptyState';
import ApiErrorState from '../../Components/ApiErrorState';
import FilterableToolbar from '../../Components/Toolbar/';

// Imports from API
import { preflightRequest, readROI, readROIOptions } from '../../Api/';

// Imports from utilities
import { useQueryParams } from '../../Utilities/useQueryParams';
import { roi as roiConst } from '../../Utilities/constants';
import useRedirect from '../../Utilities/useRedirect';
import { calculateDelta, convertSecondsToHours } from '../../Utilities/helpers';

// Chart
import TopTemplatesSavings from '../../Charts/ROITopTemplates';

// Local imports
import { BorderedCardTitle } from './helpers';
import TotalSavings from './TotalSavings';
import CalculationCost from './CalculationCost';
import AutomationFormula from './AutomationFormula';
import TopTemplates from './TopTemplates';
import useRequest from '../../Utilities/useRequest';
import { getQSConfig } from '../../Utilities/qs';

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

  const { error: preflightError, request: setPreflight } = useRequest(
    useCallback(() => preflightRequest(), [])
  );

  const { result: options, request: setOptions } = useRequest(
    useCallback(() => readROIOptions(queryParams), [queryParams]),
    {}
  );

  const {
    result: api,
    error: apiError,
    isLoading: apiIsLoading,
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
    setPreflight();
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
            {apiIsLoading && <LoadingState />}
            {apiError && <ApiErrorState message={apiError.error} />}
            {api.length <= 0 && <NoData />}
            {api.length > 0 && (
              <React.Fragment>
                <TopTemplatesSavings
                  margin={{ top: 20, right: 20, bottom: 20, left: 70 }}
                  id="d3-roi-chart-root"
                  data={filterDisabled(api)}
                />
                <p style={{ textAlign: 'center' }}>Templates</p>
              </React.Fragment>
            )}
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
              sortBy={queryParams.sort_by}
            />
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  );

  if (preflightError?.status === 403) {
    return <NotAuthorized {...notAuthorizedParams} />;
  }

  const renderContents = () => {
    if (preflightError) return <EmptyState preflightError={preflightError} />;
    else if (api)
      return (
        <Grid hasGutter className="automation-wrapper">
          <GridItem span={9}>{renderLeft()}</GridItem>
          <GridItem span={3}>{renderRight()}</GridItem>
        </Grid>
      );
    else return <></>;
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
