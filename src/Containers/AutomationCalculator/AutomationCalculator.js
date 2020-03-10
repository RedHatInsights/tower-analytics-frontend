/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import moment from 'moment';

// import { useQueryParams } from "../../Utilities/useQueryParams";
// import LoadingState from "../../Components/LoadingState";
// import NoData from "../../Components/NoData";
// import EmptyState from '../../Components/EmptyState';
// import { preflightRequest } from '../../Api';

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
    Title
} from '@patternfly/react-core';

import { DollarSignIcon } from '@patternfly/react-icons';

import TopTemplatesSavings from '../../Charts/ROITopTemplates';

import {
    calculateDelta,
    convertSecondsToMins,
    convertMinsToSeconds,
    convertSecondsToHours
} from '../../Utilities/helpers';

let sampleAPIResponse = [
    // time in seconds
    {
        name: 'Job Template 1',
        id: 1,
        avg_run: 140,
        run_count: 3
    },
    {
        name: 'Job Template 2',
        id: 2,
        avg_run: 240,
        run_count: 4
    },
    {
        name: 'Job Template 3',
        id: 3,
        avg_run: 340,
        run_count: 13
    },
    {
        name: 'Job Template 4',
        id: 4,
        avg_run: 940,
        run_count: 1
    },
    {
        name: 'Job Template 5',
        id: 5,
        avg_run: 40,
        run_count: 1
    },
    {
        name: 'Job Template 6',
        id: 6,
        avg_run: 340,
        run_count: 1
    },
    {
        name: 'Job Template 7',
        id: 7,
        avg_run: 123,
        run_count: 4
    },
    {
        name: 'Job Template 8',
        id: 8,
        avg_run: 230,
        run_count: 5
    },
    {
        name: 'Job Template 9',
        id: 9,
        avg_run: 100,
        run_count: 3
    },
    {
        name: 'Job Template 10',
        id: 10,
        avg_run: 240,
        run_count: 4
    }
];

let defaultAvgRunVal = 3600; // 1 hr

// create our array to feed to D3
const formatData = (response, defaults) => {
    return response.reduce((formatted, { name, id, avg_run, run_count }) => {
        formatted.push({
            name,
            id,
            run_count,
            calculations: [
                {
                    type: 'manual',
                    avg_run: defaults,
                    total: defaults * run_count
                },
                {
                    type: 'automated',
                    avg_run,
                    total: avg_run * run_count
                }
            ]
        });
        return formatted;
    }, []);
};

const initialData = formatData(sampleAPIResponse, defaultAvgRunVal);

const InputAndText = styled.div`
  display: flex;
  align-items: center;
  padding-top: 10px;

  & .pf-c-input-group {
    flex-basis: 150px;
    margin-right: 10px;
  }
`;

const title = (
    <span>
    Automation Analytics
        <span style={ { fontSize: '16px' } }>
            { ' ' }
            <span style={ { margin: '0 10px' } }>|</span> Automation calculator
        </span>
    </span>
);

const AutomationCalculator = () => {
    // const [ preflightError, setPreFlightError ] = useState(null);
    // const [ firstRender, setFirstRender ] = useState(true);
    const [ placeholderData, setPlaceholderData ] = useState(initialData);
    const [ costManual, setCostManual ] = useState(0);
    const [ costAutomation, setCostAutomation ] = useState(0);
    const [ totalSavings, setTotalSavings ] = useState(0);
    useEffect(() => {
        let data = [ ...placeholderData ];
        let total = 0;

        data.forEach(datum => {
            total += calculateDelta(
                convertSecondsToHours(datum.calculations[1].total) * costAutomation,
                convertSecondsToHours(datum.calculations[0].total) * costManual
            );
        });
        const totalWithCommas = total
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setTotalSavings('$' + totalWithCommas);
    }, [ placeholderData, costManual, costAutomation ]);

    const updateData = (ms, id) => {
        let data = [ ...placeholderData ];
        data.map(datum => {
            if (datum.id === id) {
                datum.calculations[0].avg_run = ms;
                datum.calculations[0].total = ms * datum.run_count;
            }
        });
        return data;
    };

    const handleChange = (e, id) => {
        const ms = convertMinsToSeconds(e);
        const updated = updateData(ms, id);
        setPlaceholderData(updated);
    };

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title={ title } />
            </PageHeader>
            { /* { preflightError && (
                <Main>
                    <Card>
                        <CardBody>
                            <EmptyState { ...preflightError } />
                        </CardBody>
                    </Card>
                </Main>
            ) }
            { !preflightError && ( */ }
        <>
          <div style={ { display: 'flex' } }>
              <div style={ { flex: '2' } }>
                  <Main style={ { paddingBottom: '0' } }>
                      <Card>
                          <CardHeader>Automation vs manual</CardHeader>
                          <CardBody>
                              { placeholderData && (
                                  <TopTemplatesSavings
                                      margin={ { top: 20, right: 20, bottom: 50, left: 70 } }
                                      id="d3-roi-chart-root"
                                      data={ initialData }
                                  />
                              ) }
                          </CardBody>
                      </Card>
                  </Main>
                  <Main style={ { paddingBottom: '0' } }>
                      <Card>
                          <CardHeader>Automation formula</CardHeader>
                          <CardBody>
                              <p>
                      Your automation savings is calculated by the following
                      formula:
                              </p>
                              <p>
                                  <em>
                        S = &sum;fc<sub>m</sub>t - fc<sub>a</sub>t
                                  </em>
                              </p>
                          </CardBody>
                      </Card>
                  </Main>
              </div>
              <div style={ { flex: '1' } }>
                  <Main style={ { paddingBottom: '0', paddingLeft: '0' } }>
                      <Card>
                          <CardHeader style={ { paddingBottom: '0' } }>
                    Total savings
                          </CardHeader>
                          <CardBody>
                              <Title
                                  headingLevel="h3"
                                  size="2xl"
                                  style={ { color: 'var(--pf-global--success-color--200)' } }
                              >
                                  { totalSavings }
                              </Title>
                          </CardBody>
                      </Card>
                  </Main>
                  <Main style={ { paddingBottom: '0', paddingLeft: '0' } }>
                      <Card>
                          <CardHeader>Calculate your automation</CardHeader>
                          <CardBody>
                              <InputAndText>
                                  <InputGroup>
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
                                  <p>Manual cost of automation</p>
                              </InputAndText>
                              <em>
                      (e.g. average salary of mid-level SE with your company)
                              </em>
                              <InputAndText>
                                  <InputGroup>
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
                                  <p>Cost of automation</p>
                              </InputAndText>
                          </CardBody>
                      </Card>
                  </Main>
                  <Main style={ { paddingBottom: '0', paddingLeft: '0' } }>
                      <Card>
                          <CardHeader>Top templates</CardHeader>
                          <CardBody>
                              <p>
                      Enter the time it takes to run the following templates by
                      hand.
                              </p>
                              { placeholderData.map(data => (
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
                                                  handleChange(e, data.id);
                                              } }
                                          />
                                          <InputGroupText>min</InputGroupText>
                                      </InputGroup>
                                      <p>
                                          { data.name } (ran x { data.run_count } times)
                                      </p>
                                  </InputAndText>
                              )) }
                          </CardBody>
                      </Card>
                  </Main>
                  { /* </Main> */ }
              </div>
          </div>
        </>
        { /* ) } */ }
        </React.Fragment>
    );
};

export default AutomationCalculator;
