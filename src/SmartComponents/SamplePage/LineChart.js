/* eslint-disable */
import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 20, right: 20, bottom: 50, left: 70 };
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

  async init() {
    // Clear our chart container element first
    d3.selectAll('#d3-chart-root > *').remove();
    var width =
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
      var l = this.getTotalLength(),
        i = d3.interpolateString('0,' + l, l + ',' + l);
      return function(t) {
        return i(t);
      };
    }

    var parseTime = d3.timeParse('%Y-%m-%d');
    var formatTooltipDate = d3.timeFormat('%b %d');
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    //[success, fail, total]
    var colors = d3.scaleOrdinal(['green', 'red', 'black']);
    var vertical = d3
      .select('#' + this.props.id)
      .append('div')
      .attr('class', 'remove')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('z-index', '19')
      .style('width', '1px')
      .style('height', height + this.margin.top + 'px')
      .style('left', '0px')
      .style('pointer-events', 'none')
      .style('border-left', '2px dotted gray');

    // Tooltip
    var tooltip = d3
      .select('#d3-chart-root')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    // define the line
    var successLine = d3
      .line()
      .x(function(d) {
        return x(d.DATE);
      })
      .y(function(d) {
        return y(d.RAN);
      })
      .curve(d3.curveLinear);

    var failLine = d3
      .line()
      .x(function(d) {
        return x(d.DATE);
      })
      .y(function(d) {
        return y(d.FAIL);
      })
      .curve(d3.curveLinear);

    var totalLine = d3
      .line()
      .x(function(d) {
        return x(d.DATE);
      })
      .y(function(d) {
        return y(d.TOTAL);
      })
      .curve(d3.curveLinear);

    // Three function that change the tooltip when user hover / move
    var mouseover = function(d) {
      var toolTipHeight = d3
        .select('.tooltip')
        .node()
        .getBoundingClientRect().height;
      console.log('this mouse', d3.mouse(this));
      if (d3.event.path[0].__data__ && d3.event.path[0].__data__.DATE) {
        tooltip.transition().style('opacity', 1);
        tooltip
          .html(
            formatTooltipDate(d3.event.path[0].__data__.DATE) + // format time correctly
              '<br/>' +
              'Total ' +
              "<span class='tooltip-value'>" +
              d3.event.path[0].__data__.TOTAL +
              '</span>' +
              '<br/>' +
              "<svg height='12' width='12'><circle r='4' cx='6' cy='6' stroke='white' stroke-width='1' fill='green' fill-opacity='1' /></svg>" +
              ' Successful ' +
              "<span class='tooltip-value'>" +
              d3.event.path[0].__data__.RAN +
              '</span>' +
              '<br/>' +
              "<svg height='12' width='12'><circle r='4' cx='6' cy='6' stroke='white' stroke-width='1' fill='red' fill-opacity='1' /></svg>" +
              ' Failed ' +
              "<span class='tooltip-value'>" +
              d3.event.path[0].__data__.FAIL +
              '</span>' +
              '<br/>'
          )
          .style('left', d3.event.pageX + 10 + 'px')
          .style('top', d3.event.pageY - Math.round(toolTipHeight / 2) + 'px'); // add half of the height of the tooltip
        vertical
          .transition()
          .style('opacity', 1)
          .style('left', d3.event.pageX + 'px');
      } else {
        return false;
      }
    };
    var mousemove = function(d) {
      vertical.style('left', d3.event.pageX + 'px');
    };
    var mouseleave = function(d) {
      tooltip.transition().style('opacity', 0);
      vertical.transition().style('opacity', 0);
    };

    // d3.
    d3.select('svg').remove();
    var svg = d3
      .select('#' + this.props.id)
      .append('svg')
      .attr('width', width + this.margin.left + this.margin.right)
      .attr('height', height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    const data = await d3.csv(
      'https://gist.githubusercontent.com/kialam/52130f7e3292dad03a0c841f39a3b9d3/raw/ce1496e22c103cfd04314bac98c67eb8f7b8a7a1/sample.csv'
    );
    data.forEach(function(d) {
      d.DATE = parseTime(d.DATE); // format date string into DateTime object
      d.RAN = +d.RAN;
      d.FAIL = +d.FAIL;
      d.TOTAL = +(+d.FAIL + +d.RAN);
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
        return d.TOTAL;
      })
    ]);
    // Add the successLine path.
    svg
      .append('path')
      .data([data])
      .attr('class', 'line')
      .style('fill', 'none')
      .style('stroke', () => colors(0))
      .attr('stroke-width', 2)
      .attr('d', successLine)
      .call(transition);
    // Add the failLine path.
    svg
      .append('path')
      .data([data])
      .attr('class', 'line')
      .style('fill', 'none')
      .style('stroke', () => colors(1))
      .attr('stroke-width', 2)
      .attr('d', failLine)
      .call(transition);
    // Add the totalLine path.
    svg
      .append('path')
      .data([data])
      .attr('class', 'line')
      .style('fill', 'none')
      .style('stroke', () => colors(2))
      .attr('stroke-width', 2)
      .attr('d', totalLine)
      .call(transition);
    // Add the X Axis
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b-%d'))); // "Jan-01"
    // text label for the x axis
    svg
      .append('text')
      .attr(
        'transform',
        'translate(' + width / 2 + ' ,' + (height + this.margin.top + 20) + ')'
      )
      .style('text-anchor', 'middle')
      .text('Date');
    // Add the Y Axis
    svg.append('g').call(d3.axisLeft(y));
    // text label for the y axis
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Job Runs');
    // create our successLine circles
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
        return y(d.RAN);
      })
      .on('mouseover', function(d, i) {
        d3.select(this)
          .transition()
          .ease(d3.easeElastic)
          .duration('1500')
          .style('stroke', 'black')
          // .style("stroke-width", 4)
          .attr('r', 5);
      })
      .on('mouseout', function(d, i) {
        d3.select(this)
          .transition()
          .ease(d3.easeBack)
          .duration('200')
          .style('stroke', 'green')
          // .style("stroke-width", 1)
          .attr('r', 3);
      });

    // create our failLine circles
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
        return y(d.FAIL);
      });

    // create our totalLine circles
    svg
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', 3)
      .style('stroke', () => colors(2))
      .style('fill', () => colors(2))
      .attr('cx', function(d) {
        return x(d.DATE);
      })
      .attr('cy', function(d) {
        return y(d.TOTAL);
      });

    svg
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave)
      .on('mouseout', mouseleave);

    // Call the resize function whenever a resize event occurs
    d3.select(window).on('resize', this.resize(this.init, 500));
  }

  async componentDidMount() {
    await this.init();
  }

  render() {
    return <div id={this.props.id} />;
  }
}

export default LineChart;
