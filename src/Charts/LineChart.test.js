import ChartWrapper from './ChartWrapper';
import lineChart from './LineChart';
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

describe('Charts/LineChart', () => {
    it('should render successfully', () => {
        mount(<ChartWrapper
            data={ data }
            lineNames={ [ 'successful', 'failed' ] }
            colors={ [ 'green', 'red' ] }
            chart={ lineChart }
            tooltip={ tooltip({ lineNames: [ 'successful', 'failed' ], colors: [ 'green', 'red' ]}) }
        />);
    });
});
