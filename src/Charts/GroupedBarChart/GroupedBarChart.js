import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

import initializeChart from '.././BaseChart';
import Legend from '../Utilities/Legend';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

const formatDate = (date) => {
  const pieces = date.split('-');
  return `${pieces[1]}/${pieces[2]}`;
};

const GroupedBarChart = ({
  onClick = null,
  TooltipClass,
  legend,
  ...props
}) => {
  const colors = legend.map(({ id, name }) => {
    return {
      name: name ? name : 'No organization',
      value: props.colorFunc(id),
      id,
    };
  });
  const [selectedIds, setSelectedIds] = useState(
    legend.map(({ id }) => id).slice(0, 8)
  );
  let timeout = null;

  const handleToggle = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((el) => el !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const draw = () => {
    // Clear our chart container element first
    d3.selectAll('#' + props.id + ' > *').remove();
    let { data: unformattedData } = props;
    const data = unformattedData.reduce((formatted, { date, items }) => {
      const selectedOrgs = items.filter(({ id }) => selectedIds.includes(id));
      return formatted.concat({ date, selectedOrgs });
    }, []);
    const width = props.getWidth();
    const height = props.getHeight();
    // x scale of entire chart
    const x0 = d3.scaleBand().range([0, width]).padding(0.35);
    // x scale of individual grouped bars
    const x1 = d3.scaleBand();
    const y = d3.scaleLinear().range([height, 0]);
    // format our X Axis ticks
    const maxTicksOneMonth = Math.round(data.length / (data.length / 2));
    const maxTicksTwoMonths = Math.round(data.length / (data.length / 4));
    let ticks = data.map((d) => d.date);
    if (data.length > 14) {
      ticks = data
        .map((d, i) =>
          i % (data.length > 31 ? maxTicksTwoMonths : maxTicksOneMonth) === 0
            ? d.date
            : undefined
        )
        .filter((item) => item);
    }

    const xAxis = d3.axisBottom(x0).tickValues(ticks).tickFormat(formatDate);

    const yAxis = d3.axisLeft(y).ticks(8).tickSize(-width, 0, 0);

    const svg = d3
      .select('#' + props.id)
      .append('svg')
      .attr('width', width + props.margin.left + props.margin.right)
      .attr('height', height + props.margin.bottom + props.margin.top)
      .append('g')
      .attr(
        'transform',
        'translate(' + props.margin.left + ',' + props.margin.top + ')'
      );

    const dates = data.map((d) => d.date);
    const tooltip = new TooltipClass({
      svg: '#' + props.id,
    });
    x0.domain(dates);
    x1.domain(selectedIds).range([0, x0.bandwidth()]);
    y.domain([
      0,
      d3.max(data, (date) =>
        d3.max(date.selectedOrgs, (d) => d.value * 1.15)
      ) || 8,
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
      .text(props.yLabel);

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
      .attr('transform', (d) => 'translate(' + x0(d.date) + ',0)');
    slice = slice.merge(enter);
    // add the individual bars
    let bars = slice.selectAll('rect').data(function (d) {
      return d.selectedOrgs;
    });
    bars.exit().remove();

    const color = props.colorFunc;
    const subEnter = bars
      .enter()
      .append('rect')
      .attr('width', x1.bandwidth())
      .attr('x', function (d) {
        return x1(d.id);
      }) // unsorted
      .style('fill', function (d) {
        return color(d.id);
      })
      .attr('y', function (d) {
        return y(d.value);
      })
      .attr('height', function (d) {
        return height - y(d.value);
      })
      .on('mouseover', function (d) {
        d.moreDetail = !d.name.endsWith('Others');
        d3.select(this).style(
          'cursor',
          onClick && d.moreDetail ? 'pointer' : 'default'
        );
        d3.select(this).style('fill', d3.rgb(color(d.id)).darker(1));
        tooltip.handleMouseOver(d);
      })
      .on('mousemove', tooltip.handleMouseOver)
      .on('mouseout', function (d) {
        d3.select(this).style('fill', color(d.id));
        tooltip.handleMouseOut();
      })
      .on('click', onClick);
    bars = bars.merge(subEnter);
  };

  const init = () => {
    draw();
  };

  const resize = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      draw();
    }, 500);
  };

  useEffect(() => {
    init();
    window.addEventListener('resize', resize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    draw();
  }, [props.data, selectedIds]);

  return (
    <Wrapper>
      <div id={props.id} />
      {colors.length > 0 && (
        <Legend
          id={`${props.id}-legend`}
          data={colors}
          selected={selectedIds}
          onToggle={handleToggle}
          height='350px'
          chartName={`${props.id}-legend`}
        />
      )}
    </Wrapper>
  );
};

GroupedBarChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.array,
  legend: PropTypes.array,
  margin: PropTypes.object,
  getHeight: PropTypes.func,
  getWidth: PropTypes.func,
  colorFunc: PropTypes.func,
  yLabel: PropTypes.string,
  onClick: PropTypes.func,
  TooltipClass: PropTypes.any.isRequired,
};

GroupedBarChart.defaultProps = {
  legend: [],
};

export default initializeChart(GroupedBarChart);
