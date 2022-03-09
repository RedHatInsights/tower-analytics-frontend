/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChartKind,
  ChartTopLevelType,
  ChartType,
  ChartThemeColor,
} from 'react-json-chart-builder';
import { ExpandedTableRowName } from '../../Layouts/Standard/Components';
import { Endpoint } from '../../../../Api';
import { LayoutComponentName, ReportSchema } from '../../Layouts/types';
import { TagName } from '../constants';
import { AttributesType } from '../types';

const slug = 'host_anamolies';

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
  { key: 'name', value: 'Template' },
  { key: 'host_count', value: 'Host count' },
];

const defaultParams = {
  limit: 6,
  offset: 0,
  attributes: ['slow_hosts_count'],
  cluster_id: [],
  org_id: [],
  inventory_id: [],
  template_id: [],
  status: [],
  host_status: [],
  sort_options: 'average_duration_per_task',
  sort_order: 'desc',
  quick_date_range: 'slow_hosts_last_1_week',
  slow_host_view: 'templates_with_slow_hosts',
};

const availableChartTypes = [ChartType.bar, ChartType.line];

const schema = [
  {
    id: 1,
    kind: ChartKind.wrapper,
    type: ChartTopLevelType.chart,
    parent: null,
    props: {
      height: 400,
      domainPadding: {
        x: 100,
      },
      padding: {
        top: 10,
        bottom: 150,
        right: 90,
        left: 90,
      },
      themeColor: ChartThemeColor.multiOrdered,
    },
    xAxis: {
      label: 'Templates',
      style: {
        axisLabel: {
          padding: 130,
          title: 'test',
        },
      },
      labelProps: {
        angle: -45,
        textAnchor: 'end',
        dx: 0,
        dy: 0,
      },
      fixLabelOverlap: false,
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
    expandedTableRowName: ExpandedTableRowName.hostAnamolies,
    availableChartTypes,
    dataEndpoint: Endpoint.probeTemplates,
    optionsEndpoint: Endpoint.probeTemplatesOptions,
    schema,
  },
};

export default reportParams;
