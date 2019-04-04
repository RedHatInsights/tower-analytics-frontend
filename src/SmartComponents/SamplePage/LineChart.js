/* eslint-disable */
import React, { Component } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.margin = { top: 20, right: 20, bottom: 50, left: 70 };
  }

  async init() {
    var width =
        parseInt(d3.select("#" + this.props.id).style("width")) -
        this.margin.left -
        this.margin.right,
      height =
        parseInt(d3.select("#" + this.props.id).style("height")) -
        this.margin.top -
        this.margin.bottom;

    function transition(path) {
      path
        .transition()
        .duration(2000)
        .attrTween("stroke-dasharray", tweenDash);
    }
    function tweenDash() {
      var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
      return function(t) {
        return i(t);
      };
    }

    var parseTime = d3.timeParse("%d-%b-%y");
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var successLine = d3
      .line()
      .x(function(d) {
        return x(d.DATE);
      })
      .y(function(d) {
        return y(d.RAN);
      })
      .curve(d3.curveNatural);

    var failLine = d3
      .line()
      .x(function(d) {
        return x(d.DATE);
      })
      .y(function(d) {
        return y(d.FAIL);
      })
      .curve(d3.curveNatural);

    var totalLine = d3
      .line()
      .x(function(d) {
        return x(d.DATE);
      })
      .y(function(d) {
        return y(d.TOTAL);
      })
      .curve(d3.curveNatural);

    var svg = d3
      .select("#" + this.props.id)
      .append("svg")
      .attr("width", width + this.margin.left + this.margin.right)
      .attr("height", height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

    const data = await d3.csv(
      "https://gist.githubusercontent.com/kialam/52130f7e3292dad03a0c841f39a3b9d3/raw/ce1496e22c103cfd04314bac98c67eb8f7b8a7a1/sample.csv"
    );
    data.forEach(function(d) {
      d.DATE = new Date(d.DATE);
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
      .append("path")
      .data([data])
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke", "#008000")
      .attr("stroke-width", 2)
      .attr("d", successLine)
      .call(transition);
    // Add the failLine path.
    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke", "red")
      .attr("stroke-width", 2)
      .attr("d", failLine)
      .call(transition);
    // Add the totalLine path.
    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", totalLine)
      .call(transition);
    // Add the X Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // text label for the x axis
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + this.margin.top + 20) + ")"
      )
      .style("text-anchor", "middle")
      .text("Date");
    // Add the Y Axis
    svg.append("g").call(d3.axisLeft(y));
    // text label for the y axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Job Runs");

    // Call the resize function whenever a resize event occurs
    // d3.select(window).on("resize", resize);
    // Call the resize function
    // resize();
  }

  async componentDidMount() {
    await this.init();
  }

  render() {
    return <div id={this.props.id} />;
  }
}

export default LineChart;
