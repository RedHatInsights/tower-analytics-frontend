import * as d3 from 'd3';

const BarChart = props => {
    const { svg, data, addXAxis, addYAxis, width, height, lineNames } = props;
    const colors = d3.scaleOrdinal(props.colors);
    const tooltip = props.tooltip({ svg: '#' + props.id });

    const setDomains = () => ({
        x: d3
        .scaleBand()
        .rangeRound([ 0, width ])
        .padding(0.35),
        y: d3
        .scaleLinear()
        .range([ height, 0 ])
    });

    const stack = d3
    .stack()
    .keys(lineNames)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

    const layers = stack(data);

    const { x, y } = setDomains();
    x.domain(layers[0].map(d => d.data.xAxis));
    y.domain([ 0, d3.max(layers[layers.length - 1], d => d[1] * 1.15) || 8 ]);
    addYAxis(svg, y);
    addXAxis(svg, x);

    const layer = svg
    .selectAll('layer')
    .data(layers)
    .enter()
    .append('g')
    .attr('class', 'layer')
    .style('fill', (_d, i) => colors(i));
    layer
    .selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('x', d => x(d.data.xAxis))
    .attr('y', d => y(d[0]))
    .attr('height', 0)
    .attr('width', x.bandwidth() - 1)
    .transition()
    .duration(550)
    .ease(d3.easeCubic)
    .attr('y', d => y(d[1]))
    .attr('height', d => y(d[0]) - y(d[1]));
    layer
    .selectAll('rect')
    .on('mouseover', tooltip.handleMouseOver)
    .on('mouseover', tooltip.handleMouseOver)
    .on('mouseout', tooltip.handleMouseOut)
    .on('click', ({ xAxis }) => props.onClick(xAxis));
};

export default BarChart;
