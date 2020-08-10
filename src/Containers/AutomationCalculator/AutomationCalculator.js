/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import styled from 'styled-components';

import { useQueryParams } from '../../Utilities/useQueryParams';

import LoadingState from '../../Components/LoadingState';
import NoData from '../../Components/NoData';
import EmptyState from '../../Components/EmptyState';
import { preflightRequest, readROI } from '../../Api';
import { Paths } from '../../paths';
import { formatQueryStrings } from '../../Utilities/formatQueryStrings';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
    Button,
    Card,
    CardBody,
    CardTitle,
    FormSelect,
    FormSelectOption,
    InputGroup,
    InputGroupText,
    TextInput,
    Title,
    Tooltip,
    TooltipPosition
} from '@patternfly/react-core';

import {
    DollarSignIcon,
    FilterIcon,
    InfoCircleIcon,
    ToggleOnIcon,
    ToggleOffIcon
} from '@patternfly/react-icons';

import TopTemplatesSavings from '../../Charts/ROITopTemplates';

import {
    calculateDelta,
    convertSecondsToMins,
    convertMinsToSeconds,
    convertSecondsToHours,
    convertWithCommas,
    formatPercentage
} from '../../Utilities/helpers';

const FilterCardTitle = styled(CardTitle)`
  border-bottom: 2px solid #ebebeb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &&& {
    min-height: 60px;
    --pf-c-card--first-child--PaddingTop: 10px;
    --pf-c-card__header--not-last-child--PaddingBottom: 10px;

    h3 {
      font-size: 0.875em;
    }
  }
`;

const defaultAvgRunVal = 3600; // 1 hr in seconds
const defaultCostAutomation = 20;
const defaultCostManual = 50;

const InputAndText = styled.div`
  flex: 1;
`;

const TemplateDetail = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div,
  em {
    padding-right: 5px;
  }

  @media (max-width: 1490px) {
    display: block;

    em {
      padding: 10px 0;
      display: block;
    }
  }
`;

const TemplateDetailSubTitle = styled.em`
  color: var(--pf-global--Color--dark-200);
`;

const TooltipWrapper = styled.div`
  p {
    text-align: left;
  }
`;

const IconGroup = styled.div`
  & svg {
    fill: var(--pf-global--Color--dark-200);

    :hover {
      cursor: pointer;
    }

    :first-of-type {
      margin-right: 10px;
      margin-left: 10px;

      @media (max-width: 1350px) {
        margin-left: 0;
      }
    }
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 5fr 2fr;
  height: 100%;
`;

const WrapperLeft = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const WrapperRight = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`;

const title = (
    <span style={ { fontWeight: 400 } }>
    Automation Analytics
        <span style={ { fontSize: '16px', fontWeight: 400 } }>
            { ' ' }
            <span style={ { margin: '0 10px' } }>|</span> Automation calculator
        </span>
    </span>
);

/* helper variables for further date ranges */
const pastYear = moment.utc().subtract(1, 'year');
const pastYTD = moment().startOf('year');
const pastQuarter = moment().startOf('quarter');
const pastMonth = moment.utc().subtract(1, 'month');

/* these are the buckets of time the user's are able to select ... */
const timeFrameOptions = [
    { value: 'please choose', label: 'Select date range', disabled: true },
    { value: pastYear.format('YYYY-MM-DD'), label: 'Past year', disabled: false },
    { value: pastYTD.format('YYYY-MM-DD'), label: 'Past year to date', disabled: false },
    { value: pastQuarter.format('YYYY-MM-DD'), label: 'Past quarter', disabled: false },
    { value: pastMonth.format('YYYY-MM-DD'), label: 'Past month', disabled: false }
];

/* set the default bucket to 365 days */
const initialQueryParams = {
    startDate: pastYear.format('YYYY-MM-DD'),
    endDate: moment.utc().format('YYYY-MM-DD')
};

export const automationCalculatorMethods = () => {
    // create our array to feed to D3
    const formatData = (response, defaults) => {
        return response.reduce(
            (
                formatted,
                {
                    name,
                    template_id: id,
                    successful_run_count,
                    successful_elapsed_sum,
                    successful_host_run_count_avg,
                    successful_host_run_count,
                    elapsed_sum,
                    failed_elapsed_sum,
                    orgs,
                    clusters,
                    template_automation_percentage
                }
            ) => {
                formatted.push({
                    name,
                    id,
                    run_count: successful_run_count,
                    host_count: successful_host_run_count_avg || 0,
                    successful_host_run_count,
                    delta: 0,
                    isActive: true,
                    calculations: [
                        {
                            type: 'Manual',
                            avg_run: defaults.defaultAvgRunVal,
                            cost: 0
                        },
                        {
                            type: 'Automated',
                            avg_run: successful_elapsed_sum || 0,
                            cost: 0
                        }
                    ],
                    orgs,
                    clusters,
                    elapsed_sum,
                    failed_elapsed_sum,
                    successful_elapsed_sum,
                    template_automation_percentage
                });
                return formatted;
            },
            []
        );
    };

    const updateData = (seconds, id, data) => {
        let updatedData = [ ...data ];
        updatedData.map((datum) => {
            if (datum.id === id) {
                // Update manual calculations
                datum.calculations[0].avg_run = seconds;
                datum.calculations[0].total = seconds * datum.successful_host_run_count;
            }
        });
        return updatedData;
    };

    const handleManualTimeChange = (minutes) => {
        const seconds = convertMinsToSeconds(minutes);
        return seconds;
    };

    const formatSelectedIds = (arr, id) => {
        let selected;
        if (arr.includes(id)) {
            selected = [ ...arr ].filter((s) => s !== id);
        } else {
            selected = [ ...arr, id ];
        }

        return selected;
    };

    const handleToggle = (id, selected) => {
        const currentSelection = [ ...selected ];
        const newSelection = formatSelectedIds(currentSelection, id);
        return newSelection;
    };

    return {
        formatData,
        updateData,
        handleManualTimeChange,
        formatSelectedIds,
        handleToggle
    };
};

export const useAutomationFormula = () => {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ costManual, setCostManual ] = useState(defaultCostManual);
    const [ costAutomation, setCostAutomation ] = useState(defaultCostAutomation);
    const [ totalSavings, setTotalSavings ] = useState(0);
    const [ unfilteredData, setUnfilteredData ] = useState([]);
    const [ formattedData, setFormattedData ] = useState([]);
    const [ templatesList, setTemplatesList ] = useState([]);
    const [ roiData, setRoiData ] = useState([]);
    const [ selectedIds, setSelectedIds ] = useState([]);

    const { formatData } = automationCalculatorMethods();

    useEffect(() => {
        let data = [ ...formattedData ];
        let total = 0;
        let costAutomationPerHour;
        let costManualPerHour;

        data.forEach((datum) => {
            costAutomationPerHour =
        convertSecondsToHours(datum.successful_elapsed_sum) * costAutomation;
            costManualPerHour =
        convertSecondsToHours(datum.calculations[0].avg_run) *
        datum.successful_host_run_count *
        costManual;
            total += calculateDelta(costAutomationPerHour, costManualPerHour);
            datum.delta = calculateDelta(costAutomationPerHour, costManualPerHour);
            datum.calculations[0].cost = costManualPerHour;
            datum.calculations[1].cost = costAutomationPerHour;
        });
        const totalWithCommas = total
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setTotalSavings('$' + totalWithCommas);
    }, [ formattedData, costAutomation, costManual ]);

    useEffect(() => {
        const filteredData = unfilteredData.filter(
            ({ id }) => !selectedIds.includes(id)
        );
        templatesList.map((l) => {
            if (selectedIds.includes(l.id)) {
                l.isActive = false;
            } else {
                l.isActive = true;
            }
        });
        setFormattedData(filteredData);
    }, [ selectedIds ]);

    useEffect(() => {
        const formatted = formatData(roiData, {
            defaultAvgRunVal,
            defaultCostAutomation,
            defaultCostManual
        });
        setUnfilteredData(formatted);
        setFormattedData(formatted);
        setTemplatesList(formatted);
    }, [ roiData ]);

    return {
        isLoading,
        setIsLoading,
        costManual,
        setCostManual,
        costAutomation,
        setCostAutomation,
        totalSavings,
        formattedData,
        setFormattedData,
        templatesList,
        selectedIds,
        setSelectedIds,
        setRoiData,
        unfilteredData
    };
};

const AutomationCalculator = ({ history }) => {

    // default to the past year (n - 365 days)
    const [ roiTimeFrame, setRoiTimeFrame ] = useState(timeFrameOptions[1].value);
    const [ preflightError, setPreFlightError ] = useState(null);

    const {
        updateData,
        handleManualTimeChange,
        handleToggle
    } = automationCalculatorMethods();

    const {
        isLoading,
        setIsLoading,
        costManual,
        setCostManual,
        costAutomation,
        setCostAutomation,
        totalSavings,
        formattedData,
        setFormattedData,
        templatesList,
        selectedIds,
        setSelectedIds,
        setRoiData
    } = useAutomationFormula();

    const { queryParams, setStartDateAsString } = useQueryParams(
        initialQueryParams
    );

    const handleOnChange = (value) => {
        setStartDateAsString(value);
        setRoiTimeFrame(value);
    };

    useEffect(() => {
        let ignore = false;
        const getData = () => {
            return readROI({ params: queryParams });
        };

        async function initializeWithPreflight() {
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            await preflightRequest().catch((error) => {
                setPreFlightError({ preflightError: error });
            });
            getData().then(({ templates: roiData = []}) => {
                if (!ignore) {
                    setRoiData(roiData);
                    setIsLoading(false);
                }
            });
        }

        initializeWithPreflight();
        return () => (ignore = true);
    }, [ queryParams ]);

    const redirectToJobExplorer = (templateId) => {
        const { jobExplorer } = Paths;
        const initialQueryParams = {
            template_id: templateId,
            status: [ 'successful' ],
            job_type: [ 'job' ],
            quick_date_range: 'last_30_days'
        };

        const { strings, stringify } = formatQueryStrings(initialQueryParams);
        const search = stringify(strings);
        history.push({
            pathname: jobExplorer,
            search
        });
    };

    return (
    <>
      <PageHeader style={ { flex: '0' } }>
          <PageHeaderTitle title={ title } />
      </PageHeader>
      { preflightError && (
          <Main>
              <Card>
                  <CardBody>
                      <EmptyState { ...preflightError } />
                  </CardBody>
              </Card>
          </Main>
      ) }
      { !preflightError && (
        <>
          <Main style={ { paddingBottom: '0' } }>
              <Card>
                  <FilterCardTitle style={ { paddingBottom: '0', paddingTop: '0' } }>
                      <h2>
                          <FilterIcon style={ { marginRight: '10px' } } />
                  Filter
                      </h2>
                      <div style={ { display: 'flex', justifyContent: 'flex-end' } }>
                          <FormSelect
                              name="roiTimeFrame"
                              value={ roiTimeFrame }
                              onChange={ handleOnChange }
                              aria-label="Select Date Range"
                              style={ { margin: '2px 10px' } }
                          >
                              { timeFrameOptions.map((option, index) => (
                                  <FormSelectOption
                                      isDisabled={ option.disabled }
                                      key={ index }
                                      value={ option.value }
                                      label={ option.label }
                                  />
                              )) }
                          </FormSelect>
                      </div>
                  </FilterCardTitle>
              </Card>
          </Main>
          <Wrapper className="automation-wrapper">
              <WrapperLeft>
                  <Main style={ { paddingBottom: '0' } }>
                      <Card>
                          <CardTitle>Automation savings</CardTitle>
                          <CardBody>
                              { isLoading && !preflightError && <LoadingState /> }
                              { !isLoading && formattedData.length <= 0 && <NoData /> }
                              { formattedData.length > 0 && !isLoading && (
                      <>
                        <TopTemplatesSavings
                            margin={ { top: 20, right: 20, bottom: 20, left: 70 } }
                            id="d3-roi-chart-root"
                            data={ formattedData }
                            selected={ selectedIds }
                        />
                        <p style={ { textAlign: 'center' } }>Templates</p>
                      </>
                              ) }
                          </CardBody>
                      </Card>
                  </Main>
                  <Main>
                      <Card style={ { height: '100%' } }>
                          <CardTitle>Automation formula</CardTitle>
                          <CardBody>
                              <p>
                                  <b>Manual cost for template x</b> =
                                  <em>
                        (time for a manual run on one host * (sum of all hosts
                        across all job runs) ) * cost per hour
                                  </em>
                              </p>
                              <p>
                                  <b>Automation cost for template x</b> =
                                  <em>
                        cost of automation per hour * sum of total elapsed hours
                        for a template
                                  </em>
                              </p>
                              <p>
                                  <b>Savings</b> =
                                  <em>
                        Sum of (manual cost - automation cost) across all
                        templates
                                  </em>
                              </p>
                          </CardBody>
                      </Card>
                  </Main>
              </WrapperLeft>
              <WrapperRight>
                  <Main style={ { paddingBottom: '0', paddingLeft: '0' } }>
                      <Card>
                          <CardTitle style={ { paddingBottom: '0' } }>
                    Total savings
                          </CardTitle>
                          <CardBody>
                              <Title
                                  headingLevel="h3"
                                  size="3xl"
                                  style={ { color: 'var(--pf-global--success-color--200)' } }
                              >
                                  { totalSavings }
                              </Title>
                          </CardBody>
                      </Card>
                  </Main>
                  <Main style={ { paddingBottom: '0', paddingLeft: '0' } }>
                      <Card>
                          <CardTitle style={ { paddingBottom: '10px' } }>
                    Calculate your automation
                          </CardTitle>
                          <CardBody>
                              <InputAndText>

                                  <p>Manual cost of automation</p>
                                  <em
                                      style={ { color: 'var(--pf-global--Color--dark-200)' } }
                                  >
                        (e.g. average salary of mid-level SE)

                                  </em>
                                  <InputGroup style={ { width: '50%' } }>
                                      <InputGroupText>
                                          <DollarSignIcon />
                                      </InputGroupText>
                                      <TextInput
                                          id="manual-cost"
                                          type="number"
                                          step="any"
                                          min="0"
                                          aria-label="manual-cost"
                                          value={ parseFloat(costManual) }
                                          onChange={ (e) => setCostManual(e) }
                                      />
                                      <InputGroupText>/hr</InputGroupText>
                                  </InputGroup>
                              </InputAndText>
                              <InputAndText style={ { paddingTop: '10px' } }>
                                  <p>Automated process cost</p>
                                  <InputGroup style={ { width: '50%' } }>
                                      <InputGroupText>
                                          <DollarSignIcon />
                                      </InputGroupText>
                                      <TextInput
                                          id="automation-cost"
                                          type="number"
                                          step="any"
                                          min="0"
                                          aria-label="automation-cost"
                                          value={ parseFloat(costAutomation) }
                                          onChange={ (e) => setCostAutomation(e) }
                                      />
                                      <InputGroupText>/hr</InputGroupText>
                                  </InputGroup>
                              </InputAndText>
                          </CardBody>
                      </Card>
                  </Main>
                  <Main
                      style={ {
                          display: 'flex',
                          flexDirection: 'column',
                          flex: '1 1 0',
                          paddingLeft: '0'
                      } }
                  >
                      <Card style={ { overflow: 'auto', flex: '1 1 0' } }>
                          <CardTitle>Top templates</CardTitle>
                          <CardBody>
                              <p>
                      Enter the time it takes to manually perform the tasks that
                      the following templates automate.
                              </p>
                              { templatesList.map((data) => (
                                  <div key={ data.id }>
                                      <Tooltip content={ 'Click for list of jobs in the past month' } >
                                          <Button
                                              style={ { padding: '15px 0 10px' } }
                                              component="a"
                                              onClick={ () => redirectToJobExplorer(data.id) }
                                              variant="link"
                                          >
                                              { data.name }
                                          </Button>
                                      </Tooltip>
                                      <TemplateDetail>
                                          <InputAndText key={ data.id }>
                                              <InputGroup>
                                                  <TextInput
                                                      id={ data.id }
                                                      type="number"
                                                      aria-label="time run manually"
                                                      value={ convertSecondsToMins(
                                                          data.calculations[0].avg_run
                                                      ) }
                                                      onChange={ (e) => {
                                                          const seconds = handleManualTimeChange(e);
                                                          const updated = updateData(
                                                              seconds,
                                                              data.id,
                                                              formattedData
                                                          );
                                                          setFormattedData(updated);
                                                      } }
                                                      isDisabled={ !data.isActive }
                                                  />
                                                  <InputGroupText>min</InputGroupText>
                                              </InputGroup>
                                          </InputAndText>
                                          <TemplateDetailSubTitle>
                            x { data.run_count } runs, { data.host_count } hosts
                                          </TemplateDetailSubTitle>
                                          <IconGroup>
                                              <Tooltip
                                                  position={ TooltipPosition.top }
                                                  entryDelay={ 50 }
                                                  exitDelay={ 50 }
                                                  content={
                                                      <TooltipWrapper>
                                                          <p>
                                                              <b>Total elapsed sum</b>:{ ' ' }
                                                              { data.elapsed_sum.toFixed(2) }s
                                                          </p>
                                                          <p>
                                                              <b>Success elapsed sum</b>:{ ' ' }
                                                              { data.successful_elapsed_sum.toFixed(2) }s
                                                          </p>
                                                          <p>
                                                              <b>Failed elapsed sum</b>:{ ' ' }
                                                              { data.failed_elapsed_sum.toFixed(2) }s
                                                          </p>
                                                          <p>
                                                              <b>Automation percentage</b>:{ ' ' }
                                                              { formatPercentage(
                                                                  data.template_automation_percentage.toFixed(
                                                                      2
                                                                  )
                                                              ) }
                                                          </p>
                                                          <p>
                                                              <b>Associated organizations</b>:{ ' ' }
                                                              <span key={ data.id }>
                                                                  { convertWithCommas(data.orgs, 'org_name') }
                                                              </span>
                                                          </p>
                                                          <p>
                                                              <b>Associated clusters</b>:{ ' ' }
                                                              <span key={ data.id }>
                                                                  { convertWithCommas(
                                                                      data.clusters,
                                                                      'cluster_name'
                                                                  ) }
                                                              </span>
                                                          </p>
                                                      </TooltipWrapper>
                                                  }
                                              >
                                                  <InfoCircleIcon />
                                              </Tooltip>
                                              { data.isActive === true && (
                                                  <ToggleOnIcon
                                                      onClick={ () => {
                                                          const selected = handleToggle(
                                                              data.id,
                                                              selectedIds
                                                          );
                                                          setSelectedIds(selected);
                                                      } }
                                                  />
                                              ) }
                                              { data.isActive === false && (
                                                  <ToggleOffIcon
                                                      onClick={ () => {
                                                          const selected = handleToggle(
                                                              data.id,
                                                              selectedIds
                                                          );
                                                          setSelectedIds(selected);
                                                      } }
                                                  />
                                              ) }
                                          </IconGroup>
                                      </TemplateDetail>
                                      <p style={ { color: '#486B00' } }>
                          ${ data.delta.toFixed(2) }
                                      </p>
                                  </div>
                              )) }
                          </CardBody>
                      </Card>
                  </Main>
              </WrapperRight>
          </Wrapper>
        </>
      ) }
    </>
    );
};

export default AutomationCalculator;
