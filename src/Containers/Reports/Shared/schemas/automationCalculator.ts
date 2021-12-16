import { TagName } from '../constants';
import { ReportPageParams } from '../types';
import { roi } from '../../../../Utilities/constants';
import { Endpoint } from '../../../../Api';
import {
  ChartKind,
  ChartTopLevelType,
  ChartType,
} from 'react-json-chart-builder';
import { LayoutComponentName } from '../../Layouts';

const slug = 'automation_calculator';

const name = 'Automation calculator';

const description =
  'The calculated savings of the job templates running across the company in comparison to the cost of completing these jobs manually.\n\nYou can use this report to get an idea of the ROI from your automation, as well as identify which templates are contributing to this savings the most';

const tags = [TagName.executive, TagName.jobTemplate, TagName.savings];

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
      y: 'delta',
    },
    tooltip: {
      standalone: true,
      labelName: 'Saving',
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
    tableHeaders: [],
    availableChartTypes: [],
    dataEndpoint: Endpoint.ROI,
    optionsEndpoint: Endpoint.ROIOptions,
    schema,
  },
  layoutComponent: LayoutComponentName.automationCalculator,
};

export default reportParams;
