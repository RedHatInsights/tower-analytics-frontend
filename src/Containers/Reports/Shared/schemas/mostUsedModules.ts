import {
  ChartKind,
  ChartLegendOrientation,
  ChartLegendPosition,
  ChartTopLevelType,
  ChartType,
  ChartThemeColor,
} from 'react-json-chart-builder';
import { Endpoint } from '../../../../Api';
import { LayoutComponentName } from '../../Layouts';
import { CATEGORIES } from '../constants';
import { AttributesType, ReportPageParams } from '../types';

const slug = 'most_used_modules';

const name = 'Most used modules';

const description =
  'The number of job template and task runs, grouped by Ansible module usage.\n\nYou can use this report to find which modules are being used the most across your automation, helping you to check things like organization-wide adoption of purpose-built modules over potentially less performant, catch-all solutions.';

const categories = [CATEGORIES.executive];

const defaultTableHeaders: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Module name' },
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
  group_by: 'module',
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
        right: 90,
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
    dataEndpoint: Endpoint.eventExplorer,
    optionsEndpoint: Endpoint.eventExplorerOptions,
    schema,
  },
  layoutComponent: LayoutComponentName.standard,
};

export default reportParams;
