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

const slug = 'host_Anomalies';

const name = 'Host Anomalies';

const description =
  'The slowest hosts in a given job template are identified.A host is considered to be slow if it executes tasks much slower compared to the other hosts in the same template. The host slowness could be due to several factors such as low memory, CPU slowdown, network latency issues etc.\n\n You can use this report to single out templates and hosts that run slow and drive up the automation costs due to their slow performance.';

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

const availableChartTypes = [ChartType.bar];

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
      labelFormat: 'customTooltipFormatting',
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
    expandedTableRowName: ExpandedTableRowName.hostAnomalies,
    availableChartTypes,
    dataEndpoint: Endpoint.probeTemplates,
    optionsEndpoint: Endpoint.probeTemplatesOptions,
    schema,
  },
};

export default reportParams;
