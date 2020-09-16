/* eslint-disable camelcase */
import ChartWrapper from './ChartWrapper';
import chart from './ScalableBarChart';
import tooltip from './Tooltips/ROIChartTooltip';

const data = [
    {
        xAxis: 'x',
        delta: 25,
        calculations: [
            {
                type: 'Manual',
                avg_run: 10,
                cost: 0
            },
            {
                type: 'Automated',
                avg_run: 0,
                cost: 0
            }
        ]
    },
    {
        xAxis: 'y',
        delta: 20,
        calculations: [
            {
                type: 'Manual',
                avg_run: 10,
                cost: 0
            },
            {
                type: 'Automated',
                avg_run: 0,
                cost: 0
            }
        ]
    }
];

beforeEach(() => {
    // Create the div to hold the chart
    let d3Container = document.createElement('div');
    d3Container.setAttribute('id', 'd3-chart-wrapper');
    d3Container.setAttribute('class', 'chart-overflow-wrapper');
    document.body.appendChild(d3Container);

});

describe('Charts/ScalableBarChart', () => {
    it('should render successfully', () => {
        mount(<ChartWrapper
            data={ data }
            lineNames={ [ 'delta' ] }
            colors={ () => 'green' }
            chart={ chart }
            overflow={ {
                enabled: true,
                wrapperClass: 'chart-overflow-wrapper',
                visibleCols: 15
            } }
            tooltip={ tooltip }
        />);
    });
});
