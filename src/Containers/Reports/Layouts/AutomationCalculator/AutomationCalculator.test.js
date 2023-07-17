import { act } from 'react-dom/test-utils';
import { history, mountPage } from '../../../../__tests__/helpers';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderPage } from '../../../../__tests__/helpers.reactTestingLib';
import fetchMock from 'fetch-mock-jest';
import AutomationCalculator from './AutomationCalculator';
import TotalSavings from './TotalSavings';
import { EmptyStateBody } from '@patternfly/react-core';
import { Endpoint } from '../../../../Api';
import { roi } from '../../../../Utilities/constants';
import {
  ChartTopLevelType,
  ChartKind,
  ChartType,
} from 'react-json-chart-builder';

fetchMock.config.overwriteRoutes = true;

const jobExplorerUrl = 'path:/api/tower-analytics/v1/roi_templates/';
const dummyRoiData = {
  response_type: '',
  cost: { hourly_automation_cost: 20, hourly_manual_labor_cost: 50 },
  isMoney: true,
  meta: {
    count: 3,
    legend: [
      {
        id: 1,
        name: 'a',
        successful_elapsed_total: 3600,
        host_cluster_count: 10,
        total_org_count: 2,
        successful_hosts_total: 10,
        total_cluster_count: 20,
        template_weigh_in: true,
        manual_effort_minutes: 60,
        template_success_rate: 55.7018,
        successful_hosts_savings: 40000,
        successful_hosts_saved_hours: 900,
        failed_hosts_costs: 5,
        monetary_gain: 40000,
      },
      {
        id: 2,
        name: 'b',
        successful_elapsed_total: 3600,
        host_cluster_count: 10,
        total_org_count: 2,
        successful_hosts_total: 10,
        total_cluster_count: 20,
        template_weigh_in: true,
        manual_effort_minutes: 60,
        template_success_rate: 55.7018,
        successful_hosts_savings: 40000,
        successful_hosts_saved_hours: 900,
        failed_hosts_costs: 5,
        monetary_gain: 40000,
      },
      {
        id: 3,
        name: 'c',
        successful_elapsed_total: 0,
        host_cluster_count: 10,
        total_org_count: 2,
        successful_hosts_total: 10,
        total_cluster_count: 20,
        template_weigh_in: true,
        manual_effort_minutes: 60,
        template_success_rate: 55.7018,
        successful_hosts_savings: 40000,
        successful_hosts_saved_hours: 900,
        failed_hosts_costs: 5,
        monetary_gain: 40000,
      },
    ],
  },
};
const defaultTotalSaving = '1,460.00';
const jobExplorerOptionsUrl =
  'path:/api/tower-analytics/v1/roi_templates_options/';
const jobExplorerOptions = {
  quick_date_range: [
    { key: 'last_30_days', value: 'Last 30 days' },
    { key: 'last_2_weeks', value: 'Last 2 weeks' },
    { key: 'last_week', value: 'Last week' },
    { key: 'last_72_hours', value: 'Last 72 hours' },
    { key: 'last_24_hours', value: 'Last 24 hours' },
    { key: 'custom', value: 'Custom' },
  ],
  sort_options: [
    {
      key: 'successful_hosts_savings',
      value: 'Savings from successful hosts',
    },
  ],
  meta: {
    rbac: {
      perms: {
        all: true,
      },
    },
  },
};

const inputManCost = (wrapper) => wrapper.find('input').at(0);
const inputAutCost = (wrapper) => wrapper.find('input').at(1);
const inputsRuntime = (wrapper) => wrapper.find('input').slice(2);

const pageParams = {
  slug: 'automation_calculator',
  description: 'Foo Description',
  defaultParams: roi.defaultParams,
  defaultTableHeaders: [],
  tableAttributes: [],
  expandedAttributes: [],
  availableChartTypes: [],
  dataEndpoint: Endpoint.ROI,
  optionsEndpoint: Endpoint.ROIOptions,
  schema: [
    {
      id: 1,
      kind: ChartKind.wrapper,
      type: ChartTopLevelType.chart,
      parent: null,
      props: {
        height: 400,
        padding: {
          top: 40,
          bottom: 150,
          right: 0,
          left: 90,
        },
        domainPadding: {
          y: 25,
          x: 85,
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
  ],
};

describe('Containers/Reports/AutomationCalculator', () => {
  let wrapper;

  beforeEach(() => {
    fetchMock.post({ url: jobExplorerUrl }, { ...dummyRoiData });
    fetchMock.post({ url: jobExplorerOptionsUrl }, { ...jobExplorerOptions });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it('should render without errors', async () => {
    await act(async () => {
      wrapper = mountPage(AutomationCalculator, pageParams);
    });
    wrapper.update();

    expect(wrapper).toBeTruthy();
    expect(wrapper.find('input')).toHaveLength(9);
  });

  it('should render api error', async () => {
    fetchMock.post({
      url: jobExplorerUrl,
      response: { throws: { error: 'General Error' }, status: 400 },
    });

    await act(async () => {
      wrapper = mountPage(AutomationCalculator, pageParams);
    });
    wrapper.update();

    expect(wrapper.text()).toEqual(expect.stringContaining('Error'));
    // No data displayed
    expect(wrapper.find('input')).toHaveLength(0);
  });

  it('should render no data', async () => {
    fetchMock.post(
      { url: jobExplorerUrl },
      {
        items: [],
        meta: { count: 0 },
        cost: { hourly_automation_cost: 50, hourly_manual_labor_cost: 25 },
      }
    );

    await act(async () => {
      wrapper = mountPage(AutomationCalculator, pageParams);
    });
    wrapper.update();

    expect(wrapper.find(EmptyStateBody).text()).toEqual(
      expect.stringContaining(
        'No results match the filter criteria. Clear all filters and try again.'
      )
    );
  });

  it('toggle should render and time/money should be selected when clicked', async () => {
    await act(async () => {
      renderPage(AutomationCalculator, undefined, pageParams);
    });

    //expect toggle to render
    const toggleButtonMoney = screen.getByRole('button', {
      name: 'Money',
    });
    const toggleButtonTime = screen.getByRole('button', {
      name: 'Time',
    });
    expect(toggleButtonMoney).toBeTruthy();
    expect(toggleButtonTime).toBeTruthy();

    //expect toggle buttons to focus when selected
    expect(toggleButtonMoney.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(toggleButtonTime);
    await waitFor(() => {
      expect(toggleButtonMoney.getAttribute('aria-pressed')).toBe('false');
      expect(toggleButtonTime.getAttribute('aria-pressed')).toBe('true');
      expect(screen.getAllByText('900 hours')).toHaveLength(3);
    });

    fireEvent.click(toggleButtonMoney);
    await waitFor(() => {
      expect(toggleButtonMoney.getAttribute('aria-pressed')).toBe('true');
      expect(toggleButtonTime.getAttribute('aria-pressed')).toBe('false');
      expect(screen.getAllByText('$40,000')).toHaveLength(3);
      expect(screen.getAllByText('900 hours')).toHaveLength(3);
    });
  });

  xit('should call redirect to job expoler', async () => {
    await act(async () => {
      wrapper = mountPage(AutomationCalculator, pageParams);
    });
    wrapper.update();

    // Cannot find the button, disabling for now
    // await act(async () => {
    //   wrapper.find('Button').at(1).simulate('click');
    // });
    expect(history.location.pathname).toBe('/job-explorer');
  });

  // Total savings is no longer calculated locally -> skipping
  xit('should compute total savings correctly', async () => {
    await act(async () => {
      wrapper = mountPage(AutomationCalculator, pageParams);
    });
    wrapper.update();

    expect(wrapper.find(TotalSavings).text()).toEqual(
      expect.stringContaining(defaultTotalSaving)
    );
  });

  xit('should recompute total savings correctly after changed manual costs', async () => {
    await act(async () => {
      wrapper = mountPage(AutomationCalculator, pageParams);
    });
    wrapper.update();

    const c = inputManCost(wrapper);
    act(() => {
      c.instance().value = '100'; // more expensive
      c.simulate('change', { target: { value: '' } });
    });
    wrapper.update();

    expect(wrapper.find(TotalSavings).text()).toEqual(
      expect.stringContaining('2,960.00')
    );
  });

  xit('should recompute total savings correctly after changed automated costs', async () => {
    await act(async () => {
      wrapper = mountPage(AutomationCalculator, pageParams);
    });
    wrapper.update();

    const c = inputAutCost(wrapper);
    act(() => {
      c.instance().value = '10'; // cheaper
      c.simulate('change', { target: { value: '' } });
    });
    wrapper.update();

    expect(wrapper.find(TotalSavings).text()).toEqual(
      expect.stringContaining('1,480.00')
    );
  });

  xit('should recompute total savings correctly after changed average runtime', async () => {
    await act(async () => {
      wrapper = mountPage(AutomationCalculator, pageParams);
    });
    wrapper.update();

    const inputs = inputsRuntime(wrapper);
    act(() => {
      inputs.at(0).instance().value = '30';
      inputs.at(0).simulate('change', { target: { value: '' } });
    });
    wrapper.update();

    expect(wrapper.find(TotalSavings).text()).toEqual(
      expect.stringContaining('1,210.00')
    );
  });
});
