import React, { Component } from 'react';
import initializeChart from './BaseChart';
import PropTypes from 'prop-types';
import Tooltip from '../Utilities/Tooltip';
import * as d3 from 'd3';

class LineChart extends Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
    }

    // Methods
    async init() {
        // Clear our chart container element first
        d3.selectAll('#' + this.props.id + ' > *').remove();
        const width = this.props.getWidth();
        const height = this.props.getHeight();

        function transition(path) {
            path
            .transition()
            .duration(1000)
            .attrTween('stroke-dasharray', tweenDash);
        }

        function tweenDash() {
            const l = this.getTotalLength();
            const i = d3.interpolateString('0,' + l, l + ',' + l);
            return function (t) {
                return i(t);
            };
        }

        const parseTime = d3.timeParse('%Y-%m-%d');
        // const formatTooltipDate = d3.timeFormat('%b %d');
        const x = d3.scaleTime().range([ 0, width ]);
        const y = d3.scaleLinear().range([ height, 0 ]);

        //[success, fail, total]
        let colors = d3.scaleOrdinal([ '#5cb85c', '#d9534f', '#337ab7' ]);
        if (this.props.isAccessible) {
            colors = d3.scaleOrdinal([ '#92D400', '#A30000', '#337ab7' ]);
        }

        const top =
            d3
            .select('#' + this.props.id)
            .node()
            .getBoundingClientRect().y + this.props.margin.top; // offset padding

        const vertical = d3
        .select('#' + this.props.id)
        .append('div')
        .attr('class', 'remove')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('z-index', '19')
        .style('width', '1px')
        .style('height', height + 'px')
        // need y position of chart
        .style('top', top + 'px')
        .style('left', '0px')
        .style('pointer-events', 'none')
        .style('border-left', '3px dotted #393f44');

        // d3.select('svg').remove();
        const svg = d3
        .select('#' + this.props.id)
        .append('svg')
        .attr('width', width + this.props.margin.left + this.props.margin.right)
        .attr('height', height + this.props.margin.top + this.props.margin.bottom)
        .attr('z', 100)
        .append('g')
        .attr(
            'transform',
            'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')'
        );
        // Tooltip
        const tooltip = new Tooltip({
            svg: '#' + this.props.id,
            colors
        });
        // let data = await d3.csv(
        //   'https://gist.githubusercontent.com/kialam/52130f7e3292dad03a0c841f39a3b9d3/raw/ce1496e22c103cfd04314bac98c67eb8f7b8a7a1/sample.csv'
        // );
        let { data } = this.props;
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
        // Scale the range of the data
        x.domain(
            d3.extent(data, function (d) {
                return d.DATE;
            })
        );
        y.domain([
            0,
            d3.max(data, function (d) {
                return d.TOTAL + 10;
            })
        ]);

        const successLine = d3
        .line()
        // .defined(d => !isNaN(d.RAN))
        .curve(d3.curveLinear)
        .x(function (d) {
            return x(d.DATE);
        })
        .y(function (d) {
            return y(d.RAN);
        });

        const failLine = d3
        .line()
        .defined(d => !isNaN(d.FAIL))
        .curve(d3.curveLinear)
        .x(function (d) {
            return x(d.DATE);
        })
        .y(function (d) {
            return y(d.FAIL);
        });

        const totalLine = d3
        .line()
        .defined(d => !isNaN(d.TOTAL))
        .curve(d3.curveLinear)
        .x(function (d) {
            return x(d.DATE);
        })
        .y(function (d) {
            return y(d.TOTAL);
        });

        // Three function that change the tooltip when user hover / move
        const handleMouseOver = function (d) {
            const radialOffset = this.r.baseVal.value / 2;
            const intersectX = d3.select(this).node().getBoundingClientRect().x + radialOffset;
            // show tooltip
            tooltip.handleMouseOver(d);
            // show vertical line
            vertical
            .transition()
            .style('opacity', 1)
            .style('left', intersectX + 'px');
        };

        const handleMouseMove = function () {
            const radialOffset = this.r.baseVal.value / 2;
            const intersectX = d3.select(this).node().getBoundingClientRect().x + radialOffset;
            vertical.style('left', intersectX + 'px');
        };

        const handleMouseOut = function () {
            // hide tooltip
            tooltip.handleMouseOut();
            // hide vertical line
            vertical.transition().style('opacity', 0);
        };

        // Add the Y Axis
        svg
        .append('g')
        .call(
            d3
            .axisLeft(y)
            .ticks(10)
            .tickSize(-width)
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
        .text('Job Runs');
        // Add the X Axis
        svg
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(
            d3
            .axisBottom(x)
            .ticks()
            .tickSize(-height)
            .tickFormat(d3.timeFormat('%b-%d'))
        ) // "Jan-01"
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
        // Add the successLine path.
        svg
        .append('path')
        .data([ data ])
        .attr('class', 'line')
        .style('fill', 'none')
        .style('stroke', () => colors(1))
        .attr('stroke-width', 2)
        .attr('d', successLine)
        .call(transition);

        // Add the failLine path.
        svg
        .append('path')
        .data([ data ])
        .attr('class', 'line')
        .style('fill', 'none')
        .style('stroke', () => colors(0))
        .attr('stroke-width', 2)
        .attr('d', failLine)
        .call(transition);
        // Add the totalLine path.
        svg
        .append('path')
        .data([ data ])
        .attr('class', 'line')
        .style('fill', 'none')
        .style('stroke', () => colors(2))
        .attr('stroke-width', 2)
        .attr('d', totalLine)
        .call(transition);

        // create our successLine circles
        svg
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 3)
        .style('stroke', () => colors(1))
        .style('fill', () => colors(1))
        .attr('cx', function (d) {
            return x(d.DATE);
        })
        .attr('cy', function (d) {
            return y(d.RAN);
        })

        .on('mouseover', handleMouseOver)
        .on('mousemove', handleMouseMove)
        .on('mouseout', handleMouseOut);
        // create our failLine circles
        svg
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 3)
        .style('stroke', () => colors(0))
        .style('fill', () => colors(0))
        .attr('cx', function (d) {
            return x(d.DATE);
        })
        .attr('cy', function (d) {
            return y(d.FAIL);
        })
        .on('mouseover', handleMouseOver)
        .on('mousemove', handleMouseMove)
        .on('mouseout', handleMouseOut);
        // create our totalLine circles
        svg
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 3)
        .style('stroke', () => colors(2))
        .style('fill', () => colors(2))
        .attr('cx', function (d) {
            return x(d.DATE);
        })
        .attr('cy', function (d) {
            return y(d.TOTAL);
        })
        .on('mouseover', handleMouseOver)
        .on('mousemove', handleMouseMove)
        .on('mouseout', handleMouseOut);
        // Call the resize function whenever a resize event occurs
        d3.select(window).on('resize', this.props.resize(this.init, 500));
    }

    async componentDidMount() {
        await this.init();
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

LineChart.propTypes = {
    id: PropTypes.string,
    isAccessible: PropTypes.bool,
    data: PropTypes.array,
    value: PropTypes.string,
    margin: PropTypes.object,
    resize: PropTypes.func,
    getHeight: PropTypes.func,
    getWidth: PropTypes.func
};

export default initializeChart(LineChart);
