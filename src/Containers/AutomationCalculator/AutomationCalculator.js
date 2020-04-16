/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import LoadingState from '../../Components/LoadingState';
import NoData from '../../Components/NoData';
import EmptyState from '../../Components/EmptyState';
import { preflightRequest, readROI } from '../../Api';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

import {
    Card,
    CardBody,
    CardHeader,
    InputGroup,
    InputGroupText,
    TextInput,
    Title,
    Grid,
    GridItem,
    Tooltip,
    TooltipPosition
} from '@patternfly/react-core';

import {
    DollarSignIcon,
    InfoCircleIcon,
    OutlinedEyeIcon,
    OutlinedEyeSlashIcon
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

let defaultAvgRunVal = 3600; // 1 hr in seconds

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

  @media (max-width: 1350px) {
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: auto;

  div,
  p {
    margin: 10px;
  }
`;

const Color = styled.div.attrs(props => ({
    color: props.color || 'black'
}))`
  min-width: 12px;
  height: 12px;
  background: ${props => props.color};
  margin-right: 10px;
`;

const LegendTitle = styled.span`
  font-size: 12px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

const title = (
    <span>
    Automation Analytics
        <span style={ { fontSize: '16px' } }>
            { ' ' }
            <span style={ { margin: '0 10px' } }>|</span> Automation Calculator
        </span>
    </span>
);

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
                            avg_run: defaults,
                            total: defaults * successful_host_run_count || 0
                        },
                        {
                            type: 'Automated',
                            avg_run: successful_elapsed_sum || 0,
                            total: successful_elapsed_sum * successful_host_run_count || 0
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
        updatedData.map(datum => {
            if (datum.id === id) {
                // Update manual calculations
                datum.calculations[0].avg_run = seconds;
                datum.calculations[0].total = seconds * datum.successful_host_run_count;
            }
        });
        return updatedData;
    };

    const handleManualTimeChange = minutes => {
        const seconds = convertMinsToSeconds(minutes);
        return seconds;
    };

    const formatSelectedIds = (arr, id) => {
        let selected;
        if (arr.includes(id)) {
            selected = [ ...arr ].filter(s => s !== id);
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
    const [ preflightError, setPreFlightError ] = useState(null);
    const [ costManual, setCostManual ] = useState(0);
    const [ costAutomation, setCostAutomation ] = useState(0);
    const [ totalSavings, setTotalSavings ] = useState(0);
    const [ unfilteredData, setUnfilteredData ] = useState([]);
    const [ formattedData, setFormattedData ] = useState([]);
    const [ templatesList, setTemplatesList ] = useState([]);
    const [ roiData, setRoiData ] = useState([]);
    const [ selectedIds, setSelectedIds ] = useState([]);

    const { formatData } = automationCalculatorMethods();

    useEffect(() => {
        let ignore = false;
        const getData = () => {
            return readROI({ params: {}});
        };

        async function initializeWithPreflight() {
            setIsLoading(true);
            await window.insights.chrome.auth.getUser();
            await preflightRequest().catch(error => {
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
    }, []);

    useEffect(() => {
        let data = [ ...formattedData ];
        let total = 0;
        let costAutomationPerHour;
        let costManualPerHour;

        data.forEach(datum => {
            costAutomationPerHour =
        convertSecondsToHours(datum.successful_elapsed_sum) * costAutomation;
            costManualPerHour =
        convertSecondsToHours(datum.calculations[0].avg_run) *
        datum.successful_host_run_count *
        costManual;
            total += calculateDelta(costAutomationPerHour, costManualPerHour);
            datum.delta = calculateDelta(costAutomationPerHour, costManualPerHour);
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
        templatesList.map(l => {
            if (selectedIds.includes(l.id)) {
                l.isActive = false;
            } else {
                l.isActive = true;
            }
        });
        setFormattedData(filteredData);
    }, [ selectedIds ]);

    useEffect(() => {
        const formatted = formatData(roiData, defaultAvgRunVal);
        setUnfilteredData(formatted);
        setFormattedData(formatted);
        setTemplatesList(formatted);
    }, [ roiData ]);

    return {
        isLoading,
        preflightError,
        costManual,
        setCostManual,
        costAutomation,
        setCostAutomation,
        totalSavings,
        unfilteredData,
        setUnfilteredData,
        formattedData,
        setFormattedData,
        templatesList,
        setTemplatesList,
        roiData,
        setRoiData,
        selectedIds,
        setSelectedIds
    };
};

const AutomationCalculator = () => {
    const {
        isLoading,
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
        preflightError
    } = useAutomationFormula();

    const {
        updateData,
        handleManualTimeChange,
        handleToggle
    } = automationCalculatorMethods();

    return (
    <>
      <PageHeader style={ { flex: '0' } }>
          <PageHeaderTitle title={ title } />
      </PageHeader>
      {preflightError && (
          <Main>
              <Card>
                  <CardBody>
                      <EmptyState { ...preflightError } />
                  </CardBody>
              </Card>
          </Main>
      )}
      {!preflightError && (
          <Grid>
              <GridItem
                  span={ 8 }
                  style={ { display: 'flex', flexDirection: 'column' } }
              >
                  <Main style={ { paddingBottom: '0' } }>
                      <Card>
                          <CardHeader>Automation vs manual</CardHeader>
                          <CardBody>
                              { isLoading && !preflightError && <LoadingState /> }
                              { !isLoading && formattedData.length <= 0 && <NoData /> }
                              { formattedData.length > 0 && !isLoading && (
                    <>
                      <TopTemplatesSavings
                          margin={ { top: 20, right: 20, bottom: 10, left: 70 } }
                          id="d3-roi-chart-root"
                          data={ formattedData }
                          selected={ selectedIds }
                      />
                      <p style={ { textAlign: 'center' } }>Templates</p>
                      <Wrapper>
                          <Color color={ '#0066CC' } />
                          <LegendTitle>Automated</LegendTitle>
                          <Color color={ '#F0AB00' } />
                          <LegendTitle>Manual</LegendTitle>
                      </Wrapper>
                    </>
                              ) }
                          </CardBody>
                      </Card>
                  </Main>
                  <Main>
                      <Card style={ { height: '100%' } }>
                          <CardHeader>Automation formula</CardHeader>
                          <CardBody>
                              <p>
                                  <b>Manual cost for template X</b> =
                                  <em>
                      (time for a manual run on one host * (sum of all hosts
                      across all job runs) ) * cost per hour
                                  </em>
                              </p>
                              <p>
                                  <b>Automation cost for template X</b> =
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
              </GridItem>
              <GridItem span={ 4 }>
                  <Main style={ { paddingBottom: '0', paddingLeft: '0' } }>
                      <Card>
                          <CardHeader style={ { paddingBottom: '0' } }>
                  Total savings
                          </CardHeader>
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
                          <CardHeader style={ { paddingBottom: '10px' } }>
                  Calculate your automation
                          </CardHeader>
                          <CardBody>
                              <InputAndText>
                                  <p>Manual cost of automation</p>
                                  <em style={ { color: 'var(--pf-global--Color--dark-200)' } }>
                      (e.g. average salary of mid-level SE)
                                  </em>
                                  <InputGroup style={ { width: '50%' } }>
                                      <InputGroupText>
                                          <DollarSignIcon />
                                      </InputGroupText>
                                      <TextInput
                                          id="manual-cost"
                                          type="number"
                                          aria-label="manual-cost"
                                          value={ costManual }
                                          onChange={ e => setCostManual(e) }
                                      />
                                      <InputGroupText>/hr</InputGroupText>
                                  </InputGroup>
                              </InputAndText>
                              <InputAndText style={ { paddingTop: '10px' } }>
                                  <p>Cost of automation</p>
                                  <InputGroup style={ { width: '50%' } }>
                                      <InputGroupText>
                                          <DollarSignIcon />
                                      </InputGroupText>
                                      <TextInput
                                          id="automation-cost"
                                          type="number"
                                          aria-label="automation-cost"
                                          value={ costAutomation }
                                          onChange={ e => setCostAutomation(e) }
                                      />
                                      <InputGroupText>/hr</InputGroupText>
                                  </InputGroup>
                              </InputAndText>
                          </CardBody>
                      </Card>
                  </Main>
                  <Main style={ { paddingLeft: '0' } }>
                      <Card style={ { height: '41vh', overflow: 'auto' } }>
                          <CardHeader>Top templates</CardHeader>
                          <CardBody>
                              <p>
                    Enter the time it takes to run the following templates
                    manually.
                              </p>
                              { templatesList.map(data => (
                                  <div key={ data.id }>
                                      <p style={ { padding: '15px 0 10px' } }>{ data.name }</p>
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
                                                      onChange={ e => {
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
                                                              <b>Automation Percentage</b>:{ ' ' }
                                                              { formatPercentage(data.template_automation_percentage.toFixed(2)) }
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
                                                  <OutlinedEyeIcon
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
                                                  <OutlinedEyeSlashIcon
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
                                  </div>
                              )) }
                          </CardBody>
                      </Card>
                  </Main>
              </GridItem>
          </Grid>
      )}
    </>
    );
};

export default AutomationCalculator;
