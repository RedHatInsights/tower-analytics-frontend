import { CATEGORIES } from '../constants';
import { ReportPageParams } from '../types';
import { roi } from '../../../../Utilities/constants';
import { Endpoint } from '../../../../Api';
import {
  ChartKind,
  ChartTopLevelType,
  ChartType,
} from 'react-json-chart-builder';
import { ReportLayout } from '../../Layouts';

const slug = 'automation_calculator';

const name = 'Automation calculator';

const description = 'Some desc.';

const categories = [CATEGORIES.executive];

const defaultParams = roi.defaultParams;

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
        bottom: 150,
        right: 0,
        left: 90,
      },
    },
    xAxis: {
      label: 'Templates',
      style: {
        axisLabel: {
          padding: 130,
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
      label: 'Savings per template',
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
  },
  {
    id: 2,
    kind: ChartKind.group,
    parent: 1,
    template: {
      id: 0,
      kind: ChartKind.simple,
      type: ChartType.bar,
      parent: 0,
      props: {
        x: 'name',
        y: 'delta',
      },
      tooltip: {
        standalone: true,
        labelName: 'Saving',
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
    defaultTableHeaders: [],
    tableAttributes: [],
    expandedAttributes: [],
    availableChartTypes: [],
    dataEndpoint: Endpoint.ROI,
    optionEndpoint: Endpoint.ROIOptions,
    schema,
  },
  componentName: ReportLayout.AUTOMATION_CALCULATOR,
};

export default reportParams;
