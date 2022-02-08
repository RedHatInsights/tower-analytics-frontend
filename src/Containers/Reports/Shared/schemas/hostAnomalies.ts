/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChartKind,
  ChartLegendOrientation,
  ChartLegendPosition,
  ChartTopLevelType,
  ChartType,
  ChartThemeColor,
} from 'react-json-chart-builder';
import { Endpoint } from '../../../../Api';
import { LayoutComponentName, ReportSchema } from '../../Layouts/types';
import { TagName } from '../constants';
import { AttributesType } from '../types';

const slug = 'host_anomalies';

const name = 'Host Anamolies';

const description =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id odio eleifend, suscipit metus ullamcorper, imperdiet mi.';

const tags = [
  TagName.executive,
  TagName.jobTemplate,
  TagName.hosts,
  TagName.performanceAnomalyDetection,
];

const tableHeaders: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Template name' },
  { key: 'host_count', value: 'Host count' },
];

const defaultParams = {
  limit: 6,
  offset: 0,
  attributes: ['host_count'],
  cluster_id: [],
  org_id: [],
  inventory_id: [],
  template_id: [],
  status: [],
  host_status: [],
  sort_options: 'average_duration_per_task',
  quick_date_range: 'slow_hosts_last_month',
  slow_host_view: 'templates_with_slow_hosts',
};

const availableChartTypes = [ChartType.bar];

const schema = [
  {
    id: 1,
    kind: ChartKind.wrapper,
    type: ChartTopLevelType.chart,
    parent: null,
    props: {
      height: 400,
      padding: {
        top: 10,
        bottom: 85,
        right: 178,
        left: 90,
      },
      themeColor: ChartThemeColor.multiOrdered,
    },
    xAxis: {
      label: 'Date',
      tickFormat: 'VAR_xTickFormat',
      style: {
        axisLabel: {
          padding: 50,
        },
      },
    },
    yAxis: {
      tickFormat: 'formatNumberAsK',
      showGrid: true,
      label: 'VAR_label',
      style: {
        axisLabel: {
          padding: 60,
        },
      },
    },
    legend: {
      interactive: true,
      orientation: ChartLegendOrientation.vertical,
      position: ChartLegendPosition.right,
      turncateAt: 18,
    },
    tooltip: {
      mouseFollow: true,
      stickToAxis: 'x',
      cursor: true,
      legendTooltip: {
        titleProperyForLegend: 'created_date',
      },
    },
  },
  {
    id: 2,
    kind: ChartKind.group,
    parent: 1,
    template: 3,
  },
  {
    id: 3,
    kind: ChartKind.simple,
    type: 'VAR_chartType',
    parent: 0,
    props: {
      x: 'created_date',
      y: 'VAR_y',
    },
    tooltip: {
      labelName: '',
    },
  },
];

const reportParams: ReportSchema = {
  layoutComponent: LayoutComponentName.Standard,
  layoutProps: {
    slug,
    name,
    description,
    tags,
    defaultParams,
    tableHeaders,
    availableChartTypes,
    dataEndpoint: Endpoint.probeTemplates,
    optionsEndpoint: Endpoint.probeTemplatesOptions,
    schema,
  },
};

export default reportParams;
