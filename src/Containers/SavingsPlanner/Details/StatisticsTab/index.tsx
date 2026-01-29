import {
  ChartKind,
  ChartLabelFormatFunction,
  ChartSchemaElement,
  ChartThemeColor,
  ChartTopLevelType,
  ChartType,
} from '@ansible/react-json-chart-builder';
import { Card } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardBody } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardHeader } from '@patternfly/react-core/dist/dynamic/components/Card';
import { CardTitle } from '@patternfly/react-core/dist/dynamic/components/Card';
import { List } from '@patternfly/react-core/dist/dynamic/components/List';
import { ListItem } from '@patternfly/react-core/dist/dynamic/components/List';
import { ToggleGroupItem } from '@patternfly/react-core/dist/dynamic/components/ToggleGroup';
import { ToggleGroup } from '@patternfly/react-core/dist/dynamic/components/ToggleGroup';
import { Grid } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import { GridItem } from '@patternfly/react-core/dist/dynamic/layouts/Grid';
import SquareFullIcon from '@patternfly/react-icons/dist/dynamic/icons/square-full-icon';
import React, { FunctionComponent, useState } from 'react';
import Chart from '../../../../Components/Chart';
import { ApiReturnType } from '../../../../Components/Chart/types';
import RoutedTabs from '../../../../Components/RoutedTabs';
import currencyFormatter from '../../../../Utilities/currencyFormatter';
import hoursFormatter from '../../../../Utilities/hoursFormatter';
import FormulaDescription from './FormulaDescription';
import TotalSavings from './TotalSavings';

// This should model the return type somewhere next to the Api.js where the call is made.
// This is just a basic mockup of the exact data for TS to work.
interface Data {
  name: string;
  projections: {
    series_stats: {
      year: string;
      cumulative_time_net_benefits: number;
      total_hours_saved: number;
      total_hours_spent_risk_adjusted: number;
      cumulative_net_benefits: number;
      total_benefits: number;
      total_costs: number;
    }[];
    monetary_stats: {
      net_preset_value: number;
    };
  };
}

const dataConversion = (data: Data): Data => {
  const yearConversion: Record<string, string> = {
    initial: 'Initial',
    year1: 'Year 1',
    year2: 'Year 2',
    year3: 'Year 3',
  };

  const seriesStats = data.projections.series_stats.map((item) => ({
    ...item,
    year: yearConversion[item.year],
    total_costs: item.total_costs * -1,
    total_hours_spent_risk_adjusted: item.total_hours_spent_risk_adjusted * -1,
  }));

  return {
    ...data,
    projections: { ...data.projections, series_stats: seriesStats },
  };
};

interface Props {
  tabsArray: {
    id: number;
    link: string;
    name: React.ReactNode;
  }[];
  plan: Data;
}

const getChartData = (data: Data): ApiReturnType => {
  return {
    items: data.projections.series_stats,
    meta: {
      legend: [],
      count: 0,
    },
  };
};

const constants = (isMoney: boolean) => ({
  cost: {
    key: isMoney ? 'total_costs' : 'total_hours_spent_risk_adjusted',
    color: '#8B8D8F',
  },
  benefit: {
    key: isMoney ? 'total_benefits' : 'total_hours_saved',
    color: isMoney ? 'var(--pf-t--global--color--status--success--default)' : '#0063CF',
  },
  net: {
    key: isMoney ? 'cumulative_net_benefits' : 'cumulative_time_net_benefits',
    color: '#EE7A00',
  },
});

const StatisticsTab: FunctionComponent<Props> = ({ tabsArray, plan }) => {
  const statsPlan = dataConversion(plan);

  const [isMoney, setIsMoney] = useState(true);

  const customTooltipFormatting: ChartLabelFormatFunction = ({ datum }) =>
    isMoney ? currencyFormatter(+datum.y) : hoursFormatter(+datum.y);

  const computeTotalSavings = (d: Data): number =>
    isMoney
      ? d.projections.series_stats[3].cumulative_net_benefits
      : d.projections.series_stats[3].cumulative_time_net_benefits;

  const chartSchema: ChartSchemaElement[] = [
    {
      id: 1000,
      kind: ChartKind.wrapper,
      type: ChartTopLevelType.chart,
      parent: null,
      props: {
        height: 600,
        domainPadding: {
          x: 100,
        },
        padding: {
          bottom: 60,
          left: 80,
        },
        themeColor: ChartThemeColor.gray,
      },
      tooltip: {
        cursor: true,
        stickToAxis: 'x',
        mouseFollow: true,
        legendTooltip: {
          legendData: [
            {
              childName: constants(isMoney).benefit.key,
              name: 'Savings',
              symbol: {
                fill: constants(isMoney).benefit.color,
              },
            },
            {
              childName: constants(isMoney).cost.key,
              name: 'Costs',
              symbol: {
                fill: constants(isMoney).cost.color,
              },
            },
            {
              childName: constants(isMoney).net.key,
              name: 'Cumulative savings',
              symbol: {
                fill: constants(isMoney).net.color,
              },
            },
          ],
          titleProperyForLegend: 'year',
        },
        labelFormat: 'customTooltipFormatting',
      },
      xAxis: {
        label: 'Time',
      },
      yAxis: {
        label: isMoney ? 'Money Saved' : 'Hours Saved',
        tickFormat: 'formatNumberAsK',
        style: {
          grid: { stroke: '#D2D2D2' },
          axisLabel: { padding: 60 },
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
      id: 1102,
      kind: ChartKind.simple,
      type: ChartType.bar,
      name: constants(isMoney).benefit.key,
      parent: 1001,
      props: {
        x: 'year',
        y: constants(isMoney).benefit.key,
        barRatio: 0.8,
        barWidth: 0,
        style: {
          data: {
            fill: constants(isMoney).benefit.color,
            width: 120,
          },
        },
      },
      tooltip: {
        labelName: '',
      },
    },
    {
      id: 1101,
      kind: ChartKind.simple,
      type: ChartType.bar,
      name: constants(isMoney).cost.key,
      parent: 1001,
      props: {
        x: 'year',
        y: constants(isMoney).cost.key,
        barRatio: 0.8,
        barWidth: 0,
        style: {
          data: {
            fill: constants(isMoney).cost.color,
            width: 120,
          },
        },
      },
      tooltip: {
        labelName: '',
      },
    },
    {
      id: 1002,
      kind: ChartKind.simple,
      type: ChartType.line,
      name: constants(isMoney).net.key,
      parent: 1000,
      props: {
        x: 'year',
        y: constants(isMoney).net.key,
        style: {
          data: {
            stroke: constants(isMoney).net.color,
            strokeWidth: 5,
          },
        },
      },
      tooltip: {
        labelName: '',
      },
    },
  ];

  const renderLeft = () => (
    <Card isPlain>
      <CardHeader
        actions={{
          actions: (
            <>
              <ToggleGroup aria-label='toggleButton'>
                <ToggleGroupItem
                  text='Money'
                  buttonId='money'
                  isSelected={isMoney}
                  onChange={() => setIsMoney(true)}
                />
                <ToggleGroupItem
                  text='Time'
                  buttonId='time'
                  isSelected={!isMoney}
                  onChange={() => setIsMoney(false)}
                />
              </ToggleGroup>
            </>
          ),
          hasNoOffset: false,
          className: undefined,
        }}
      >
        <CardTitle>{statsPlan.name}</CardTitle>
      </CardHeader>
      <CardBody>
        <Chart
          schema={chartSchema}
          data={getChartData(statsPlan)}
          specificFunctions={{
            labelFormat: {
              customTooltipFormatting,
            },
          }}
        />
      </CardBody>
    </Card>
  );

  const renderRight = () => (
    <>
      <TotalSavings value={computeTotalSavings(statsPlan)} isMoney={isMoney} />
      <Card isPlain>
        <CardBody>
          <List isPlain>
            <ListItem
              icon={<SquareFullIcon color={constants(isMoney).benefit.color} />}
            >
              Savings from automating this plan
            </ListItem>
            <ListItem
              icon={<SquareFullIcon color={constants(isMoney).cost.color} />}
            >
              Costs from creating, maintaining and running the automation
            </ListItem>
            <ListItem
              icon={<SquareFullIcon color={constants(isMoney).net.color} />}
            >
              Cumulative savings over time
            </ListItem>
          </List>
        </CardBody>
      </Card>
      <FormulaDescription />
    </>
  );

  return (
    <Card>
      <RoutedTabs tabsArray={tabsArray} />
      <Grid>
        <GridItem span={9}>{renderLeft()}</GridItem>
        <GridItem span={3}>{renderRight()}</GridItem>
      </Grid>
    </Card>
  );
};

export default StatisticsTab;
