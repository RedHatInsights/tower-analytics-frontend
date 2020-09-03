import { act } from 'react-dom/test-utils';
import ChartWrapper from './ChartWrapper';

let eventMap;
let realAddEventListener;
let realRemoveEventListener;

beforeEach(() => {
    // Create the div to hold the chart
    let d3Container = document.createElement('div');
    d3Container.setAttribute('id', 'd3-chart-wrapper');
    document.body.appendChild(d3Container);

    // Mock the event listeners
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

describe('Charts/ChartWrapper', () => {
    it('ChartWrapper loads', () => {
        expect(ChartWrapper).toBeTruthy();
    });

    it('should render successfully', () => {
        mount(<ChartWrapper
            chart={ () => {} }
        />);
    });

    it('should add and remove resize event listener', () => {
        const wrapper = mount(<ChartWrapper
            chart={ () => {} }
        />);

        act(() => {
            wrapper.update();
        });
        expect(eventMap.hasOwnProperty('resize')).toBeTruthy();

        wrapper.unmount();
        expect(eventMap.hasOwnProperty('resize')).toBeFalsy();
    });

});
