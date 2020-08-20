import * as d3 from 'd3';
import { pfmulti } from '../Utilities/colors';

const GroupedBarChart = props => {
    const { svg, data, addXAxis, addYAxis, width, height, selected, lineNames } = props;
    const tooltip = props.tooltip({ svg: '#' + props.id });
    const color = d3.scaleOrdinal(pfmulti);
    const filteredData = data.map(el => ({
        ...el,
        group: el.group.filter(({ id }) => selected.includes(id))
    }));

    // x scale of entire chart
    const x0 = d3
    .scaleBand()
    .range([ 0, width ])
    .padding(0.35);
    x0.domain(data.map(d => d.xAxis));

    const selectedOrgNames = filteredData[0].group.map(d => d.name);
    const x1 = d3.scaleBand();
    x1.domain(selectedOrgNames).range([ 0, x0.bandwidth() ]); // unsorted

    const y = d3.scaleLinear().range([ height, 0 ]);
    y.domain([ 0, d3.max(filteredData, date => d3.max(date.group, d => d.value * 1.15)) || 8 ]);

    addYAxis(svg, y);
    addXAxis(svg, x0);

    // add the groups
    let slice = svg.selectAll('.slice').data(filteredData);
    slice.exit().remove();

    const enter = slice
    .enter()
    .append('g')
    .attr('class', 'g foo')
    .attr('transform', d => 'translate(' + x0(d.xAxis) + ',0)');
    slice = slice.merge(enter);
    // add the individual bars
    let bars = slice.selectAll('rect').data(function(d) {
        return d.group;
    });
    bars.exit().remove();

    const subEnter = bars
    .enter()
    .append('rect')
    .attr('width', x1.bandwidth())
    .attr('x', function(d) {
        return x1(d.name);
    }) // unsorted
    .style('fill', function(d) {
        return color(d.name);
    })
    .attr('y', function(d) {
        return y(d[lineNames[0]]);
    })
    .attr('height', function(d) {
        return height - y(d[lineNames[0]]);
    })
    .on('mouseover', function(d) {
        d3.select(this).style('fill', d3.rgb(color(d.name)).darker(1));
        tooltip.handleMouseOver();
    })
    .on('mousemove', tooltip.handleMouseOver)
    .on('mouseout', function(d) {
        d3.select(this).style('fill', color(d.name));
        tooltip.handleMouseOut();
    })
    .on('click', props.onClick);
    bars = bars.merge(subEnter);
};

export default GroupedBarChart;
