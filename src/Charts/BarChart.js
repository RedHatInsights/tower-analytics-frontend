import React, { Component } from 'react';
import initializeChart from './BaseChart';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import Tooltip from '../Utilities/Tooltip';

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
    }

    // Methods
    init() {
        // Clear our chart container element first
        d3.selectAll('#d3-chart-root > *').remove();
        let { data } = this.props;
        const width = this.props.getWidth();
        const height = this.props.getHeight();
        const parseTime = d3.timeParse('%Y-%m-%d');
        // const formatTooltipDate = d3.timeFormat('%m/%d');
        const x = d3
        .scaleBand()
        .rangeRound([ 0, width ])
        .padding(0.35); // percentage
        const y = d3.scaleLinear().range([ height, 0 ]);

        const svg = d3
        .select('#' + this.props.id)
        .append('svg')
        .attr('width', width + this.props.margin.left + this.props.margin.right)
        .attr('height', height + this.props.margin.top + this.props.margin.bottom)
        .append('g')
        .attr(
            'transform',
            'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')'
        );
        //[fail, success]
        let colors = d3.scaleOrdinal([ '#5cb85c', '#d9534f' ]);
        if (this.props.isAccessible) {
            colors = d3.scaleOrdinal([ '#92D400', '#A30000' ]);
        }

        const barTooltip = new Tooltip({
            svg: '#' + this.props.id,
            colors
        });
        const status = [ 'FAIL', 'RAN' ];
        const halfLength = Math.ceil(data.length / 2);

        if (this.props.value === 'past 2 weeks') {
            data = data.splice(0, halfLength);
        }

        if (this.props.value === 'past week') {
            data = data.splice(0, 7);
        }

        data.forEach(function (d) {
            d.DATE = parseTime(d.DATE); // format date string into DateTime object
            d.RAN = +d.RAN;
            d.FAIL = +d.FAIL;
            d.TOTAL = +(+d.FAIL + +d.RAN);
        });

        // stack our data
        const stack = d3
        .stack()
        .keys(status)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

        const layers = stack(data);
        // Scale the range of the data
        x.domain(layers[0].map(d => d.data.DATE));
        y.domain([ 0, d3.max(layers[layers.length - 1], d => d[1]) ]).nice();
        // Add the Y Axis
        svg
        .append('g')
        .call(
            d3
            .axisLeft(y)
            .ticks(8)
            .tickSize(-width, 0, 0)
        )
        .selectAll('line')
        .attr('stroke', '#d7d7d7');
        // text label for the y axis
        svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - this.props.margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Jobs Across All Clusters');
        // Add the X Axis
        svg
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(
            d3
            .axisBottom(x)
            .ticks(8)
            .tickSize(-height)
            .tickFormat(d3.timeFormat('%m/%d')) // "01/19"
        )
        .selectAll('line')
        .attr('stroke', '#d7d7d7');
        // text label for the x axis
        svg
        .append('text')
        .attr(
            'transform',
            'translate(' + width / 2 + ' ,' + (height + this.props.margin.top + 20) + ')'
        )
        .style('text-anchor', 'middle')
        .text('Date');

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
        .attr('x', d => x(d.data.DATE))
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
        .on('mouseover', barTooltip.handleMouseOver)
        .on('mousemove', barTooltip.handleMouseOver)
        .on('mouseout', barTooltip.handleMouseOut);

        // Call the resize function whenever a resize event occurs
        d3.select(window).on('resize', this.props.resize(this.init, 500));
    }

    componentDidMount() {
        // document.getElementById('spinny').style.display = 'none';
        this.init();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.init();
        }

        if (prevProps.isAccessible !== this.props.isAccessible) {
            this.init();
        }
    }

    render() {
        return <div id={ this.props.id } />;
    }
}

BarChart.propTypes = {
    id: PropTypes.string,
    isAccessible: PropTypes.bool,
    data: PropTypes.array,
    value: PropTypes.string,
    margin: PropTypes.object,
    resize: PropTypes.func,
    getHeight: PropTypes.func,
    getWidth: PropTypes.func
};

export default initializeChart(BarChart);
