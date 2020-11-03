import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as d3 from 'd3';
import initializeChart from './BaseChart';

class Tooltip {
    constructor(props) {
        this.svg = props.svg;
        this.draw();
    }

    formatDollars(amount) {
        return parseFloat(amount).toFixed(2).toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    draw() {
        this.width = 125;
        this.toolTipBase = d3.select(this.svg + '> svg').append('g');
        this.toolTipBase.attr('id', 'svg-chart-Tooltip.base-' + this.svg.slice(1));
        this.toolTipBase.attr('overflow', 'visible');
        this.toolTipBase.style('opacity', 0);
        this.toolTipBase.style('pointer-events', 'none');
        this.toolTipBase.attr('transform', 'translate(100, 100)');
        this.boxWidth = 125;
        this.textWidthThreshold = 20;

        this.toolTipPoint = this.toolTipBase
        .append('rect')
        .attr('transform', 'translate(10, 0) rotate(45)')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 20)
        .attr('width', 20)
        .attr('fill', '#393f44');
        this.boundingBox = this.toolTipBase
        .append('rect')
        .attr('x', 10)
        .attr('y', -23)
        .attr('rx', 2)
        .attr('height', 92)
        .attr('width', this.boxWidth)
        .attr('fill', '#393f44');
        this.name = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('x', 20)
        .attr('y', -2)
        .text('Template name');
        this.savings = this.toolTipBase
        .append('text')
        .attr('x', 20)
        .attr('y', 52)
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .attr('fill', 'white')
        .text('Total savings $0');
        this.manualCost = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('x', 20)
        .attr('y', 16)
        .text('Manual cost $0');
        this.automationCost = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('x', 20)
        .attr('y', 34)
        .text('Automation cost $0');
    }

    handleMouseOver = d => {
        let name;
        let savings;
        let manualCost;
        let automationCost;
        const scrollLeftOffset = d3.select('#d3-roi-chart-root').node().scrollLeft;
        const x =
            d3.event.pageX -
            d3
            .select(this.svg)
            .node()
            .getBoundingClientRect().x +
            10 + scrollLeftOffset;
        const y =
            d3.event.pageY -
            d3
            .select(this.svg)
            .node()
            .getBoundingClientRect().y -
            30;
        if (!d) {
            return;
        } else {
            savings = this.formatDollars(d.delta);
            name = d.name;
            manualCost = this.formatDollars(d.manualCost);
            automationCost = this.formatDollars(d.automatedCost);
        }

        const toolTipWidth = this.toolTipBase.node().getBoundingClientRect().width;
        const chartWidth = d3
        .select(this.svg + '> svg')
        .node()
        .getBoundingClientRect().width;
        const overflow = 100 - (toolTipWidth / chartWidth) * 100;
        const flipped = overflow < (x / chartWidth) * 100;
        this.name.text('' + name);
        this.savings.text('Total savings $' + savings);
        this.manualCost.text('Manual Cost $' + manualCost);
        this.automationCost.text('Automation Cost $' + automationCost);
        this.nameWidth = this.name.node().getComputedTextLength();
        this.savingsWidth = this.savings.node().getComputedTextLength();
        this.manualCostWidth = this.manualCost.node().getComputedTextLength();
        this.automationCostWidth = this.automationCost.node().getComputedTextLength();
        this.widestTextElem = d3.max([ this.nameWidth, this.savingsWidth, this.automationCostWidth, this.manualCostWidth ]);

        const maxTextPerc = this.widestTextElem / this.boxWidth * 100;
        const threshold = 85;
        const overage = maxTextPerc / threshold;
        let adjustedWidth;
        if (maxTextPerc > threshold) {
            adjustedWidth = this.boxWidth * overage;
        } else {
            adjustedWidth = this.boxWidth;
        }

        this.boundingBox.attr('width', adjustedWidth);
        this.toolTipBase.attr('transform', 'translate(' + x + ',' + y + ')');
        if (flipped) {
            this.toolTipPoint.attr('transform', 'translate(-20, 15) rotate(45)');
            this.boundingBox.attr('x', -adjustedWidth - 20);
            this.name.attr('x', -(toolTipWidth - 7));
            this.savings.attr('x', -(toolTipWidth - 7));
            this.manualCost.attr('x', -(toolTipWidth - 7));
            this.automationCost.attr('x', -(toolTipWidth - 7));
        } else {
            this.toolTipPoint.attr('transform', 'translate(10, 15) rotate(45)');
            this.boundingBox.attr('x', 10);
            this.name.attr('x', 20);
            this.savings.attr('x', 20);
            this.manualCost.attr('x', 20);
            this.automationCost.attr('x', 20);
        }

        this.toolTipBase.style('opacity', 1);
        this.toolTipBase.interrupt();
    };

    handleMouseOut = () => {
        this.toolTipBase
        .transition()
        .delay(15)
        .style('opacity', 0)
        .style('pointer-events', 'none');
    };
}

class TopTemplatesSavings extends Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
        this.draw = this.draw.bind(this);
        this.resize = this.resize.bind(this);
        this.state = {
            timeout: null
        };
    }

    // Methods
    resize() {
        const { timeout } = this.state;
        clearTimeout(timeout);
        this.setState({
            timeout: setTimeout(() => {
                this.init();
            }, 500)
        });
    }

    init() {
        this.draw();
    }

    draw() {
        // Use PF chart color
        const color = '#0066CC'; //blue
        // Clear our chart container element first
        d3.selectAll('#' + this.props.id + ' > *').remove();
        const { data } = this.props;
        let width;
        // adjust chart width to support larger datasets
        if (data.length >= 15) {
            const containerWidth = d3.select('.automation-wrapper').node();
            width = containerWidth.getBoundingClientRect().width - this.props.margin.left - this.props.margin.right;
        } else {
            width = this.props.getWidth();
        }

        const height = this.props.getHeight();
        const x = d3
        .scaleBand()
        .rangeRound([ 0, width ])
        .padding(0.45);
        const y = d3.scaleLinear().range([ height, 0 ]);
        // format our X Axis ticks
        let ticks;
        ticks = data.map(d => d.name);
        const formatYAxisValue = d3.format('.2s');
        const xAxis = d3.axisBottom(x).tickValues(ticks);

        const yAxis = d3
        .axisLeft(y)
        .ticks(8)
        .tickFormat(d => formatYAxisValue(d).replace('G', 'B'))
        .tickSize(-width, 0, 0);

        const svg = d3
        .select('#' + this.props.id)
        .append('svg')
        .attr('width', width + this.props.margin.left + this.props.margin.right)
        .attr('height', height + this.props.margin.bottom + this.props.margin.top)
        .append('g')
        .attr(
            'transform',
            'translate(' +
          this.props.margin.left +
          ',' +
          this.props.margin.top +
          ')'
        );

        const taskNames = data.map(d => d.name);
        const tooltip = new Tooltip({
            svg: '#' + this.props.id
        });
        x.domain(taskNames);
        y.domain([
            0,
            d3.max(data, d => d.delta * 1.15) || 8
        ]);

        // add y axis
        svg
        .append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .selectAll('line')
        .attr('stroke', '#d7d7d7')
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
        .attr('y', 0 - this.props.margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Savings per template ($)');

        // add x axis
        svg
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'start')
        .attr('dx', '0.75em')
        .attr('dy', -x.bandwidth() / 1.45 - 8)
        .attr('transform', 'rotate(-90)');

        svg.selectAll('.x-axis line').attr('stroke', 'transparent');

        svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('x', d => x(d.name))
        .attr('width', x.bandwidth())
        .attr('y', d => y(d.delta))
        .style('fill', () => color)
        .attr('height', d => height - y(d.delta))
        .on('mouseover', function(d) {
            d3.select(this).style('fill', d3.rgb(color).darker(1));
            tooltip.handleMouseOver(d);
        })
        .on('mousemove', tooltip.handleMouseOver)
        .on('mouseout', function() {
            d3.select(this).style('fill', color);
            tooltip.handleMouseOut();
        });
    }

    componentDidMount() {
        this.init();
        // Call the resize function whenever a resize event occurs
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        const { timeout } = this.state;
        clearTimeout(timeout);
        window.removeEventListener('resize', this.resize);
    }

    componentDidUpdate() {
        this.init();
    }

    render() {
        return <div id={ this.props.id } />;
    }
}

TopTemplatesSavings.propTypes = {
    id: PropTypes.string,
    data: PropTypes.array,
    margin: PropTypes.object,
    getHeight: PropTypes.func,
    getWidth: PropTypes.func
};

export default initializeChart(TopTemplatesSavings);
