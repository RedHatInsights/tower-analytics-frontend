import {
  ChartKind,
  ChartLegendOrientation,
  ChartLegendPosition,
  ChartTopLevelType,
  ChartType,
  ChartThemeColor,
} from 'react-json-chart-builder';
import {
  eventExplorerEndpoint,
  readEventExplorer,
  readEventExplorerOptions,
} from '../../../../Api';
import { CATEGORIES } from '../constants';
import { AttributesType, ReportPageParams, SchemaFnc } from '../types';

const slug = 'module_usage_by_task';

const name = 'Module usage by task';

const description =
  'The number of job template and task runs for a specified set of Ansible modules, grouped by task.\n\nYou can use this report to find which tasks are using particular modules, helping you to check things like adoption of purpose-built modules for particular tasks.';

const categories = [CATEGORIES.executive];

const defaultTableHeaders: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Task name' },
];

const tableAttributes = [
  'host_task_count',
  'host_task_changed_count',
  'host_task_ok_count',
  'host_task_failed_count',
  'host_task_unreachable_count',
];

const expandedAttributes = [] as string[];

const defaultParams = {
  limit: 6,
  offset: 0,
  attributes: [...tableAttributes, ...expandedAttributes],
  group_by: 'task',
  group_by_time: true,
  granularity: 'monthly',
  quick_date_range: 'last_6_months',
  sort_options: 'host_task_count',
  sort_order: 'desc',
  cluster_id: [],
  inventory_id: [],
  job_type: [],
  org_id: [],
  status: [],
  task_action_id: [],
  template_id: [],
};

const availableChartTypes = [ChartType.line, ChartType.bar];

const schemaFnc: SchemaFnc = (
  label,
  y,
  xTickFormat,
  chartType = ChartType.line
) => [
  {
    id: 1,
    kind: ChartKind.wrapper,
    type: ChartTopLevelType.chart,
    parent: null,
    props: {
      height: 400,
      padding: {
        top: 40,
        bottom: 85,
        right: 90,
        left: 90,
      },
      domainPadding: {
        y: 25,
        x: chartType == ChartType.bar ? 85 : 0,
      },
      themeColor: ChartThemeColor.multiOrdered,
    },
    xAxis: {
      label: 'Date',
      tickFormat: xTickFormat,
      style: {
        axisLabel: {
          padding: 50,
        },
      },
    },
    yAxis: {
      tickFormat: 'formatNumberAsK',
      showGrid: true,
      label,
      style: {
        axisLabel: {
          padding: 60,
        },
      },
    },
    api: {
      url: '',
      params: {},
    },
    legend: {
      interactive: true,
      orientation: ChartLegendOrientation.vertical,
      position: ChartLegendPosition.right,
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
    template: {
      id: 0,
      kind: ChartKind.simple,
      type: chartType,
      parent: 0,
      props: {
        x: 'created_date',
        y,
      },
      tooltip: {
        labelName: '',
      },
    },
  },
];

const reportParams: ReportPageParams = {
  slug,
  name,
  description,
  categories,
  reportParams: {
    slug,
    defaultParams,
    defaultTableHeaders,
    tableAttributes,
    expandedAttributes,
    availableChartTypes,
    dataEndpointUrl: eventExplorerEndpoint,
    readData: readEventExplorer,
    readOptions: readEventExplorerOptions,
    schemaFnc,
  },
};

export default reportParams;
