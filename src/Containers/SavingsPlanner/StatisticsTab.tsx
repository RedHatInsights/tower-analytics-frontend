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
  ChartSchema
} from 'react-data-explorer';
// This is little bit hacky, I will try to export them top level.
import { ApiReturnType, ApiType } from 'react-data-explorer/dist/src/components/Chart/Api';

import RoutedTabs from '../../Components/RoutedTabs';
import AutomationFormula from "../AutomationCalculator/AutomationFormula";
import TotalSavings from "../AutomationCalculator/TotalSavings";

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

// Functions moved out: shadowing the data prop.
// Renamed: name resmebling react state setters
const getChartData = (data: Data): ApiReturnType => {
  const years = ['initial', 'year1', 'year2', 'year3'];
  const statsData = years.map(year => ({
    year,
    total_costs: data.projections.monetary_stats.total_costs[year],
    total_benefits: data.projections.monetary_stats.total_benefits[year],
    cumulative_net_benefits: data.projections.monetary_stats.cumulative_net_benefits[year],
    total_hours_spent_risk_adjusted: data.projections.time_stats.total_hours_spent_risk_adjusted[year],
    total_hours_saved: data.projections.time_stats.total_hours_saved[year],
    cumulative_time_net_benefits: data.projections.time_stats.cumulative_time_net_benefits[year]
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
            y: 20,
            x: 100
          },
          themeColor: ChartThemeColor.gray,
          style: {
            parent: {
                border: '1px solid gray'
              }
          },
        },
        tooltip: {
          cursor: true
        },
        xAxis: {
          label: 'Time',
        },
        yAxis: {
          label: chartType == 'Money' ? 'Money Saved' : 'Hours Saved',
          style: {
            grid: {stroke: '#D2D2D2'},
          },
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
            <div style={{'background': chartType == 'Money' ? '#81C46B' : '#0063CF','height':'10px','width':'10px', 'float':'left', 'padding':'0px', 'margin':'0px'}} />
            <div style={{'padding':'0px', 'margin':'0px'}}>Operation savings efficiency from Ansible template</div>

            <div style={{'background':'#EE7A00','height':'10px','width':'10px', 'float':'left', 'padding':'0px', 'margin':'0px'  }} />
            <div style={{'padding':'0px', 'margin':'0px'}}>Cumulative net benefits</div>

            <div style={{'background':'#58595c','height':'10px','width':'10px', 'float':'left', 'padding':'0px', 'margin':'0px'  }} />
            <div style={{'padding':'0px', 'margin':'0px'}}>Costs</div>
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
