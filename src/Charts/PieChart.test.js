/* eslint-disable */ 
import { mount, shallow } from 'enzyme';
import PieChart from './PieChart.js';

// for simulatting hover events
const mouseover = new MouseEvent('mouseover', {
    view: window,
    bubbles: true,
    cancelable: true
});
// for simulating un-hover events
const mouseout = new MouseEvent('mouseout', {
    view: window,
    bubbles: true,
    cancelable: true
});

// mock api data ...
const dataWithSuccess = [
    { name: 'maxcorp0', count: 5000, success_rate: 0.1 },
    { name: 'maxcorp1', count: 5000, success_rate: 1.0 },
    { name: 'maxcorp2', count: 5000, success_rate: 2.0 },
    { name: 'maxcorp3', count: 5000, success_rate: 3.0 },
    { name: 'maxcorp4', count: 5000, success_rate: 4.0 }
];
const dataWithoutSuccess = [
    { name: 'maxcorp0', count: 5000 },
    { name: 'maxcorp1', count: 5000 },
    { name: 'maxcorp2', count: 5000 },
    { name: 'maxcorp3', count: 5000 },
    { name: 'maxcorp4', count: 5000 }
];

describe('Charts/PieChart', () => {
    it('PieChart loads', () => {
        expect(PieChart).toBeTruthy();
    });
    it('should render successfully', () => {
        shallow(<PieChart />);
    });
});

describe('Charts/PieChart/Tooltip', () => {

    // the div id that d3 will manipulate ...
    const thisid1 = 'd3-donut-1-chart-root';
    const thisid2 = 'd3-donut-2-chart-root';

    let wrapper1;
    let wrapper2;
    let container1;
    let container2;

    beforeAll(() => {
        // parent div to manipulate
        container1 = document.createElement('div');
        container1.setAttribute('id', thisid1);
        document.body.appendChild(container1);

        container2 = document.createElement('div');
        container2.setAttribute('id', thisid2);
        document.body.appendChild(container2);

        // props needed by the underlying rendering ...
        const baseprops = {
            data: null,
            id: thisid1,
            margin: {
                left: 0,
                right: 0,
                bottom: 0,
                top: 0
            },
            getWidth: () => 700,
            getHeight: () => 450
        };

        // each piechart has a different data shape ...
        let props1 = { ...baseprops };
        props1.id = thisid1;
        props1.data = dataWithSuccess;
        let props2 = { ...baseprops };
        props2.id = thisid2;
        props2.data = dataWithoutSuccess;

        // mount+init the piecharts ...
        wrapper1 = mount(<PieChart { ...props1 } />);
        wrapper2 = mount(<PieChart { ...props2 } />);

    });

    afterAll(() => {
        wrapper1.unmount();
        wrapper2.unmount();
        //let container1 = document.getElementById(thisid1);
        document.body.remove(container1);
        //let container2 = document.getElementById(thisid2);
        document.body.remove(container2);
    });

    it('should render data with success_rate successfully', () => {

        // d3 creates "paths" for each slice of the pie ...
        const paths = container1.getElementsByTagName('path');

        // should have a path for each row of data ...
        expect(paths.length).toBe(dataWithSuccess.length);

        for (let i = 0; i < paths.length; i++) {
            // maxcorp3
            // 20%
            // (3% successful)
            paths[i].dispatchEvent(mouseover);
            let rectangle = document.getElementById('svg-chart-Tooltip.base-' + thisid1);

            // ensure the relevant lines are displayed ...
            let thisName = rectangle.children[2].textContent.trim();
            let thisPercent = rectangle.children[3].textContent.trim();
            let thisRate = rectangle.children[4].textContent.trim();
            let expectedRate = '(' + dataWithSuccess[i].success_rate + '% successful)';

            expect(thisName).toBe(dataWithSuccess[i].name);
            expect(thisPercent).toBe('20%');
            expect(thisRate).toBe(expectedRate);

            paths[i].dispatchEvent(mouseout);

        };

    });

    it('should render data without success_rate successfully', () => {

        // d3 creates "paths" for each slice of the pie ...
        const paths = container2.getElementsByTagName('path');

        // should have a path for each row of data ...
        expect(paths.length).toBe(dataWithoutSuccess.length);

        for (let i = 0; i < paths.length; i++) {
            // maxcorp3
            // 20%
            paths[i].dispatchEvent(mouseover);
            let rectangle = document.getElementById('svg-chart-Tooltip.base-' + thisid2);

            expect(rectangle.children.length).toBe(4);
            expect(rectangle.children[2].textContent.trim()).toBe(dataWithoutSuccess[i].name);
            expect(rectangle.children[3].textContent.trim()).toBe('20%');

            paths[i].dispatchEvent(mouseout);
        };

    });
});
