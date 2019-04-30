/* eslint-disable */
import React, { Component } from 'react';
import Tooltip from '../../Utilities/Tooltip';
import * as d3 from 'd3';

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 20, right: 20, bottom: 50, left: 70 };
    this.init = this.init.bind(this);
    this.resize = this.resize.bind(this);
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

  async init() {
    // Clear our chart container element first
    d3.selectAll('#d3-chart-root > *').remove();
    const width =
        parseInt(d3.select('#' + this.props.id).style('width')) -
        this.margin.left -
        this.margin.right,
      height =
        parseInt(d3.select('#' + this.props.id).style('height')) -
        this.margin.top -
        this.margin.bottom;

    function transition(path) {
      path
        .transition()
        .duration(1000)
        .attrTween('stroke-dasharray', tweenDash);
    }
    function tweenDash() {
      const l = this.getTotalLength(),
        i = d3.interpolateString('0,' + l, l + ',' + l);
      return function(t) {
        return i(t);
      };
    }

    const parseTime = d3.timeParse('%Y-%m-%d');
    const formatTooltipDate = d3.timeFormat('%b %d');
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    //[success, fail, total]
    let colors = d3.scaleOrdinal(['#5cb85c', '#d9534f', '#337ab7']);
    if (this.props.isAccessible) {
      colors = d3.scaleOrdinal(['#92D400', '#A30000', '#337ab7']);
    }

    const top =
      d3
        .select('#d3-chart-root')
        .node()
        .getBoundingClientRect().y + this.margin.top; // offset padding
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

    // Three function that change the tooltip when user hover / move
    const handleMouseOver = function(d) {
      const radialOffset = this.r.baseVal.value / 2;
      const intersectX =
        d3
          .select(this)
          .node()
          .getBoundingClientRect().x + radialOffset;
      // show tooltip
      tooltip.handleMouseOver(d);
      // show vertical line
      vertical
        .transition()
        .style('opacity', 1)
        .style('left', intersectX + 'px');
    };
    const handleMouseMove = function() {
      const radialOffset = this.r.baseVal.value / 2;
      const intersectX =
        d3
          .select(this)
          .node()
          .getBoundingClientRect().x + radialOffset;
      vertical.style('left', intersectX + 'px');
    };
    const handleMouseOut = function() {
      // hide tooltip
      tooltip.handleMouseOut();
      // hide vertical line
      vertical.transition().style('opacity', 0);
    };
    // d3.select('svg').remove();
    const svg = d3
      .select('#' + this.props.id)
      .append('svg')
      .attr('width', width + this.margin.left + this.margin.right)
      .attr('height', height + this.margin.top + this.margin.bottom)
      .attr('z', 100)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );
    // Tooltip
    const tooltip = new Tooltip({
      svg: '#d3-chart-root > svg',
      colors
    });

    var url = null;
    var cluster = null;
    if (this.props.cluster === 'cluster 001') {
      cluster = 1;
    }
    if (this.props.cluster === 'cluster 002') {
      cluster = 14;
    }
    if (this.props.cluster === 'cluster 003') {
      cluster = 25;
    }
    if (this.props.value === 'past 2 weeks') {
         url = this.props.getApiUrl('systemchart14');
    }
    if (this.props.value === 'past week') {
        url = this.props.getApiUrl('systemchart7');
    }
    if (this.props.value === 'past month') {
        url = this.props.getApiUrl('systemchart30');
    }
    url = url + cluster + '/';
    const response = await fetch(url);
    const raw_data = await response.json();

    const data = raw_data.map(function(d) {
      return {DATE: parseTime(d.created), // format date string into DateTime object
              RAN: +d.successful,
              FAIL: +d.failed,
              TOTAL: +d.total
      };
    });

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
      .x(function(d) {
        return x(d.DATE);
      })
      .y(function(d) {
        return y(d.RAN);
      })
      .curve(d3.curveCardinal);

    const failLine = d3
      .line()
      .x(function(d) {
        return x(d.DATE);
      })
      .y(function(d) {
        return y(d.FAIL);
      })
      .curve(d3.curveCardinal);

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
      .attr('y', 0 - this.margin.left)
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
        'translate(' + width / 2 + ' ,' + (height + this.margin.top + 20) + ')'
      )
      .style('text-anchor', 'middle')
      .text('Date');
    // Add the successLine path.
    svg
      .append('path')
      .data([data])
      .attr('class', 'line')
      .style('fill', 'none')
      .style('stroke', () => colors(1))
      .attr('stroke-width', 2)
      .attr('d', successLine)
      .call(transition);

    // Add the failLine path.
    svg
      .append('path')
      .data([data])
      .attr('class', 'line')
      .style('fill', 'none')
      .style('stroke', () => colors(0))
      .attr('stroke-width', 2)
      .attr('d', failLine)
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
    d3.select(window).on('resize', this.resize(this.init, 500));
  }

  async componentDidMount() {
    await this.init();
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

export default LineChart;
