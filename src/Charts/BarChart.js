import React, { useState, useEffect } from 'react';
import initializeChart from './BaseChart';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import Tooltip from '../Utilities/Tooltip';

const BarChart = (props) => {
    const [ time, setTime ] = useState(null);

    // Methods
    const draw = () => {
        // Clear our chart container element first
        d3.selectAll('#' + props.id + ' > *').remove();
        const parseTime = d3.timeParse('%Y-%m-%d');
        let { data: unformattedData, value } = props;
        const data = unformattedData.reduce((formatted, { created, successful, failed }) => {
            let DATE = parseTime(created) || new Date();
            let RAN = +successful || 0;
            let FAIL = +failed || 0;
            let TOTAL = +successful + failed || 0;
            return formatted.concat({ DATE, RAN, FAIL, TOTAL });
        }, []);
        const width = props.getWidth();
        const height = props.getHeight();
        const x = d3
        .scaleBand()
        .rangeRound([ 0, width ])
        .padding(0.35); // percentage
        const y = d3.scaleLinear().range([ height, 0 ]);

        const svg = d3
        .select('#' + props.id)
        .append('svg')
        .attr('width', width + props.margin.left + props.margin.right)
        .attr('height', height + props.margin.top + props.margin.bottom)
        .append('g')
        .attr(
            'transform',
            'translate(' +
                props.margin.left +
                ',' +
                props.margin.top +
                ')'
        );
        //[fail, success]
        let colors = d3.scaleOrdinal([ '#6EC664', '#A30000' ]);

        const barTooltip = new Tooltip({
            svg: '#' + props.id,
            colors
        });
        const status = [ 'FAIL', 'RAN' ];

        // stack our data
        const stack = d3
        .stack()
        .keys(status)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

        const layers = stack(data);
        // Scale the range of the data
        x.domain(layers[0].map(d => d.data.DATE));
        y.domain([ 0, d3.max(layers[layers.length - 1], d => d[1] * 1.15) || 8 ]);
        // Add the Y Axis
        svg
        .append('g')
        .attr('class', 'y-axis')
        .call(
            d3
            .axisLeft(y)
            .tickSize(-width, 0, 0)
        )
        .selectAll('line')
        .attr('stroke', '#d7d7d7');
        svg.selectAll('.y-axis .tick text').attr('x', -5);
        // text label for the y axis
        svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - props.margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Jobs across all clusters');
        // Add the X Axis
        let ticks;
        const maxTicks = Math.round(data.length / (value / 2));
        ticks = data.map(d => d.DATE);
        if (value === 31) {
            ticks = data.map((d, i) =>
                i % maxTicks === 0 ? d.DATE : undefined).filter(item => item);
        }

        svg
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(
            d3
            .axisBottom(x)
            .tickValues(ticks)
            .tickFormat(d3.timeFormat('%-m/%-d')) // "1/19"
        )
        .selectAll('line')
        .attr('stroke', '#d7d7d7');
        svg.selectAll('.x-axis .tick text')
        .attr('y', 10);

        // text label for the x axis
        svg
        .append('text')
        .attr(
            'transform',
            'translate(' +
                width / 2 +
                ' ,' +
                (height + props.margin.top + 20) +
                ')'
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
    };

    const resize = () => {
        clearTimeout(time);
        setTime(setTimeout(() => { draw(); }, 500));
    };

    useEffect(() => {
        draw();
        // Call the resize function whenever a resize event occurs
        window.addEventListener('resize', resize);

        return () => {
            clearTimeout(time);
            window.removeEventListener('resize', resize);
        };
    }, []);

    // FIXME: Verify if it is needed.
    useEffect(() => draw(), [ props ]);

    return (
        <div id={ props.id } />
    );
};

BarChart.propTypes = {
    id: PropTypes.string,
    data: PropTypes.array,
    value: PropTypes.number,
    margin: PropTypes.object,
    getHeight: PropTypes.func,
    getWidth: PropTypes.func
};

export default initializeChart(BarChart);
