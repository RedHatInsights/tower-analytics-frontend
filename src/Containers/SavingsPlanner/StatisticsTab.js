import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, CardBody, ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';
import {
  functions,
  ChartRenderer,
  ChartKind,
  ChartThemeColor,
  ChartType,
  ChartTopLevelType
} from 'react-data-explorer';

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

const StatisticsTab = ({ tabsArray, data }) => {
  const [barChartData, setBarChartData] = useState({ charts: [], functions });
  const types = ['Money', 'Time'];
  const [chartType, setChartType] = useState(types[0]);

  const setChartData = (data) => {
    const allKeys = [];
    const yearTitles = [];
    const statsData = [];
    const stats = {...data.projections.time_stats, ...data.projections.monetary_stats}
    for (var key in stats) {
        allKeys.push(key)
    }
    for (var subKey in stats[allKeys[0]]) {
      yearTitles.push(subKey)
    }

    let hsh = {}
    for (var y in yearTitles) {
      hsh['year'] = yearTitles[y];
      for (var k in allKeys) {
        hsh[allKeys[k]] = stats[allKeys[k]][yearTitles[y]];
      }
      statsData.push(hsh)
      hsh = {}
    }
    return {items: statsData};
  }

  const computeTotalSavings = (data) => {
    return chartType == 'Money' ? data.projections.monetary_stats.cumulative_net_benefits.year3 : data.projections.time_stats.cumulative_time_net_benefits.year3
  }

  useEffect(() => {
    setBarChartData({
      ...barChartData,
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
          tickLabels: { textAnchor: 'end' },
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
        fetchFnc: () => {
          return new Promise((resolve) => { resolve(setChartData(data, chartType)); });
        },
      },
    });
  }, [chartType]);

  const toggleButton = (type) => {
    setChartType(type);
  }

  const renderButtons = () => {
    return (
      <ToggleGroup aria-label="toggleButton">
        {types.map(type => (
          <ToggleGroupItem key={type} text={type} buttonId={type} isSelected={chartType === type} onChange={() => toggleButton(type)} />
        ))}
      </ToggleGroup>
    );
  }

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
  tabsArray: PropTypes.array,
  data: PropTypes.object
};
export default StatisticsTab;