import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as d3 from 'd3';
import initializeChart from './BaseChart';
import D3Util from '../Utilities/D3Util';

class Tooltip {
    constructor(props) {
        this.svg = props.svg;
        this.draw();
    }

    draw() {
        this.toolTipBase = d3.select(this.svg + '> svg').append('g');
        this.toolTipBase.attr('id', 'svg-chart-Tooltip.base-' + this.svg.slice(1));
        this.toolTipBase.attr('overflow', 'visible');
        this.toolTipBase.style('opacity', 0);
        this.toolTipBase.style('pointer-events', 'none');
        this.toolTipBase.attr('transform', 'translate(100, 100)');

        this.toolTipPoint = this.toolTipBase
        .append('rect')
        .attr('transform', 'translate(10, -10) rotate(45)')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 20)
        .attr('width', 20)
        .attr('fill', '#393f44');
        this.boundingBOx = this.toolTipBase
        .append('rect')
        .attr('x', 10)
        .attr('y', -23)
        .attr('rx', 2)
        .attr('height', 52)
        .attr('width', 85)
        .attr('fill', '#393f44');
        this.percentage = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('font-weight', 800)
        .attr('x', 44)
        .attr('y', 6)
        .text('0');
    }

    handleMouseOver = (d) => {
        let perc;
        const x =
            d3.event.pageX -
            d3
            .select(this.svg)
            .node()
            .getBoundingClientRect().x +
            10;
        const y =
            d3.event.pageY -
            d3
            .select(this.svg)
            .node()
            .getBoundingClientRect().y -
            10;
        if (!d) {
            return;
        }

        if (d && d.data) {
            perc = d.data.percent;
        }

        const toolTipWidth = this.toolTipBase.node().getBoundingClientRect().width;
        const chartWidth = d3
        .select(this.svg + '> svg')
        .node()
        .getBoundingClientRect().width;
        const overflow = 100 - (toolTipWidth / chartWidth) * 100;
        const flipped = overflow < (x / chartWidth) * 100;

        this.percentage.text('' + perc + ' %');
        this.toolTipBase.attr('transform', 'translate(' + x + ',' + y + ')');
        if (flipped) {
            this.toolTipPoint.attr('transform', 'translate(-20, -10) rotate(45)');
            this.boundingBOx.attr('x', -105);
            this.percentage.attr('x', -72);
        } else {
            this.toolTipPoint.attr('transform', 'translate(10, -10) rotate(45)');
            this.boundingBOx.attr('x', 10);
            this.percentage.attr('x', 44);
        }

        this.toolTipBase.style('opacity', 1);
        this.toolTipBase.interrupt();
    }

    handleMouseOut = () => {
        this.toolTipBase
        .transition()
        .delay(15)
        .style('opacity', 0)
        .style('pointer-events', 'none');
    }
}

class DonutChart extends Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
    }

    static defaultProps = {
        margin: { top: 20, right: 20, bottom: 0, left: 20 }
    }

    sortDescending(data) {
        // descending
        data.sort((a, b) => d3.descending(parseFloat(a.count), parseFloat(b.count)));
    }
    componentDidMount() {
        this.init();
    }

    init() {
        d3.selectAll('#' + this.props.id + ' > *').remove();
        const width = this.props.getWidth();
        const height = this.props.getHeight();
        const svg = d3.select('#' + this.props.id).append('svg')
        .attr('width', width + this.props.margin.left + this.props.margin.right)
        .attr('height', height + this.props.margin.top + this.props.margin.bottom)
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
        this.sortDescending(data);
        const total = D3Util.getTotal(data);
        data.forEach(function (d) {
            d.count = +d.count;
            d.percent = +Math.round(d.count / total * 100);
        });
        const donutTooltip = new Tooltip({
            svg: '#' + this.props.id
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

        svg.selectAll('path')
        .on('mouseover', function (d, i) {
            d3.select(this).style('fill', d3.rgb(color(i)).darker(1));
            donutTooltip.handleMouseOver();
        })
        .on('mouseout', function (d, i) {
            d3.select(this).style('fill', color(i));
            donutTooltip.handleMouseOut();
        })
        .on('mousemove', donutTooltip.handleMouseOver);

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

        function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

        // Call the resize function whenever a resize event occurs
        d3.select(window).on('resize', this.props.resize(this.init, 500));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.init();
        }
    }

    render() {
        return <div id={ this.props.id } />;
    }
}

DonutChart.propTypes = {
    id: PropTypes.string.isRequired,
    isAccessible: PropTypes.bool,
    data: PropTypes.array.isRequired,
    margin: PropTypes.object,
    resize: PropTypes.func,
    getHeight: PropTypes.func,
    getWidth: PropTypes.func
};
DonutChart.defaultProps = {
    margin: { top: 20, right: 20, bottom: 0, left: 20 }
};

export default initializeChart(DonutChart);
