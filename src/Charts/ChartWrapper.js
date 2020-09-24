import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import Legend from '../Utilities/Legend';

// Default objects to prevent unnecesary rerender
const defOverflow = {
    enabled: false,
    wrapperClass: 'chart-overflow-wrapper',
    visibleCols: 15
};
const defAxis = { text: null };

export const ChartWrapper = ({
    id = 'd3-chart-wrapper',
    chartClass = 'd3-chart',
    data = [],
    lineNames = [],
    colors = [],
    value = 31,
    xAxis = defAxis,
    yAxis = defAxis,
    onClick = () => {},
    overflow = defOverflow,
    legend = null,
    legendSelector = false,
    noMargin = false,
    small = false,
    ...props
}) => {
    const [ legendHeight, setLegendHeight ] = useState(100);
    const [ height, setHeight ] = useState(null);
    const [ width, setWidth ] = useState(null);
    const [ legendSelected, setLegendSelected ] = useState([]);
    const margin = noMargin ?
        { top: 0, right: 20, bottom: 20, left: 20 }
        : { top: 20, right: 20, bottom: xAxis.text ? 50 : 20, left: 70 };
    let time = null;

    const getWrapper = () => d3.select('#' + id);

    const clearWrapper = () => d3.selectAll('#' + id + ' > *').remove();

    const getSizes = wrapper => {
        let w = 0;
        let h = 0;

        h = parseInt(wrapper.style('height')) - margin.top - margin.bottom || 450;

        if (overflow.enabled) {
            if (data.length >= overflow.visibleCols) {
                const containerWidth = d3.select('.' + overflow.wrapperClass).node();
                w = containerWidth.getBoundingClientRect().width - margin.left - margin.right;
            }
        } else {
            w = parseInt(wrapper.style('width')) - margin.left - margin.right || 700;
        }

        return [ w, h ];
    };

    const draw = (wrapper) => {
        // Create the box holding the chart
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
            .text(yAxis.text);
        };

        const addXAxis = (svg, x) => {
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
            .text(xAxis.text);
        };

        props.chart({
            svg,
            addXAxis,
            addYAxis,
            yAxis,
            height,
            width,
            margin,
            selected: legendSelected,
            lineNames,
            colors,
            onClick,
            id,
            data,
            value,
            ...props
        });
    };

    const init = () => {
        const wrapper = getWrapper();
        if (!width || !height) {
            const [ w, h ] = getSizes(wrapper);
            setWidth(w);
            // -15 form the height to prevent increasing the height at every resize.
            setHeight(h - 15);
            setLegendHeight(h - margin.top - margin.bottom);
        } else {
            clearWrapper();
            draw(wrapper);
        }
    };

    const resize = () => {
        clearTimeout(time);
        time = setTimeout(() => { init(); }, 500);
    };

    useEffect(() => {
        init();

        // Call the resize function whenever a resize event occurs
        window.addEventListener('resize', resize);

        return () => {
            clearTimeout(time);
            window.removeEventListener('resize', resize);
        };
    }, []);

    useEffect(() => init(), [ data, value, legendSelected, width, height ]);

    return (
        <>
            <div id={ id } className={ chartClass + (small ? ' small' : '') + (overflow.enabled ? ' overflow' : '') } />
            { legend &&
                <Legend
                    data={ legend }
                    selected={ legendSelector ? legendSelected : null }
                    setSelected={ legendSelector ? setLegendSelected : null }
                    height={ legendHeight }
                />
            }
        </>
    );
};

ChartWrapper.propTypes = {
    id: PropTypes.string,
    data: PropTypes.array,
    chartClass: PropTypes.string,
    lineNames: PropTypes.array,
    colors: PropTypes.func,
    value: PropTypes.number,
    xAxis: PropTypes.shape({
        text: PropTypes.string
    }),
    yAxis: PropTypes.shape({
        text: PropTypes.string
    }),
    onClick: PropTypes.func,
    chart: PropTypes.func.isRequired,
    overflow: PropTypes.shape({
        enabled: PropTypes.boolean,
        wrapperClass: PropTypes.string,
        visibleCols: PropTypes.number
    }),
    legend: PropTypes.array,
    legendSelector: PropTypes.bool,
    noMargin: PropTypes.bool,
    small: PropTypes.bool
};

export default ChartWrapper;
