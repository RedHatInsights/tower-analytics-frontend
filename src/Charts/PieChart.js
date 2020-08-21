import * as d3 from 'd3';

function getTotal(data, attr) {
    if (!data) {
        return 0;
    } else {
        let total = 0;
        data.forEach(d => {
            total += parseInt(d[attr]);
        });
        return total;
    }
}

const PieChart = props => {
    const { svg, data, height, width, margin, lineNames, colorFunc } = props;

    // Translate again because the pie chart has it different
    // This is ugly, FIXME
    svg.attr('transform', `translate(${(width + margin.left + margin.right) / 2}, ${(height + margin.top + margin.bottom) / 2})`);

    // FIXME
    // Adding data percent for tooltip
    const total = getTotal(data, 'count');
    data.forEach(function(d) {
        d.percent = +Math.round((d.count / total) * 100);
    });

    svg
    .append('g').attr('class', 'slices')
    .append('g').attr('class', 'labels')
    .append('g').attr('class', 'lines');

    const radius = Math.min(width, height) / 2;

    const donutTooltip = props.tooltip({ svg: '#' + props.id });

    const pie = d3
    .pie()
    .sort(null)
    .value(d => d[lineNames[0]]);
    const arc = d3
    .arc()
    .outerRadius(radius - 10) // controls top positioning of chart
    .innerRadius(0);

    svg
    .selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', ({ data }) => colorFunc(data.name));

    svg
    .selectAll('path')
    .on('mouseover', function(d) {
        d3.select(this).style('fill', d3.rgb(colorFunc(d.data.name)).darker(1));
        donutTooltip.handleMouseOver(d);
    })
    .on('mouseout', function(d) {
        d3.select(this).style('fill', colorFunc(d.data.name));
        donutTooltip.handleMouseOut();
    })
    .on('mousemove', donutTooltip.handleMouseOver);

    svg.append('g').classed('labels', true);
    svg.append('g').classed('lines', true);
};

export default PieChart;
