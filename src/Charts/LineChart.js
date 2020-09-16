import * as d3 from 'd3';

export const LineChart = ({
    addXAxis,
    addYAxis,
    svg,
    data,
    height,
    width,
    lineNames,
    colors,
    tooltip: tooltipFnc,
    id,
    onClick
}) => {
    const setDomains = () => ({
        x: d3
        .scaleTime()
        .rangeRound([ 0, width ])
        .domain(d3.extent(data, d => d.xAxis)),
        y: d3
        .scaleLinear()
        .range([ height, 0 ])
        .domain([ 0, d3.max(data, d => d.yAxis * 1.15) ])
    });

    const { x, y } = setDomains();
    addYAxis(svg, y);
    addXAxis(svg, x);

    // Tooltip
    const tooltip = tooltipFnc({ svg: '#' + id, lineNames, colors });

    const transition = path => {
        function tweenDash() {
            const l = this.getTotalLength();
            const i = d3.interpolateString('0,' + l, l + ',' + l);
            return function(t) {
                return i(t);
            };
        }

        path
        .transition()
        .duration(1000)
        .attrTween('stroke-dasharray', tweenDash);
    };

    const vertical = svg
    .append('path')
    .attr('class', 'mouse-line')
    .style('stroke', 'black')
    .style('stroke-width', '3px')
    .style('stroke-dasharray', ('3, 3'))
    .style('opacity', '0');

    const handleMouseOver = d => {
        tooltip.handleMouseOver(d);
        vertical.transition().style('opacity', '1');
    };

    const handleMouseMove = function(d) {
        tooltip.handleMouseOver(d);
        let intersectX = this.cx.baseVal.value;
        vertical.attr('d', `M${intersectX},${height} ${intersectX}, 0`);
    };

    const handleMouseOut = () => {
        tooltip.handleMouseOut();
        vertical.transition().style('opacity', 0);
    };

    const setLine = (yAxisName, { x, y }) =>
        d3.line()
        .curve(d3.curveMonotoneX)
        .x(d => x(d.xAxis))
        .y(d => y(d[yAxisName]));

    const lines = lineNames.map((item, i) => ({
        path: setLine(item, { x, y }),
        color: colors(i),
        name: item
    }));

    lines.forEach(line => {
        // Add lines
        svg
        .append('path')
        .data([ data ])
        .attr('class', 'line')
        .style('fill', 'none')
        .style('stroke', line.color)
        .attr('stroke-width', 2)
        .attr('d', line.path)
        .call(transition);

        // Add circles
        svg
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 3)
        .style('stroke', line.color)
        .style('fill', line.color)
        .attr('cx', d => x(d.xAxis))
        .attr('cy', d => y(d[line.name]))

        .on('mouseover', handleMouseOver)
        .on('mousemove', handleMouseMove)
        .on('mouseout', handleMouseOut)
        .on('click', ({ xAxis }) => onClick(xAxis));
    });
};

export default LineChart;
