/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    withRouter
} from 'react-router-dom';

import initializeChart from './BaseChart';
import * as d3 from 'd3';
import Legend from '../Utilities/Legend';
import { Paths } from '../paths';
import { formatDate } from '../Utilities/helpers';
import { formatQueryStrings } from '../Utilities/formatQueryStrings';
import { pfmulti } from '../Utilities/colors';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

const color = d3.scaleOrdinal(pfmulti);

class Tooltip {
    constructor(props) {
        this.svg = props.svg;
        this.draw();
    }

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
        .attr('transform', 'translate(10, -10) rotate(45)')
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
        .attr('height', 68)
        .attr('width', this.boxWidth)
        .attr('fill', '#393f44');
        this.date = this.toolTipBase
        .append('text')
        .attr('x', 20)
        .attr('y', 14)
        .attr('font-size', 12)
        .attr('fill', 'white')
        .text('Date');
        this.jobs = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('x', 72)
        .attr('y', 14)
        .text('0 Jobs');
        this.orgName = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('font-weight', 800)
        .attr('x', 20)
        .attr('y', -1)
        .attr('font-size', 12)
        .text('Org');
        this.clickMore = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('x', 20)
        .attr('y', 30)
        .attr('font-size', 12)
        .text('Click for details');
    }

  handleMouseOver = d => {
      let date;
      let orgName;
      let jobs;
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
      } else {
          const maxLength = 16;
          date = d.date;
          orgName = d.org_name;
          jobs = d.value;
          if (d.org_name.length > maxLength) {
              orgName = d.org_name.slice(0, maxLength).concat('...');
          }
      }

      const formatTooltipDate = d3.timeFormat('%m/%d');
      const toolTipWidth = this.toolTipBase.node().getBoundingClientRect().width;
      const chartWidth = d3
      .select(this.svg + '> svg')
      .node()
      .getBoundingClientRect().width;
      const overflow = 100 - (toolTipWidth / chartWidth) * 100;
      const flipped = overflow < (x / chartWidth) * 100;

      this.date.text('' + formatTooltipDate(date));
      this.orgName.text('' + orgName);
      this.jobs.text('' + jobs + ' Jobs');
      this.jobsWidth = this.jobs.node().getComputedTextLength();

      const maxTextPerc = this.jobsWidth / this.boxWidth * 100;
      const threshold = 45;
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
          this.toolTipPoint.attr('transform', 'translate(-20, 0) rotate(45)');
          this.boundingBox.attr('x', -adjustedWidth - 20);
          this.jobs.attr('x', -this.jobsWidth - 20 - 7);
          this.orgName.attr('x', -adjustedWidth - 7);
          this.clickMore.attr('x', -adjustedWidth - 7);
          this.date.attr('x', -adjustedWidth - 7);
      } else {
          this.toolTipPoint.attr('transform', 'translate(10, 0) rotate(45)');
          this.boundingBox.attr('x', 10);
          this.orgName.attr('x', 20);
          this.clickMore.attr('x', 20);
          this.jobs.attr('x', adjustedWidth / 2);
          this.date.attr('x', 20);
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

class GroupedBarChart extends Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.draw = this.draw.bind(this);
        this.resize = this.resize.bind(this);
        this.redirectToJobExplorer = this.redirectToJobExplorer.bind(this);
        this.orgsList = props.data[0].orgs;
        this.selection = [];
        this.state = {
            colors: [],
            selected: [],
            formattedData: [],
            timeout: null
        };
    }

    // Methods
    resize() {
        const { timeout } = this.state;
        clearTimeout(timeout);
        this.setState({
            timeout: setTimeout(() => { this.init(); }, 500)
        });
    }

    redirectToJobExplorer({ date, id }) {
        let org_id;
        if (id === null) {
            org_id = -2;
        } else {
            org_id = id;
        }

        const { jobExplorer } = Paths;
        const formattedDate = formatDate(date);
        const initialQueryParams = {
            start_date: formattedDate,
            end_date: formattedDate,
            quick_date_range: 'custom',
            org_id
        };
        const { strings, stringify } = formatQueryStrings(initialQueryParams);
        const search = stringify(strings);
        this.props.history.push({
            pathname: jobExplorer,
            search
        });
    };

    handleToggle(selectedId) {
        if (this.selection.indexOf(selectedId) === -1) {
            this.selection = [ ...this.selection, selectedId ];
        } else if (this.selection.includes(selectedId)) {
            this.selection = [ ...this.selection ].filter(s => s !== selectedId);
        }

        this.setState({ selected: this.selection });
        this.draw();
    }

    init() {
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
            colors.push({
                name: org.org_name,
                value: color(org.org_name),
                id: org.id
            });
            return colors;
        }, []);
        this.setState({ colors });
        this.draw();
    }

    draw() {
        // Clear our chart container element first
        d3.selectAll('#' + this.props.id + ' > *').remove();
        let { data: unformattedData, timeFrame } = this.props;
        const selected = this.selection;
        const parseTime = d3.timeParse('%Y-%m-%d');
        const data = unformattedData.reduce((formatted, { date, orgs: orgsList }) => {
            date = parseTime(date);
            const selectedOrgs = orgsList.filter(({ id }) => selected.includes(id));
            selectedOrgs.map(org => {
                org.date = date;
            });
            return formatted.concat({ date, selectedOrgs });
        }, []);
        const width = this.props.getWidth();
        const height = this.props.getHeight();
        // x scale of entire chart
        const x0 = d3
        .scaleBand()
        .range([ 0, width ])
        .padding(0.35);
        // x scale of individual grouped bars
        const x1 = d3.scaleBand();
        const y = d3.scaleLinear().range([ height, 0 ]);
        // format our X Axis ticks
        let ticks;
        const maxTicks = Math.round(data.length / (timeFrame / 2));
        ticks = data.map(d => d.date);
        if (timeFrame === 31) {
            ticks = data.map((d, i) =>
                i % maxTicks === 0 ? d.date : undefined).filter(item => item);
        }

        const xAxis = d3
        .axisBottom(x0)
        .tickValues(ticks)
        .tickFormat(d3.timeFormat('%-m/%-d'));

        const yAxis = d3
        .axisLeft(y)
        .ticks(8)
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

        const dates = data.map(d => d.date);
        const selectedOrgNames = data[0].selectedOrgs.map(d => d.org_name);
        const tooltip = new Tooltip({
            svg: '#' + this.props.id
        });
        x0.domain(dates);
        x1.domain(selectedOrgNames).range([ 0, x0.bandwidth() ]); // unsorted
        y.domain([
            0,
            d3.max(data, date => d3.max(date.selectedOrgs, d => d.value * 1.15)) || 8
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
        .text('Jobs across orgs');

        // add x axis
        svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .selectAll('line')
        .attr('stroke', '#d7d7d7');
        svg
        .append('text')
        .attr(
            'transform',
            'translate(' + width / 2 + ' ,' + (height + this.props.margin.top + 25) + ')'
        )
        .style('text-anchor', 'middle')
        .text('Date');
        // add the groups
        let slice = svg.selectAll('.slice').data(data);
        slice.exit().remove();

        const enter = slice
        .enter()
        .append('g')
        .attr('class', 'g foo')
        .attr('transform', d => 'translate(' + x0(d.date) + ',0)');
        slice = slice.merge(enter);
        // add the individual bars
        let bars = slice.selectAll('rect').data(function(d) {
            return d.selectedOrgs;
        });
        bars.exit().remove();

        const subEnter = bars
        .enter()
        .append('rect')
        .attr('width', x1.bandwidth())
        .attr('x', function(d) {
            return x1(d.org_name);
        }) // unsorted
        .style('fill', function(d) {
            return color(d.org_name);
        })
        .attr('y', function(d) {
            return y(d.value);
        })
        .attr('height', function(d) {
            return height - y(d.value);
        })
        .on('mouseover', function(d) {
            d3.select(this).style('fill', d3.rgb(color(d.org_name)).darker(1));
            tooltip.handleMouseOver();
        })
        .on('mousemove', tooltip.handleMouseOver)
        .on('mouseout', function(d) {
            d3.select(this).style('fill', color(d.org_name));
            tooltip.handleMouseOut();
        })
        .on('click', this.redirectToJobExplorer);
        bars = bars.merge(subEnter);
    };

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

    render() {
        const { colors, selected } = this.state;
        return (
            <Wrapper>
                <div id={ this.props.id } />
                { colors.length > 0 && (
                    <Legend
                        id="d3-grouped-bar-legend"
                        data={ colors }
                        selected={ selected }
                        onToggle={ this.handleToggle }
                        height="350px"
                    />
                ) }
            </Wrapper>
        );
    }
}

GroupedBarChart.propTypes = {
    id: PropTypes.string,
    isAccessible: PropTypes.bool,
    data: PropTypes.array,
    value: PropTypes.array,
    margin: PropTypes.object,
    getHeight: PropTypes.func,
    getWidth: PropTypes.func,
    timeFrame: PropTypes.number,
    history: PropTypes.object
};

export default initializeChart(withRouter(GroupedBarChart));
