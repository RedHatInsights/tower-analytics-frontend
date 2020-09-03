import ChartWrapper from './ChartWrapper';
import chart from './PieChart';
import tooltip from './Tooltips/PieChartTooltip';

const data = [
    {
        xAxis: new Date(),
        count: 25
    },
    {
        xAxis: new Date(1000),
        count: 20
    }
];

beforeEach(() => {
    // Create the div to hold the chart
    let d3Container = document.createElement('div');
    d3Container.setAttribute('id', 'd3-chart-wrapper');
    document.body.appendChild(d3Container);

});

describe('Charts/BarChart', () => {
    it('should render successfully', () => {
        mount(<ChartWrapper
            data={ data }
            lineNames={ [ 'count' ] }
            colorFunc={ () => 'green' }
            chart={ chart }
            tooltip={ tooltip }
        />);
    });
});
