import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as d3 from 'd3';
// import Tooltip from "../Utilities/Tooltip";
import Legend from '../Utilities/Legend';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

class GroupedBarChart extends Component {
    constructor(props) {
        super(props);
        this.margin = { top: 20, right: 20, bottom: 50, left: 70 };
        this.init = this.init.bind(this);
        this.resize = this.resize.bind(this);

        this.state = {
            colors: [],
            selected: []
        };
    }

    // Methods
    resize(fn, time) {
        let timeout;

        return function () {
            const functionCall = () => fn.apply(this, arguments);

            clearTimeout(timeout);
            timeout = setTimeout(functionCall, time);
        };
    }

    componentDidMount() {
        this.init();
    }

    async init() {
        // Clear our chart container element first
        d3.selectAll('#' + this.props.id + ' > *').remove();
        const { data } = this.props;

        const width =
      parseInt(d3.select('#' + this.props.id).style('width')) -
      this.margin.left -
      this.margin.right;
        const height =
      parseInt(d3.select('#' + this.props.id).style('height')) -
      this.margin.top -
      this.margin.bottom;
        // x scale of entire chart
        const x0 = d3.scaleBand()
        .range([ 0, width ])
        .padding(0.15);
        // x scale of individual grouped bars
        const x1 = d3.scaleBand();

        const y = d3.scaleLinear()
        .range([ height, 0 ]);

        const xAxis = d3.axisBottom(x0)
        .tickSize(0);

        const yAxis = d3.axisLeft(y);

        const color = d3.scaleOrdinal(d3.schemePaired);
        const colors = data[0].orgs.reduce((colors, org) => {
            colors.push({ name: org.org_name, value: color(org.org_name), id: org.id });
            return colors;
        }, []);
        this.setState({ colors });

        const svg = d3.select('#' + this.props.id).append('svg')
        .attr('width', width + this.margin.left + this.margin.right)
        .attr('height', height + this.margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        const dates = data.map(d => d.date);
        const orgNames = data[0].orgs.map(d => d.org_name);

        x0.domain(dates);
        x1.domain(orgNames).range([ 0, x0.bandwidth() ]); // unsorted
        y.domain([ 0, d3.max(data, (date) => d3.max(date.orgs, (d) => d.value)) ]);
        // x1.domain(d3.range(0, data[0].orgs.length)).range([0, x0.bandwidth()]); // sorted

        // add x axis
        svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);
        // add y axis
        svg.append('g')
        .attr('class', 'y axis')
        .style('opacity', '0')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .style('font-weight', 'bold')
        .text('Value');
        // fade in y axis
        svg.select('.y').transition().duration(500).delay(500).style('opacity', '1');
        // add the groups
        const slice = svg.selectAll('.slice')
        .data(data)
        .enter().append('g')
        .attr('class', 'g')
        .attr('transform', (d) => 'translate(' + x0(d.date) + ',0)');
        // add the individual bars
        slice.selectAll('rect')
        .data(function (d) { return d.orgs; })
        .enter().append('rect')
        .attr('width', x1.bandwidth())
        .attr('x', function (d) { return x1(d.org_name); }) // unsorted
        // .attr("x", function(d, i) { return x1(i); }) // sorted
        .style('fill', function (d) { return color(d.org_name); })
        .attr('y', function () { return y(0); })
        .attr('height', function () { return height - y(0); })
        .on('mouseover', function (d) {
            d3.select(this).style('fill', d3.rgb(color(d.org_name)).darker(2));
        })
        .on('mouseout', function (d) {
            d3.select(this).style('fill', color(d.org_name));
        });
        //animate the bars
        slice.selectAll('rect')
        .transition()
        .delay(function () { return Math.random() * 1000; })
        .duration(500)
        .attr('y', function (d) { return y(d.value); })
        .attr('height', function (d) { return height - y(d.value); });

        // Call the resize function whenever a resize event occurs
        d3.select(window).on('resize', this.resize(this.init, 500));
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
        const { colors, selected } = this.state;
        return (
            <Wrapper>
                <div id={ this.props.id } />
                { colors.length > 0 && (
                    <Legend id="d3-grouped-bar-legend" data={ colors } selected={ selected } />
                ) }
            </Wrapper>
        );

    }
}

GroupedBarChart.propTypes = {
    id: PropTypes.string,
    isAccessible: PropTypes.bool,
    value: PropTypes.array
};

export default GroupedBarChart;
