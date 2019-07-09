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

const color = d3.scaleOrdinal(d3.schemePaired);

class GroupedBarChart extends Component {
    constructor(props) {
        super(props);
        this.margin = { top: 20, right: 20, bottom: 50, left: 70 };
        this.init = this.init.bind(this);
        this.resize = this.resize.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.draw = this.draw.bind(this);
        this.orgsList = props.data[0].orgs;
        this.selection = [];
        this.state = {
            colors: [],
            selected: [],
            dataPoints: []
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

    async handleToggle(selectedId) {
        if (this.selection.indexOf(selectedId) === -1) {
            this.selection.push(selectedId);
        }
        else if (this.selection.includes(selectedId)) {
            this.selection = this.selection.filter(s => s !== selectedId);
        }

        await this.setState({ selected: this.selection });
        this.formatData();
    }

    async formatData() {
        let dataPoints = [ ...this.props.data ];
        dataPoints.forEach(entry => {
            let orgsList = entry.orgs;
            orgsList = orgsList.filter(org => this.selection.includes(org.id));
            entry.slicedOrgs = orgsList;
        });
        await this.setState({ dataPoints });
    }

    componentDidMount() {
        this.init();
    }

    async init() {
        // create the first 8 selected data points
        if (this.selection.length === 0) {
            this.orgsList.forEach((org, index) => {
                if (index <= 7) {
                    this.handleToggle(org.id);
                }
            });
        }

        // create our colors array to send to the Legend component
        const colors = this.orgsList.reduce((colors, org) => {
            colors.push({ name: org.org_name, value: color(org.org_name), id: org.id });
            return colors;
        }, []);
        this.setState({ colors });

        await this.formatData();
        this.draw();
    }

    draw() {
        // Clear our chart container element first
        d3.selectAll('#' + this.props.id + ' > *').remove();
        const { dataPoints: data } = this.state;
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

        const svg = d3.select('#' + this.props.id).append('svg')
        .attr('width', width + this.margin.left + this.margin.right)
        .attr('height', height + this.margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        // const dates = data.map(d => d.date);
        const { dataPoints } = this.state;
        const dates = dataPoints.map(d => d.date);
        // const orgNames = this.orgsList.map(d => d.org_name);
        const orgNames = data[0].slicedOrgs.map(d => d.org_name);

        x0.domain(dates);
        x1.domain(orgNames).range([ 0, x0.bandwidth() ]); // unsorted
        y.domain([ 0, d3.max(data, (date) => d3.max(date.slicedOrgs, (d) => d.value)) ]);
        // x1.domain(d3.range(0, data[0].orgs.length)).range([0, x0.bandwidth()]); // sorted

        // add x axis
        svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);
        svg
        .append('text')
        .attr(
            'transform',
            'translate(' + width / 2 + ' ,' + (height + this.margin.top) + ')'
        )
        .style('text-anchor', 'middle')
        .text('Date');

        // add y axis
        svg.append('g')
        .attr('class', 'y axis')
        // .style('opacity', '0')
        .call(yAxis)
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
        .attr('y', 0 - this.margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Jobs Across Orgs');
        // fade in y axis
        // svg.select('.y').transition().duration(500).delay(500).style('opacity', '1');
        // add the groups
        let slice = svg.selectAll('.slice')
        .data(data);
        slice.exit().remove();

        const enter = slice
        .enter().append('g')
        .attr('class', 'g foo')
        .attr('transform', (d) => 'translate(' + x0(d.date) + ',0)');
        slice = slice.merge(enter);
        // add the individual bars
        let bars = slice.selectAll('rect')
        .data(function (d) { return d.slicedOrgs; });
        // .exit().remove()
        bars.exit().remove();

        const subEnter = bars
        .enter().append('rect')
        .attr('width', x1.bandwidth())
        .attr('x', function (d) { return x1(d.org_name); }) // unsorted
        // .attr("x", function(d, i) { return x1(i); }) // sorted
        .style('fill', function (d) { return color(d.org_name); })
        // .attr('y', function () { return y(0); })
        // .attr('height', function () { return height - y(0); })
        .attr('y', function (d) { return y(d.value); })
        .attr('height', function (d) { return height - y(d.value); })
        .on('mouseover', function (d) {
            d3.select(this).style('fill', d3.rgb(color(d.org_name)).darker(2));
        })
        .on('mouseout', function (d) {
            d3.select(this).style('fill', color(d.org_name));
        });
        bars = bars.merge(subEnter);
        //animate the bars
        // slice.selectAll('rect')
        //     .transition()
        //     .delay(function () { return Math.random() * 1000; })
        //     .duration(500)
        //     .attr('y', function (d) { return y(d.value); })
        //     .attr('height', function (d) { return height - y(d.value); });

        // Call the resize function whenever a resize event occurs
        d3.select(window).on('resize', this.resize(this.init, 500));
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.value !== this.props.value) {
            this.init();
        }

        if (prevProps.isAccessible !== this.props.isAccessible) {
            this.init();
        }

        if (prevState.dataPoints !== this.state.dataPoints) {
            this.draw();
        }
    }

    render() {
        const { colors, selected } = this.state;
        return (
            <Wrapper>
                <div id={ this.props.id } />
                { colors.length > 0 && (
                    <Legend id="d3-grouped-bar-legend" data={ colors } selected={ selected } onToggle={ this.handleToggle } />
                ) }
            </Wrapper>
        );

    }
}

GroupedBarChart.propTypes = {
    id: PropTypes.string,
    isAccessible: PropTypes.bool,
    data: PropTypes.array,
    value: PropTypes.array
};

export default GroupedBarChart;
