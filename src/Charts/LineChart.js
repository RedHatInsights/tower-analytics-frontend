import React, { Component } from 'react';
import initializeChart from './BaseChart';
import PropTypes from 'prop-types';
import Tooltip from '../Utilities/Tooltip';
import * as d3 from 'd3';

class LineChart extends Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
        this.draw = this.draw.bind(this);
        this.formatData = this.formatData.bind(this);
        this.state = {
            formattedData: []
        };
    }

    async formatData() {
        const { data, value } = this.props;
        const parseTime = d3.timeParse('%Y-%m-%d');

        const formattedData = data.reduce((formatted, row) => {
            let DATE = parseTime(row.created) || new Date();
            let RAN = +row.successful || 0;
            let FAIL = +row.failed || 0;
            let TOTAL = +row.successful + row.failed || 0;
            return formatted.concat({ DATE, RAN, FAIL, TOTAL });
        }, []);
        const halfLength = Math.ceil(data.length / 2);
        if (value === 14) {
            return [ ...formattedData ].splice(0, halfLength);
        }

        if (value === 7) {
            return [ ...formattedData ].splice(0, value);
        }

        return formattedData;
    }
    getTickCount() {
        const { value } = this.props;
        if (value > 20) {
            return (value / 2);
        } else {
            return value;
        }
    }
    async init() {
        const formattedData = await this.formatData();
        this.setState((prevState) => {
            if (prevState.formattedData === formattedData) {
                return null;
            } else {
                return { formattedData };
            }
        });
        this.draw();
    }
    // Methods
    async draw() {
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
            return function(t) {
                return i(t);
            };
        }

        const x = d3.scaleTime().rangeRound([ 0, width ]);
        const y = d3.scaleLinear().range([ height, 0 ]).nice();

        //[success, fail, total]
        // let colors = d3.scaleOrdinal([ '4CB140', '#C46100', '#06C' ]);
        let colors = d3.scaleOrdinal([ '#6EC664', '#A30000', '#06C' ]);
        const svg = d3
        .select('#' + this.props.id)
        .append('svg')
        .attr('width', width + this.props.margin.left + this.props.margin.right)
        .attr('height', height + this.props.margin.top + this.props.margin.bottom)
        .attr('z', 100)
        .append('g')
        .attr(
            'transform',
            'translate(' +
          this.props.margin.left +
          ',' +
          this.props.margin.top +
          ')'
        );
        // Tooltip
        const tooltip = new Tooltip({
            svg: '#' + this.props.id,
            colors
        });
        let { formattedData: data } = this.state;
        const { value } = this.props;
        // Scale the range of the data
        x.domain(
            d3.extent(data, function(d) {
                return d.DATE;
            })
        );
        y.domain([
            0,
            d3.max(data, function(d) {
                return d.TOTAL + 10;
            })
        ]);

        const successLine = d3
        .line()
        // .defined(d => !isNaN(d.RAN))
        .curve(d3.curveMonotoneX)
        .x(function(d) {
            return x(d.DATE);
        })
        .y(function(d) {
            return y(d.RAN);
        });

        const failLine = d3
        .line()
        .defined(d => !isNaN(d.FAIL))
        .curve(d3.curveMonotoneX)
        .x(function(d) {
            return x(d.DATE);
        })
        .y(function(d) {
            return y(d.FAIL);
        });
        // Add the Y Axis
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
            .tickSize(-height)
            .tickFormat(d3.timeFormat('%-m/%-d')) // "1/19"
        ) // "Jan-01"
        .selectAll('line')
        .attr('stroke', '#d7d7d7');
        svg.selectAll('.x-axis .tick text').attr('y', 10);

        // text label for the x axis
        svg
        .append('text')
        .attr(
            'transform',
            'translate(' +
                width / 2 +
                ' ,' +
                (height + this.props.margin.top + 20) +
                ')'
        )
        .style('text-anchor', 'middle')
        .text('Date');
        const vertical = svg
        .append('path')
        .attr('class', 'mouse-line')
        .style('stroke', 'black')
        .style('stroke-width', '3px')
        .style('stroke-dasharray', ('3, 3'))
        .style('opacity', '0');

        const handleMouseOver = function(d) {
            tooltip.handleMouseOver(d);
            // show vertical line
            vertical.transition().style('opacity', '1');
        };

        const handleMouseMove = function() {
            let intersectX = this.cx.baseVal.value;
            vertical
            .attr('d', function () {
                let d = 'M' + intersectX + ',' + height;
                d += ' ' + intersectX + ',' + 0;
                return d;
            });
        };

        const handleMouseOut = function() {
            // hide tooltip
            tooltip.handleMouseOut();
            // hide vertical line
            vertical.transition().style('opacity', 0);
        };

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
        svg
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 3)
        .style('stroke', () => colors(1))
        .style('fill', () => colors(1))
        .attr('cx', function(d) {
            return x(d.DATE);
        })
        .attr('cy', function(d) {
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
        .attr('cx', function(d) {
            return x(d.DATE);
        })
        .attr('cy', function(d) {
            return y(d.FAIL);
        })
        .on('mouseover', handleMouseOver)
        .on('mousemove', handleMouseMove)
        .on('mouseout', handleMouseOut);

        // Call the resize function whenever a resize event occurs
        d3.select(window).on('resize', this.props.resize(this.init, 500));
    }

    componentDidMount() {
        this.init();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.init();
        }
    }

    render() {
        return <div id={ this.props.id } />;
    }
}

LineChart.propTypes = {
    id: PropTypes.string,
    data: PropTypes.array,
    value: PropTypes.number,
    margin: PropTypes.object,
    resize: PropTypes.func,
    getHeight: PropTypes.func,
    getWidth: PropTypes.func
};

export default initializeChart(LineChart);
