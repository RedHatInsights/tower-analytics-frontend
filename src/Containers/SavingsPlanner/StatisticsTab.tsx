import React, { FunctionComponent, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardTitle,
  List,
  ListItem,
  ToggleGroup,
  ToggleGroupItem
} from '@patternfly/react-core';
import { SquareFullIcon } from '@patternfly/react-icons';

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
import TotalSavings from "./TotalSavings";
import { NonGroupedApi } from 'react-data-explorer/dist/cjs/components/Chart/Api';
import FormulaDescription from './FormulaDescription';

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
const formatNumberAsK = (n: string | number): string => {
  if (Math.abs(+n) > 1000) {
    return `${(+n / 1000).toFixed(1)}K`;
  } else {
    return `${(+n).toFixed(0)}`;
  }
}

const getChartData = (data: Data): NonGroupedApi => {
  const years = ['initial', 'year1', 'year2', 'year3'];
  const statsData = years.map(year => ({
    total_costs: +data.projections.monetary_stats.total_costs[year] * -1,
    year,
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
  /**
   * It uses the log10 method to get the numbers "nice", meaning:
   * 10, 20, ..., 100, 200, ..., 1000, 2000, ... 10000, 20000...
   * 
   * The keys for each dataset are hardcoded, if the keys change it
   * should be reflected in this method too. 
   * 
   * @returns Gets the highest and the lovest value from the data.
   */
  const getDomainFromData = (): [number, number] => {
    const keys = chartType === 'Money' ?
      ['total_costs', 'total_benefits', 'cumulative_net_benefits'] :
      ['total_hours_spent_risk_adjusted', 'total_hours_saved', 'cumulative_time_net_benefits'];

    const chartData = getChartData(data) as NonGroupedApi;
    let maxInAnyData = 0;
    let minInAnyData = 0;
    chartData.items.forEach(el => {
      keys.forEach((key) => {
        if (!isNaN(el[key] as number)) {
          const rounded = Math.pow(10, Math.floor(Math.log10(Math.abs(+el[key]))));
          const value = rounded === 0 ?
            0 : 
            rounded * Math.ceil(Math.abs(+el[key])/rounded);
          
          if (el[key] > 0) {
            maxInAnyData = Math.max(maxInAnyData, value);
          } else {
            minInAnyData = Math.min(minInAnyData, -value);
          }
        }
      })
    });
    
    return [minInAnyData, maxInAnyData];
  }

  // TODO move this logic to the chart renderer
  /**
   * Calculate the ticks from the data set for the y axis of the chart.
   * The number of tick is fixed in the no and depending how big negative and positive
   * values are in the chart it can adds more ticks in negative or positive interval.
   *  
   * @param no log2 number of ticks we need for the chart.
   * @returns Array of ticks where the domain should be the edge of this array.
   */
  const getTickValues = (no = 3): number[] => {
    no = Math.pow(2, no); // I don't know why it works only with the power of 2...
    const domain = getDomainFromData();
    const interval = Math.abs(domain[0]) + Math.abs(domain[1]);
    const ticksInterval = interval / no;
    let firstTick = -ticksInterval;
    while (firstTick > domain[0] + ticksInterval) {
      firstTick -= ticksInterval;
    }
    const ticks = [];
    for(let i = 0; i <= no; i++) {
      ticks.push(firstTick + ticksInterval * i);
    }
    return ticks; 
  }

  /**
   * Calculates the ticks and returning the edge ticks which mark the domain
   * for the chart itself.
   * 
   * @returns Chart domain got from the ticks. 
   */
  const getDomainFromTicks = (): [number, number] => {
    const ticks = getTickValues();
    return [ticks[0], ticks[ticks.length -1]];
  }

  /**
   * Removes the edge ticks.
   * 
   * @param ticks The ticsk for the chart where the edge ticks are the domain for the chart.
   * @returns Ticks without the edge cases, to there is no tick on the x axis and at the top.
   */
  const cutCorners = (ticks: number[]) => {
    ticks.pop();
    ticks.shift();
    return ticks;
  }

  // TODO move this logic to the chart renderer
  /**
   * Calculate the y offset for an axis from height and from the number of ticks
   * and number of negative ticks. Has the top + bottom padding encoded as constant (120).
   * Changing the margin will cause the function to calculate the offset wrogly.
   * 
   * @param ticks All the ticks for the chart, with the end ticks to be the edges of the domain
   * @param height The height of the chart
   * @returns Offset for the axis even if it has negative values.
   */
  const getXOffsetForAxis = (ticks: number[], height = 600): number => {
    const negativeTicks = ticks.filter(n => n < 0).length;
    return ((height - 80 /*padding*/) / (ticks.length - 1)) * (negativeTicks);
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
            left: 80,
            bottom: 70,
            top: 10,
          },
          themeColor: ChartThemeColor.gray
        },
        tooltip: {
          cursor: true
        },
        xAxis: {
          label: 'Time',
          offsetY: getXOffsetForAxis(getTickValues())
        },
        yAxis: {
          label: chartType == 'Money' ? 'Money Saved' : 'Hours Saved',
          tickFormat: 'formatNumberAsK',
          style: {
            grid: {stroke: '#D2D2D2'},
            axisLabel: { padding: 60 }
          },
          domain: {y: getDomainFromTicks()},
          tickValues: cutCorners(getTickValues()),
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

  const renderLeft = () => (
    <WrapperLeft>
      <Card>
        <CardHeader>
          <CardActions>
            <ToggleGroup aria-label="toggleButton">
              {types.map(type => (
                <ToggleGroupItem key={type} text={type} buttonId={type} isSelected={chartType === type} onChange={() => toggleButton(type)} />
              ))}
            </ToggleGroup>
          </CardActions>
          <CardTitle>
            {data.name}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <ChartRenderer data={barChartData} />
        </CardBody>
      </Card>
    </WrapperLeft>
  );

  const renderRight = () => (
    <WrapperRight>
      <TotalSavings
        value={computeTotalSavings(data)}
        isMoney={chartType === 'Money'}
      />
      <Card>
        <CardBody>
            <List isPlain>
              <ListItem icon={<SquareFullIcon color={chartType == 'Money' ? '#81C46B' : '#0063CF'} />}>
                Savings from automating this plan
              </ListItem>
              <ListItem icon={<SquareFullIcon color="#58595c" />}>
                Costs from creating, maintaining and running the automation
              </ListItem>
              <ListItem icon={<SquareFullIcon color="#EE7A00" />}>
                Cumulative savings over time
              </ListItem>
            </List>
        </CardBody>
      </Card>
      <FormulaDescription isMoney={chartType === 'Money'} />
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

export default StatisticsTab;
