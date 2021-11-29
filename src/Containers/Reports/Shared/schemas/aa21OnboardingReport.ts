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
import { TagName } from '../constants';
import { AttributesType, ReportPageParams } from '../types';

const slug = 'aa_2_1_onboarding';

const name = 'AA 2.1 Onboarding Report';

const description = `This report shows templates that utilize certain module types that have been identified to pose potential problems when migrating to AAP 2.1.

You can use this report to determine the last job run of these templates, as well as a link into the Controller instance where the template is defined.`;

const tags = [
  TagName.operations,
  TagName.onboarding,
  TagName.modules,
  TagName.jobTemplate,
  TagName.timeSeries,
];

const defaultTableHeaders: AttributesType = [
  { key: 'id', value: 'ID' },
  { key: 'name', value: 'Template name' },
];

const tableAttributes = ['host_task_count'];

const expandedAttributes = [] as string[];

const defaultParams = {
  limit: 6,
  offset: 0,
  attributes: [...tableAttributes, ...expandedAttributes],
  group_by: 'template',
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
  task_id: [],
  task_action_name: [
    'junit',
    'tree',
    'local',
    'csvfile',
    'env',
    'file',
    'fileglob',
    'first_found',
    'ini',
    'password',
    'template',
    'unvault',
    'assemble',
    'copy',
    'fetch',
    'include_vars',
    'rpm_key',
    'script',
    'apt',
    'apt_key',
    'apt_repository',
    'blockinfile',
    'cron',
    'debconf',
    'dnf',
    'dpkg_selections',
    'find',
    'gather_facts',
    'get_url',
    'getent',
    'git',
    'hostname',
    'iptables',
    'known_hosts',
    'lineinfile',
    'package',
    'pip',
    'replace',
    'service',
    'service_facts',
    'setup',
    'slurp',
    'stat',
    'subversion',
    'systemd',
    'sysvinit',
    'tempfile',
    'unarchive',
    'user',
    'yum',
    'yum_repository',
  ],
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
  tags,
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
