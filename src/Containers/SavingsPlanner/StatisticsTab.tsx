import React, { FunctionComponent, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, CardBody, ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';
import {
  functions,
  ChartRenderer,
  ChartKind,
  ChartThemeColor,
  ChartType,
  ChartTopLevelType,
  ChartSchema,
  ApiType,
} from 'react-data-explorer';

import RoutedTabs from '../../Components/RoutedTabs';
import AutomationFormula from "../AutomationCalculator/AutomationFormula";
import TotalSavings from "../AutomationCalculator/TotalSavings";
import { NonGroupedApi } from 'react-data-explorer/dist/cjs/components/Chart/Api';

const TopCard = styled(Card)`
  min-height: 500px;
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
  height: 600;
  display: flex;
  flex-direction: column;
`;

const LegendGroup = styled.div`
  display: flex;
  align-items: center;
`;
const LegendIcon = styled.div`
  height: 10px;
  width: 10px;
  margin-right: 10px;
  background: ${props => props.color};
`;
const LegendDescription = styled.div`
  flex: 1;
`;

type DataYearsSeries = Record<string, number>;

// This should model the return type somewhere next to the Api.js where the call is made.
// This is just a basic mockup of the exact data for TS to work.
interface Data {
  name: string,
  projections: {
    time_stats: {
      cumulative_time_net_benefits: DataYearsSeries,
      total_hours_saved: DataYearsSeries,
      total_hours_spent_risk_adjusted: DataYearsSeries
    },
    monetary_stats: {
      cumulative_net_benefits: DataYearsSeries,
      total_benefits: DataYearsSeries,
      total_costs: DataYearsSeries
    }
  },
};

interface Props {
  tabsArray: {
    id: number,
    link: string,
    name: React.ReactNode
  }[],
  data: Data
};

// TODO move this logic to the chart renderer
const formatNumberAsK = (n: number): string => {
  if (Math.abs(n) > 1000) {
    return `${n / 1000}K`;
  } else {
    return `${n}`;
  }
}

const getChartData = (data: Data): NonGroupedApi => {
  const years = ['initial', 'year1', 'year2', 'year3'];
  const statsData = years.map(year => ({
    year,
    total_costs: +data.projections.monetary_stats.total_costs[year] * -1,
    total_benefits: +data.projections.monetary_stats.total_benefits[year],
    cumulative_net_benefits: +data.projections.monetary_stats.cumulative_net_benefits[year],
    total_hours_spent_risk_adjusted: +data.projections.time_stats.total_hours_spent_risk_adjusted[year] * -1,
    total_hours_saved: +data.projections.time_stats.total_hours_saved[year],
    cumulative_time_net_benefits: +data.projections.time_stats.cumulative_time_net_benefits[year]
  }));

  return { items: statsData, type: ApiType.nonGrouped, response_type: '' };
};

const StatisticsTab: FunctionComponent<Props> = ({ tabsArray, data }) => {
  const types = ['Money', 'Time'];
  const [chartType, setChartType] = useState(types[0]);

  const computeTotalSavings = (d: Data): number =>
    chartType == 'Money'
      ? d.projections.monetary_stats.cumulative_net_benefits.year3
      : d.projections.time_stats.cumulative_time_net_benefits.year3

  // TODO move this logic to the chart renderer
  const getDomainFromData = (): [number, number] => {
    const keys = chartType === 'Money' ?
      ['total_coststs', 'total_benefits', 'cumulative_net_benefits'] :
      ['total_hours_spent_risk_adjusted', 'total_hours_saved', 'cumulative_time_net_benefits'];
    const chartData = getChartData(data) as NonGroupedApi;
    let maxInAnyData = 0;
    chartData.items.forEach(el => {
      keys.forEach((key) => {
        if (!isNaN(el[key] as number)) {
          const rounded = Math.pow(10, Math.floor(Math.log10(Math.abs(+el[key]))));
          const value = rounded === 0 ?
            0 : 
            rounded * Math.ceil(Math.abs(+el[key])/rounded);
          maxInAnyData = Math.max(maxInAnyData, value);
        }
      })
    });
    return [-maxInAnyData, maxInAnyData];
  }

  // TODO move this logic to the chart renderer
  const getTickValues = (no = 3): number[] => {
    no = Math.pow(2, no); // I don't know why it works only with the power of 2...
    const domain = getDomainFromData();
    const interval = Math.abs(domain[0]) + Math.abs(domain[1]);
    const ticksInterval = interval / no;
    const ticks = [0];
    for(let i = 1; i < no/2; i++) {
      ticks.unshift(-1 * ticksInterval * i);
      ticks.push(ticksInterval * i);
    }
    return ticks; 
  }

  // TODO move this logic to the chart renderer
  const getXOffsetForAxis = (height = 600): number => {
    return height / 2 - 50;
  };

  const barChartData: ChartSchema = {
    charts: [
      {
        id: 1000,
        kind: ChartKind.wrapper,
        type: ChartTopLevelType.chart,
        parent: null,
        props: {
          height: 600,
          domainPadding: {
            x: 100
          },
          padding: {
            left: 70,
            bottom: 70,
          },
          themeColor: ChartThemeColor.gray
        },
        tooltip: {
          cursor: true
        },
        xAxis: {
          label: 'Time',
          offsetY: getXOffsetForAxis()
        },
        yAxis: {
          label: chartType == 'Money' ? 'Money Saved' : 'Hours Saved',
          tickFormat: 'formatNumberAsK',
          style: {
            grid: {stroke: '#D2D2D2'},
            axisLabel: { padding: 50 }
          },
          domain: {y: getDomainFromData()},
          tickValues: getTickValues(),
        },
      },
      {
        id: 1001,
        kind: ChartKind.stack,
        parent: 1000,
        props: {},
      },
      {
        id: 1101,
        kind: ChartKind.simple,
        type: ChartType.bar,
        parent: 1001,
        props: {
          x: 'year',
          y: chartType == 'Money' ? 'total_costs' : 'total_hours_spent_risk_adjusted',
          barRatio: 0.8,
          barWidth: 0,
          style: {
            data: {
              fill: '#8B8D8F',
              width: 120,
            },
          },
        },
      },
      {
        id: 1102,
        kind: ChartKind.simple,
        type: ChartType.bar,
        parent: 1001,
        props: {
          x: 'year',
          y: chartType == 'Money' ? 'total_benefits' : 'total_hours_saved',
          barRatio: 0.8,
          barWidth: 0,
          style: {
            data: {
              fill: chartType == 'Money' ? '#81C46B' : '#0063CF',
              width: 120,
            },
          },
        },
      },
      {
        id: 1002,
        kind: ChartKind.simple,
        type: ChartType.line,
        parent: 1000,
        props: {
          x: 'year',
          y: chartType === 'Money' ? 'cumulative_net_benefits' : 'cumulative_time_net_benefits',
          style: {
            data: {
              stroke: '#EE7A00',
              strokeWidth: 5
            },
          },
        },
      },
    ],
    functions: {
      ...functions,
      axisFormat: {
        ...functions.axisFormat,
        formatNumberAsK
      },
      fetchFnc: () => new Promise((resolve) => { resolve(getChartData(data)); }),
    },
  };

  const toggleButton = (type: string) => {
    setChartType(type);
  };

  const renderButtons = () => {
    return (
      <ToggleGroup aria-label="toggleButton">
        {types.map(type => (
          <ToggleGroupItem key={type} text={type} buttonId={type} isSelected={chartType === type} onChange={() => toggleButton(type)} />
        ))}
      </ToggleGroup>
    );
  };

  const renderLeft = () => (
    <WrapperLeft>
      <Card>
        <div>
          <div style={{ padding: '1rem', 'float':'left'}}>{data.name}</div>
          <div style={{ padding: '1rem', 'float':'right'}}>{renderButtons()}</div>
        </div>
        <CardBody>
          <ChartRenderer data={barChartData} />
        </CardBody>
      </Card>
    </WrapperLeft>
  );

  const renderRight = () => (
    <WrapperRight>
      <TotalSavings
        totalSavings={computeTotalSavings(data)}
      />
      <Card>
        <CardBody>
            <LegendGroup>
              <LegendIcon color={chartType == 'Money' ? '#81C46B' : '#0063CF'} />
              <LegendDescription>
                Operation savings efficiency from Ansible template
              </LegendDescription>
            </LegendGroup>
            <LegendGroup>
              <LegendIcon color="#EE7A00" />
              <LegendDescription>
                Cumulative net benefits
              </LegendDescription>
            </LegendGroup>
            <LegendGroup>
              <LegendIcon color="#58595c" />
              <LegendDescription>
                Costs
              </LegendDescription>
            </LegendGroup>
        </CardBody>
      </Card>
      <AutomationFormula />
    </WrapperRight>
  );


  return (
    <React.Fragment>
      <TopCard>
        <RoutedTabs tabsArray={tabsArray} />
        <Wrapper className="statistics-wrapper">
          {renderLeft()}
          {renderRight()}
        </Wrapper>
      </TopCard>
    </React.Fragment>
  );
};

StatisticsTab.propTypes = {
  tabsArray: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.number,
      link: PropTypes.string,
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    })
  ).isRequired,
  // This is really hard to modell, we can just comment out so we don't get 
  // runtime warnings but TS should make it pretty safe to use as long as it is not
  // dependent on user input which we sepcify in TS as 'any'
  // data: PropTypes.object
};

export default StatisticsTab;
