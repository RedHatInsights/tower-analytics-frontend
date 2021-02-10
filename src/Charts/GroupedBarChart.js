import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import initializeChart from './BaseChart';
import * as d3 from 'd3';
import Legend from '../Utilities/Legend';
import { Paths } from '../paths';
import { stringify } from 'query-string';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

const formatDate = date => {
    const pieces = date.split('-');
    return `${pieces[1]}/${pieces[2]}`;
};

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
          orgName = d.name;
          jobs = d.value;
          if (d.name.length > maxLength) {
              orgName = d.name.slice(0, maxLength).concat('...');
          }
      }

      const formatTooltipDate = formatDate;
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

      const maxTextPerc = (this.jobsWidth / this.boxWidth) * 100;
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

const GroupedBarChart = (props) => {
    const orgsList = props.data[0].items;
    const colors = orgsList.map(org => {
        const name = org.id === -1 ? 'Others' : org.name;
        return {
            name,
            value: props.colorFunc(name),
            id: org.id
        };
    });
    const [ selectedIds, setSelectedIds ] = useState(
        orgsList.map(({ id }) => id).slice(0, 8)
    );
    let timeout = null;

    const redirectToJobExplorer = ({ date, id }) => {
        if (id === -1) {
            // disable clicking on "others" block
            return;
        }

        const { jobExplorer } = Paths;
        const formattedDate = formatDate(date);
        const initialQueryParams = {
            quick_date_range: 'custom',
            start_date: formattedDate,
            end_date: formattedDate,
            status: [
                'successful',
                'failed',
                'new',
                'pending',
                'waiting',
                'error',
                'canceled',
                'running'
            ],
            org_id: [ id ]
        };

        const search = stringify(initialQueryParams, { arrayFormat: 'bracket' });
        props.history.push({
            pathname: jobExplorer,
            search
        });
    };

    const handleToggle = id => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(el => el !== id));
        } else {
            setSelectedIds([ ...selectedIds, id ]);
        }
    };

    const draw = () => {
        // Clear our chart container element first
        d3.selectAll('#' + props.id + ' > *').remove();
        let { data: unformattedData, timeFrame } = props;
        const data = unformattedData.reduce((formatted, { date, items }) => {
            const selectedOrgs = items.filter(({ id }) => selectedIds.includes(id));
            return formatted.concat({ date, selectedOrgs });
        }, []);
        const width = props.getWidth();
        const height = props.getHeight();
        // x scale of entire chart
        const x0 = d3
        .scaleBand()
        .range([ 0, width ])
        .padding(0.35);
        // x scale of individual grouped bars
        const x1 = d3.scaleBand();
        const y = d3.scaleLinear().range([ height, 0 ]);
        // format our X Axis ticks
        const maxTicks = Math.round(data.length / (timeFrame / 2));
        let ticks = data.map(d => d.date);
        if (timeFrame === 31) {
            ticks = data
            .map((d, i) => (i % maxTicks === 0 ? d.date : undefined))
            .filter(item => item);
        }

        const xAxis = d3
        .axisBottom(x0)
        .tickValues(ticks)
        .tickFormat(formatDate);

        const yAxis = d3
        .axisLeft(y)
        .ticks(8)
        .tickSize(-width, 0, 0);

        const svg = d3
        .select('#' + props.id)
        .append('svg')
        .attr('width', width + props.margin.left + props.margin.right)
        .attr('height', height + props.margin.bottom + props.margin.top)
        .append('g')
        .attr(
            'transform',
            'translate(' +
          props.margin.left +
          ',' +
          props.margin.top +
          ')'
        );

        const dates = data.map(d => d.date);
        const selectedOrgNames = data[0].selectedOrgs.map(d => d.name);
        const tooltip = new Tooltip({
            svg: '#' + props.id
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
        .attr('y', 0 - props.margin.left)
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
            'translate(' + width / 2 + ' ,' + (height + props.margin.top + 25) + ')'
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

        const color = props.colorFunc;
        const subEnter = bars
        .enter()
        .append('rect')
        .attr('width', x1.bandwidth())
        .attr('x', function(d) {
            return x1(d.name);
        }) // unsorted
        .style('fill', function(d) {
            return color(d.name);
        })
        .attr('y', function(d) {
            return y(d.value);
        })
        .attr('height', function(d) {
            return height - y(d.value);
        })
        .on('mouseover', function(d) {
            d3.select(this).style('fill', d3.rgb(color(d.name)).darker(1));
            tooltip.handleMouseOver();
        })
        .on('mousemove', tooltip.handleMouseOver)
        .on('mouseout', function(d) {
            d3.select(this).style('fill', color(d.name));
            tooltip.handleMouseOut();
        })
        .on('click', redirectToJobExplorer);
        bars = bars.merge(subEnter);
    };

    const init = () => {
        draw();
    };

    const resize = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => { draw(); }, 500);
    };

    useEffect(() => {
        init();
        window.addEventListener('resize', resize);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', resize);
        };
    }, []);

    useEffect(() => { draw(); }, [ props.data, selectedIds ]);

    return (
        <Wrapper>
            <div id={ props.id } />
            { colors.length > 0 && (
                <Legend
                    id={ `${props.id}-legend` }
                    data={ colors }
                    selected={ selectedIds }
                    onToggle={ handleToggle }
                    height="350px"
                />
            ) }
        </Wrapper>
    );
};

GroupedBarChart.propTypes = {
    id: PropTypes.string,
    isAccessible: PropTypes.bool,
    data: PropTypes.array,
    value: PropTypes.array,
    margin: PropTypes.object,
    getHeight: PropTypes.func,
    getWidth: PropTypes.func,
    timeFrame: PropTypes.number,
    history: PropTypes.object,
    colorFunc: PropTypes.func
};

export default initializeChart(GroupedBarChart);
