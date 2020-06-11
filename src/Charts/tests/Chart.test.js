/*eslint camelcase: ["error", {properties: "never", ignoreDestructuring: true}]*/
import { act } from 'react-dom/test-utils';
import { BarChart } from '../BarChart';
import { GroupedBarChart } from '../GroupedBarChart';
import { LineChart } from '../LineChart';
import { PieChart } from '../PieChart';

const getWidth = () => 700;
const getHeight = () => 450;
const margins = { top: 20, right: 20, bottom: 50, left: 70 };

const groupedBarChartData = [{
    date: '2020-04-20',
    orgs: [{ id: 1, org_name: 'Default', value: 108, successful_count: 59, failed_count: 49, success_rate: 55 }]
}];

let eventMap;
let realAddEventListener;
let realRemoveEventListener;

beforeEach(() => {
    realAddEventListener = window.addEventListener;
    realRemoveEventListener = window.removeEventListener;
    eventMap = {};

    window.addEventListener = jest.fn((eventName, callback) => {
        eventMap[eventName] = callback;
    });

    window.removeEventListener = jest.fn(eventName => {
        delete eventMap[eventName];
    });
});

afterEach(() => {
    window.addEventListener = realAddEventListener;
    window.removeEventListener = realRemoveEventListener;
});

// FIXME: With jsdom cannot test the SVG output itself.
// therefore these tests are only testing if the mount and umnount correctly.

it('should render BarChart correctly', () => {
    const wrapper = render(
        <BarChart
            margin={ margins }
            id="d3-bar-chart-root"
            data={ [] }
            value={ 31 }
            getWidth={ getWidth }
            getHeight={ getHeight }
        />
    );

    expect(wrapper).toMatchSnapshot();
});

it('should add/remove listener to BarChart', () => {
    const wrapper = mount(
        <BarChart
            margin={ margins }
            id="d3-bar-chart-root"
            data={ [] }
            value={ 31 }
            getWidth={ getWidth }
            getHeight={ getHeight }
        />
    );

    act(() => {
        wrapper.update();
    });
    expect(eventMap.hasOwnProperty('resize')).toBeTruthy();

    wrapper.unmount();
    expect(eventMap.hasOwnProperty('resize')).toBeFalsy();
});

it('should render GroupedBarChart correctly', () => {
    const wrapper = render(
        <GroupedBarChart
            margin={ margins }
            id="d3-grouped-bar-chart-root"
            data={ groupedBarChartData }
            timeFrame={ 31 }
            getWidth={ getWidth }
            getHeight={ getHeight }
        />
    );

    expect(wrapper).toMatchSnapshot();
});

it('should add/remove listener to GroupedBarChart', () => {
    const wrapper = mount(
        <GroupedBarChart
            margin={ margins }
            id="d3-grouped-bar-chart-root"
            data={ groupedBarChartData }
            timeFrame={ 31 }
            getWidth={ getWidth }
            getHeight={ getHeight }
        />
    );

    act(() => {
        wrapper.update();
    });
    expect(eventMap.hasOwnProperty('resize')).toBeTruthy();

    wrapper.unmount();
    expect(eventMap.hasOwnProperty('resize')).toBeFalsy();
});

it('should render LineChart correctly', () => {
    const wrapper = render(
        <LineChart
            margin={ margins }
            id="d3-line-chart-root"
            data={ [] }
            value={ 31 }
            getWidth={ getWidth }
            getHeight={ getHeight }
        />
    );

    expect(wrapper).toMatchSnapshot();
});

it('should add/remove listener to LineChart', () => {
    const wrapper = mount(
        <LineChart
            margin={ margins }
            id="d3-line-chart-root"
            data={ [] }
            value={ 31 }
            getWidth={ getWidth }
            getHeight={ getHeight }
        />
    );

    act(() => {
        wrapper.update();
    });
    expect(eventMap.hasOwnProperty('resize')).toBeTruthy();

    wrapper.unmount();
    expect(eventMap.hasOwnProperty('resize')).toBeFalsy();
});

it('should render PieChart correctly', () => {
    const wrapper = render(
        <PieChart
            margin={ margins }
            id="d3-pie-chart-root"
            data={ [] }
            value={ 31 }
            getWidth={ getWidth }
            getHeight={ getHeight }
        />
    );

    expect(wrapper).toMatchSnapshot();
});

it('should add/remove listener to PieChart', () => {
    const wrapper = mount(
        <PieChart
            margin={ margins }
            id="d3-pie-chart-root"
            data={ [] }
            value={ 31 }
            getWidth={ getWidth }
            getHeight={ getHeight }
        />
    );

    act(() => {
        wrapper.update();
    });
    expect(eventMap.hasOwnProperty('resize')).toBeTruthy();

    wrapper.unmount();
    expect(eventMap.hasOwnProperty('resize')).toBeFalsy();
});
