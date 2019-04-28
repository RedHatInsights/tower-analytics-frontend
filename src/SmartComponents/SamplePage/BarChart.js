/* eslint-disable */
import React, { Component } from 'react';
import * as d3 from 'd3';
import Tooltip from '../../Utilities/Tooltip';

class BarChart extends Component {

  constructor(props) {
    super(props);
        this.server = 'ci.foo.redhat.com:1337';
        this.protocol = 'https';
        //this.server = 'nginx-tower-analytics2.5a9f.insights-dev.openshiftapps.com';
        this.margin = { top: 20, right: 20, bottom: 50, left: 70 };
        this.init = this.init.bind(this);
        this.resize = this.resize.bind(this);
        this.getApiUrl = this.getApiUrl.bind(this);
        this.state = {
          data: []
        };
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

  async componentDidMount() {
    this.init();
  }

  async init() {
    // Clear our chart container element first
    d3.selectAll('#' + this.props.id  + ' > *').remove();
    const width =
        parseInt(d3.select('#' + this.props.id).style('width')) -
        this.margin.left -
        this.margin.right,
      height =
        parseInt(d3.select('#' + this.props.id).style('height')) -
        this.margin.top -
        this.margin.bottom;
    const parseTime = d3.timeParse('%Y-%m-%d');
    const formatTooltipDate = d3.timeFormat('%m/%d');
    const x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.35); // percentage
    const y = d3.scaleLinear().range([height, 0]);

    const svg = d3
      .select('#' + this.props.id)
      .append('svg')
      .attr('width', width + this.margin.left + this.margin.right)
      .attr('height', height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );
    //[fail, success]
    let colors = d3.scaleOrdinal(['#5cb85c', '#d9534f']);
    if (this.props.isAccessible) {
      colors = d3.scaleOrdinal(['#92D400', '#A30000']);
    }

    const tooltip = new Tooltip({
      svg: '#' + this.props.id  + ' > svg',
      colors
    });
    const status = ['FAIL', 'RAN'];
    var url = null;
    if (this.props.value === 'past 2 weeks') {
         url = this.getApiUrl('chart14');
    }
    if (this.props.value === 'past week') {
        url = this.getApiUrl('chart7');
    }
    if (this.props.value === 'past month') {
        url = this.getApiUrl('chart30');
    }
    const response = await fetch(url);
    const raw_data = await response.json();

    const data = raw_data.map(function(d) {
      return {DATE: parseTime(d.created), // format date string into DateTime object
              RAN: +d.successful,
              FAIL: +d.failed,
              TOTAL: +d.total
      };
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
    y.domain([0, d3.max(layers[layers.length - 1], d => d[1])]).nice();
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
      .attr('y', 0 - this.margin.left)
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
        'translate(' + width / 2 + ' ,' + (height + this.margin.top + 20) + ')'
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
      .on('mouseover', tooltip.handleMouseOver)
      .on('mousemove', tooltip.handleMouseOver)
      .on('mouseout', tooltip.handleMouseOut);

    // Call the resize function whenever a resize event occurs
    d3.select(window).on('resize', this.resize(this.init, 500));
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.value !== this.props.value) {
      this.init();
    }
    if (prevProps.isAccessible !== this.props.isAccessible) {
      this.init();
    }
  }

  render() {
    return <div id={this.props.id} />;
  }
}

export default BarChart;
