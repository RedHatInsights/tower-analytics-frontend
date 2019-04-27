/* eslint-disable */
import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

class BarChart extends Component {

    constructor(props) {
        super(props);
        this.server = 'ci.foo.redhat.com:1337';
        //this.server = 'nginx-tower-analytics2.5a9f.insights-dev.openshiftapps.com';
        this.protocol = 'https';
        this.margin = { top: 20, right: 20, bottom: 50, left: 70 };
        this.getApiUrl = this.getApiUrl.bind(this);
        this.init = this.init.bind(this);
        this.resize = this.resize.bind(this);
    }

    // Methods
    resize(fn, time) {
      let timeout;

      return function() {
        const functionCall = () => fn.apply(this, arguments);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
      };
    }

    getApiUrl(name) {
        return this.protocol + '://' + this.server + '/tower_analytics/' + name + '/';
    }

    shouldComponentUpdate() {
        console.log('shouldComponentUpdate');
        return false;
    }

    async componentDidMount() {
        console.log('componentDidMount start');
        console.log(ReactDOM.findDOMNode(this));
        console.log(document.getElementById("#bar-chart-root"));
        await this.init();
        console.log('componentDidMount end');
    }

    async init() {
        d3.selectAll('#' + this.props.id  + ' > *').remove();
        var width =
            parseInt(d3.select('#' + this.props.id).style('width')) -
            this.margin.left -
            this.margin.right,
          height =
            parseInt(d3.select('#' + this.props.id).style('height')) -
            this.margin.top -
            this.margin.bottom;

        height=500;
        console.log([width, height]);
        const url = this.getApiUrl('chart');
        const response = await fetch(url);
        const data = await response.json();
        const totals = data.map(x => x.total);
        console.log(data);
        console.log(totals);

        const y = d3.scaleLinear()
        .domain([ 0, Math.max(...totals) ])
        .range([ 0, 210 ]);

        const chartBottom = height - 70;
        const chartLeft = 70;

        const parseTime = d3.timeParse('%Y-%m-%d');
        const x2 = d3.scaleTime().range([ chartLeft + 40, (data.length - 1) * 70 + chartLeft + 40 ]);
        const y2 = d3.scaleLinear().range([ 210, 0 ]);
        x2.domain(d3.extent(data, function(d) { return parseTime(d.created); }));
        y2.domain([ 0, Math.max(...totals) ]);
        y2.nice(5);

        console.log("#" + this.props.id);
        console.log(document.getElementById("#" + this.props.id));
        console.log(d3.select("#" + this.props.id));
        const svg = d3.select("#" + this.props.id)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('margin-left', 100)
        .style('background-color', 'white');
        //.style('border-style', 'solid')
        //.style('border-color', 'blue')
        //.style('border-width', '5px');

        // Add the x Axis
        const svgXAxis = svg.append('g');
        svgXAxis.attr('transform', 'translate(0,' + chartBottom + ')')
        .call(d3.axisTop(x2)
        .ticks(data.length)
        .tickSize(210)
        .tickFormat(d3.timeFormat('%m/%d')));
        svgXAxis.selectAll('.domain').attr('stroke', '#d7d7d7');
        svgXAxis.selectAll('text').attr('fill', '#393f44');
        svgXAxis.selectAll('line').attr('stroke', '#d7d7d7');
        svgXAxis.selectAll('.tick text').attr('dy', 230).attr('fill', '#393f44')
        svgXAxis.selectAll('.tick line').attr('stroke', '#d7d7d7');

        // Add the y Axis
        const svgYAxis = svg.append('g');

        svgYAxis.attr('transform', 'translate(' + chartLeft + ',' + (chartBottom - 210) + ')')
        .call(d3.axisRight(y2)
        .ticks(5)
        .tickSize(width - chartLeft - 50))
        .selectAll('.domain').attr('stroke', '#d7d7d7');
        svgYAxis.selectAll('.tick text').attr('x', -5).attr('dy', 4).attr('fill', '#393f44').attr('text-anchor', 'end');
        svgYAxis.selectAll('.tick line').attr('stroke', '#d7d7d7');

        const svgChart = svg.append('g');

        const columns = svgChart.selectAll('rect')
        .data(data)
        .enter()
        .append('g')
        .attr('data-failures', (d) => d.failed)
        .attr('data-passes', (d) => d.successful)
        .attr('data-total', (d) => d.total)
        .on('mouseover', handleMouseOver)
        .on('mousemove', handleMouseOver)
        .on('mouseout', handleMouseOut);

        columns.append('rect')
        .attr('x', (d, i) => i * 70 + chartLeft + 25)
        .attr('y', (d) => chartBottom - y(d.failed))
        .attr('width', 30)
        .attr('height', (d) => y(d.failed))
        .attr('fill', '#d9534f');

        columns.append('rect')
        .attr('x', (d, i) => i * 70 + chartLeft + 25)
        .attr('y', (d) => chartBottom - y(d.successful) - y(d.failed))
        .attr('width', 30)
        .attr('height', (d) => y(d.successful) - 1)
        .attr('fill', '#5cb85c');

        // text label for the y axis
        svg.append('text')
        .attr('transform', 'translate(30, ' + height / 2 + ') rotate(-90)')
        .style('text-anchor', 'middle')
        .text('Jobs Across All Clusters')
        .attr('fill', '#393f44');

        // text label for the x axis
        svg.append('text')
        .attr('transform', 'translate(' + width / 2 + ', ' + (height - 30) + ')')
        .style('text-anchor', 'middle')
        .text('Time: Day')
        .attr('fill', '#393f44');

        // tooltip

        const tooltip = svg.append('g');
        tooltip.attr('id', 'svg-chart-tooltip');
        tooltip.style('opacity', 0);
        tooltip.style('pointer-events', 'none');
        tooltip.attr('transform', 'translate(100, 100)');
        tooltip.append('rect')
        .attr('transform', 'translate(10, -10) rotate(45)')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 20)
        .attr('width', 20)
        .attr('fill', '#393f44');
        tooltip.append('rect')
        .attr('x', 10)
        .attr('y', -41)
        .attr('rx', 2)
        .attr('height', 82)
        .attr('width', 135)
        .attr('fill', '#393f44');
        tooltip.append('circle')
        .attr('cx', 26)
        .attr('cy', 0)
        .attr('r', 7)
        .attr('stroke', 'white')
        .attr('fill', 'green');
        tooltip.append('circle')
        .attr('cx', 26)
        .attr('cy', 26)
        .attr('r', 7)
        .attr('stroke', 'white')
        .attr('fill', 'red');
        tooltip.append('text')
        .attr('x', 43)
        .attr('y', 4)
        .attr('font-size', 12)
        .attr('fill', 'white')
        .text('Successful');
        tooltip.append('text')
        .attr('x', 43)
        .attr('y', 28)
        .attr('font-size', 12)
        .attr('fill', 'white')
        .text('Failed');
        tooltip.append('text')
        .attr('fill', 'white')
        .attr('stroke', 'white')
        .attr('x', 24)
        .attr('y', 30)
        .attr('font-size', 12)
        .text('!');
        const jobs = tooltip.append('text')
        .attr('fill', 'white')
        .attr('x', 137)
        .attr('y', -21)
        .attr('font-size', 12)
        .attr('text-anchor', 'end')
        .text('No Jobs');
        const failed = tooltip.append('text')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('x', 122)
        .attr('y', 4)
        .text('0');
        const successful = tooltip.append('text')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('x', 122)
        .attr('y', 28)
        .text('0');
        const date = tooltip.append('text')
        .attr('fill', 'white')
        .attr('stroke', 'white')
        .attr('x', 20)
        .attr('y', -21)
        .attr('font-size', 12)
        .text('Never');

        function handleMouseOver(d) {
            const coordinates = d3.mouse(this);
            const x = coordinates[0] + 5;
            const y = coordinates[1] - 5;

            date.text(d.created);
            jobs.text('' + this.dataset.total + ' Jobs');
            failed.text('' + this.dataset.failures);
            successful.text('' + this.dataset.passes);
            tooltip.attr('transform', 'translate(' + x + ',' + y + ')');
            tooltip.style('opacity', 1);
            tooltip.interrupt();
        }

        function handleMouseOut() {
            tooltip.transition()
            .delay(15)
            .style('opacity', 0)
            .style('pointer-events', 'none');
        }
        console.log('done');

        d3.select(window).on('resize', this.resize(this.init, 500));
    }

    render () {
        return <div id={ this.props.id }></div>;
    }
}
BarChart.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    id: PropTypes.string
};

export default BarChart;
