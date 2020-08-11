import * as d3 from 'd3';

const ScalableBarChart = (props) => {
    const { margin, svg, data, height, width, lineNames, colors } = props;

    const setDomains = () => ({
        x: d3
        .scaleBand()
        .rangeRound([ 0, width ])
        .padding(0.35)
        .domain(data.map(d => d.xAxis)),
        y: d3
        .scaleLinear()
        .range([ height, 0 ])
        .domain([ 0, d3.max(data, d => d.delta * 1.15) ])
    });

    const { x, y } = setDomains();

    // format our X Axis ticks
    const xAxis = d3
    .axisBottom(x)
    .tickValues(data.map(d => d.xAxis));

    const yAxis = d3
    .axisLeft(y)
    .ticks(8)
    .tickFormat(d => d3.format('.2s')(d).replace('G', 'B'))
    .tickSize(-width, 0, 0);

    // Tooltip
    const tooltip = props.tooltip({ svg: '#' + props.id });

    // add y axis
    svg
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .selectAll('line')
    .attr('stroke', '#d7d7d7')
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .style('font-weight', 'bold')
    .text('Value');
    svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text(props.yAxis.text);

    // add x axis
    svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'start')
    .attr('dx', '0.75em')
    .attr('dy', -x.bandwidth() / 1.45 - 5)
    .attr('transform', 'rotate(-90)');

    svg.selectAll('.x-axis line').attr('stroke', 'transparent');

    svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('x', d => x(d.xAxis))
    .attr('width', x.bandwidth())
    .attr('y', d => y(d[lineNames[0]]))
    .style('fill', () => colors[0])
    .attr('height', d => height - y(d[lineNames[0]]))
    .on('mouseover', function(d) {
        d3.select(this).style('fill', d3.rgb(colors[0]).darker(1));
        tooltip.handleMouseOver(d);
    })
    .on('mousemove', tooltip.handleMouseOver)
    .on('mouseout', function() {
        d3.select(this).style('fill', colors[0]);
        tooltip.handleMouseOut();
    });
};

export default ScalableBarChart;
