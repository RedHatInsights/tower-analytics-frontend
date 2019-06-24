import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as d3 from 'd3';
import D3Util from '../Utilities/D3Util';
// import Tooltip from "../Utilities/Tooltip";

class DonutChart extends Component {
    constructor(props) {
        super(props);
        this.margin = { top: 20, right: 20, bottom: 0, left: 20 };
        this.init = this.init.bind(this);
        this.resize = this.resize.bind(this);
        this.state = {
            data: []
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

    sortData(data) {
    // descending
        data.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));
    }
    componentDidMount() {
        this.init();
    // document.getElementById("spinny").style.display = "none";
    }

    init() {
        d3.selectAll('#' + this.props.id + ' > *').remove();
        const width =
      parseInt(d3.select('#' + this.props.id).style('width')) -
      this.margin.left -
      this.margin.right;
        const height =
        parseInt(d3.select('#' + this.props.id).style('height')) -
        this.margin.top -
        this.margin.bottom;
        const svg = d3.select('#' + this.props.id).append('svg')
        .attr('width', width + this.margin.left + this.margin.right)
        .attr('height', height + this.margin.top + this.margin.bottom)
        .append('g');

        svg.append('g')
        .attr('class', 'slices');
        svg.append('g')
        .attr('class', 'labels');
        svg.append('g')
        .attr('class', 'lines');
        const radius = Math.min(width, height) / 2;
        const color = d3.scaleOrdinal(d3.schemePaired);
        let { data } = this.props;
        this.sortData(data);
        const total = D3Util.getTotal(data);
        data.forEach(function(d) {
            d.count = +d.count;
            d.percent = +Math.round(d.count / total * 100);
        });

        const pie = d3.pie().sort(null).value(d => d.count);
        const arc = d3.arc().innerRadius(radius * 0.8).outerRadius(radius * 0.3);

        const outerArc = d3.arc()
        .outerRadius(radius * 0.9)
        .innerRadius(radius * 0.9);

        svg.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i));
        svg.append('g').classed('labels', true);
        svg.append('g').classed('lines', true);

        // Polyline
        svg.select('.lines')
        .selectAll('polyline')
        .data(pie(data))
        .enter().append('polyline')
        .attr('points', function (d) {

            // see label transform function for explanations of these three lines.
            const pos = outerArc.centroid(d);
            pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
            return [ arc.centroid(d), outerArc.centroid(d), pos ];
        });

        // labels
        svg.select('.labels').selectAll('text')
        .data(pie(data))
        .enter().append('text')
        .attr('dy', '.35em')
        .html(function (d) {
            return `${d.data.name} - ${d.data.percent}%`;
        })
        .attr('transform', function (d) {
            const pos = outerArc.centroid(d);
            pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', function (d) {
            return (midAngle(d)) < Math.PI ? 'start' : 'end';
        });
        // var color = d3.scaleOrdinal()
        //   .range(["red", "green", "blue", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
        // svg.append('text')
        //   .attr('class', 'toolCircle')
        //   .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
        //   .html('sdfsd') // add text to the circle.
        //   .style('font-size', '.9em')
        //   .style('text-anchor', 'middle');

        function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

        // Call the resize function whenever a resize event occurs
        d3.select(window).on('resize', this.resize(this.init, 500));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
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

DonutChart.propTypes = {
    id: PropTypes.string,
    isAccessible: PropTypes.bool,
    data: PropTypes.array
};

export default DonutChart;
