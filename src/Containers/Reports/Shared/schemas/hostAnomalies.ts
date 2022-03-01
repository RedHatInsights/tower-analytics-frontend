/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChartKind,
  ChartLegendOrientation,
  ChartLegendPosition,
  ChartTopLevelType,
  ChartType,
  ChartThemeColor,
} from 'react-json-chart-builder';
import { ExpandedTableRowName } from '../../Layouts/Standard/Components';
import { Endpoint, Params } from '../../../../Api';
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
  { key: 'template_id', value: 'ID' },
  { key: 'template_name', value: 'Template' },
  { key: 'host_count', value: 'Host count' },
];

const expandedAttributes = ['average_duration_per_task', 'host_runs'];

const defaultParams = {
  limit: 25,
  offset: 0,
  attributes: ['slow_hosts_count', ...expandedAttributes],
  cluster_id: [],
  org_id: [],
  inventory_id: [],
  template_id: [],
  status: [],
  host_status: [],
  sort_options: 'average_duration_per_task',
  quick_date_range: 'slow_hosts_last_1_week',
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
      height: 500,
      padding: {
        top: 10,
        bottom: 85,
        right: 90,
        left: 90,
      },
      themeColor: ChartThemeColor.multiOrdered,
    },
    xAxis: {
      label: 'Template',
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
    type: ChartType.bar,
    parent: 0,
    props: {
      x: 'name',
      y: 'VAR_y',
    },
    tooltip: {
      standalone: true,
      labelName: 'VAR_label',
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
    expandedTableRowName: ExpandedTableRowName.templatesExplorer,
    availableChartTypes,
    dataEndpoint: Endpoint.probeTemplates,
    optionsEndpoint: Endpoint.probeTemplatesOptions,
    schema,
  },
};

export default reportParams;
