import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

export const ChartWrapper = props => {
    let time = null;
    const margin = { top: 20, right: 20, bottom: props.xAxis.text ? 50 : 20, left: 70 };

    const draw = () => {
        // Clear our chart container element first
        d3.selectAll('#' + props.id + ' > *').remove();

        // Get the charts inner sizes
        const wrapper = d3.select('#' + props.id);
        const height = parseInt(wrapper.style('height')) - margin.top - margin.bottom || 450;

        let width = 0;
        if (props.overflow.enabled) {
            if (props.data.length >= props.overflow.visibleCols) {
                const containerWidth = d3.select('.' + props.overflow.wrapperClass).node();
                width = containerWidth.getBoundingClientRect().width - margin.left - margin.right;
            }
        } else {
            width = parseInt(wrapper.style('width')) - margin.left - margin.right || 700;
        }

        // Create the box holding the chart (axes and labels included)
        const svg = wrapper
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('z', 100)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const addYAxis = (svg, y) => {
            svg
            .append('g')
            .attr('class', 'y-axis')
            .call(
                d3
                .axisLeft(y)
                .ticks(10)
                .tickSize(-width)
            )
            .selectAll('line')
            .attr('stroke', '#d7d7d7');
            svg.selectAll('.y-axis .tick text').attr('x', -5);

            // Add label
            svg
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - height / 2)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text(props.yAxis.text);
        };

        const addXAxis = (svg, x) => {
            const { data, value } = props;
            const maxTicks = Math.round(data.length / (value / 2));
            let ticks = data.map(d => d.xAxis);
            if (value === 31) {
                ticks = data.map((d, i) =>
                    i % maxTicks === 0 ? d.xAxis : undefined).filter(item => item);
            }

            svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(
                d3
                .axisBottom(x)
                .tickValues(ticks)
                .tickSize(-height)
                .tickFormat(d3.timeFormat('%-m/%-d')) // "1/19"
            ) // "Jan-01"
            .selectAll('line')
            .attr('stroke', '#d7d7d7');
            svg.selectAll('.x-axis .tick text').attr('y', 10);

            // Add label
            svg
            .append('text')
            .attr('transform', `translate(${width / 2}, ${height + margin.top + 20})`)
            .style('text-anchor', 'middle')
            .text(props.xAxis.text);
        };

        props.chart({
            svg,
            addXAxis,
            addYAxis,
            height,
            width,
            margin,
            ...props
        });
    };

    const resize = () => {
        clearTimeout(time);
        time = setTimeout(() => { draw(); }, 500);
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

    useEffect(() => draw(), [ props.data, props.value ]);

    return (
        <div id={ props.id } className={ props.chartClass } />
    );
};

ChartWrapper.propTypes = {
    id: PropTypes.string,
    data: PropTypes.array,
    chartClass: PropTypes.string,
    lineNames: PropTypes.array,
    colors: PropTypes.array.isRequired,
    value: PropTypes.number,
    xAxis: PropTypes.shape({
        text: PropTypes.string.required
    }).isRequired,
    yAxis: PropTypes.shape({
        text: PropTypes.string.required
    }).isRequired,
    onClick: PropTypes.func,
    chart: PropTypes.func.isRequired,
    overflow: PropTypes.shape({
        enabled: PropTypes.boolean,
        wrapperClass: PropTypes.string,
        visibleCols: PropTypes.number
    })
};

ChartWrapper.defaultProps = {
    id: 'd3-chart-wrapper',
    chartClass: 'd3-chart',
    data: [],
    lineNames: [],
    value: 31,
    onClick: () => {},
    overflow: {
        enabled: false,
        wrapperClass: 'chart-overflow-wrapper',
        visibleCols: 15
    }
};

export default ChartWrapper;
