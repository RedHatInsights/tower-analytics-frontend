import ChartWrapper from './ChartWrapper';
import chart from './GroupedBarChart';
import tooltip from './Tooltips/GroupedBarChartTooltip';

const data = [
    {
        xAxis: new Date(1000),
        group: [{
            id: 1,
            name: 'x',
            value: 1,
            date: new Date(1000)
        },
        {
            id: 2,
            name: 'y',
            value: 2,
            date: new Date(1000)
        }
        ]
    },
    {
        xAxis: new Date(2000),
        group: [{
            id: 3,
            name: 'x1',
            value: 3,
            date: new Date(2000)
        },
        {
            id: 4,
            name: 'y2',
            value: 4,
            date: new Date(2000)
        }
        ]
    }
];

beforeEach(() => {
    // Create the div to hold the chart
    let d3Container = document.createElement('div');
    d3Container.setAttribute('id', 'd3-chart-wrapper');
    document.body.appendChild(d3Container);

});

describe('Charts/LineChart', () => {
    it('should render successfully', () => {
        mount(<ChartWrapper
            data={ data }
            lineNames={ [ 'value' ] }
            colorFunc={ () => 'red' }
            chart={ chart }
            tooltip={ tooltip }
        />);
    });
});
