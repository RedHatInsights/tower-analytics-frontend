import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

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
import {calculateDelta, convertSecondsToHours, qsToObject, qsToString} from '../../Utilities/helpers';

// Chart
import TopTemplatesSavings from '../../Charts/ROITopTemplates';

// Local imports
import { BorderedCardTitle } from './helpers';
import TotalSavings from './TotalSavings';
import CalculationCost from './CalculationCost';
import AutomationFormula from './AutomationFormula';
import TopTemplates from './TopTemplates';
import useRequest from "../../Utilities/useRequest";

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

const AutomationCalculator = ({ history }) => {
  const toJobExplorer = useRedirect(history, 'jobExplorer');
  const [costManual, setCostManual] = useState('50');
  const [costAutomation, setCostAutomation] = useState('20');
  const location = useLocation();
  const { pathname } = useLocation();

  // params from toolbar/searchbar
  const query = location.search ? qsToObject(location.search) : roiConst.defaultParams
  const { queryParams, setFromToolbar } = useQueryParams(query);

  // params from url/querystring
  const [urlstring, setUrlstring] = useState(queryParams)

  const {
    result: { preflight },
    error: preflightError,
    isLoading: preflightIsLoading,
    request: setPreflight,
  } = useRequest(
    useCallback(async () => {
      const preflight = await preflightRequest()
      return { preflight: preflight };
    }, []),
    { preflight: {}, preflightError, preflightIsLoading }
  );

  const {
    result: { options },
    error: optionsError,
    isLoading: optionsIsLoading,
    request: setOptions,
  } = useRequest(
    useCallback(async () => {
      const options = await readROIOptions({ params: queryParams })
      return { options: options };
    }, []),
    { options: {}, optionsError,  optionsIsLoading }
  );

  const {
    result: { data },
    error: apiError,
    isLoading: apiIsLoading,
    request: setDataInApi,
  } = useRequest(
    useCallback(async () => {
      const response = await readROI({ params: queryParams})
      return { data: response };
    }, [location, queryParams]),
    { data: [], apiError,  apiIsLoading }
  );
  const api = updateDeltaCost(mapApi(data), costAutomation, costManual)

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

    setDataInApi(updatedData);
  };

  const setEnabled = (id) => (value) => {
    setDataInApi(
      api.map((el) => (el.id === id ? { ...el, enabled: value } : el))
    );
  };

  useEffect(() => {
    setPreflight();
    setOptions();
  }, []);

  /**
   * Recalculates the delta and costs in the data after the cost is changed.
   */
  useEffect(() => {
    setDataInApi(updateDeltaCost(api, costAutomation, costManual));
  }, [costAutomation, costManual]);

  /**
   * Get data from API depending on the queryParam.
   */
  useEffect(() => {
    const search = qsToString(queryParams);
    setUrlstring(search)
    history.push(`${pathname}?${search}`)
    setDataInApi();
  }, [queryParams, urlstring]);

  /**
   * Function to redirect to the job explorer page
   * with the same filters as is used here.
   */
  const redirectToJobExplorer = (templateId) => {
    const initialQueryParams = {
      quick_date_range: 'last_30_days',
      template_id: [templateId],
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
        <TotalSavings
          totalSavings={computeTotalSavings(filterDisabled(api))}
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
