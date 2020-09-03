import ChartWrapper from './ChartWrapper';
import barChart from './BarChart';
import tooltip from './Tooltips/FailedSuccessTotalTooltip';

const data = [
    {
        xAxis: new Date(),
        yAxis: 20,
        successful: 10,
        failed: 10
    },
    {
        xAxis: new Date(),
        yAxis: 20,
        successful: 10,
        failed: 10
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
            lineNames={ [ 'successful', 'failed' ] }
            colors={ [ 'green', 'red' ] }
            chart={ barChart }
            tooltip={ tooltip({ lineNames: [ 'successful', 'failed' ], colors: [ 'green', 'red' ]}) }
        />);
    });
});
