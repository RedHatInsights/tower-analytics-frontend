import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import initializeChart from './BaseChart';
import { getTotal } from '../Utilities/helpers';
import Legend from './Utilities/Legend';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

class Tooltip {
  constructor(props) {
    this.svg = props.svg;
    // defer drawing until we know the data shape
    this.drawn = false;
    // show the success rate or not
    this.showSuccess = false;
  }

  draw(d) {
    // chart1 has success rate data and chart2 does not ...
    this.showSuccess = d && d.data && 'success_rate' in d.data ? true : false;
    const boundingHeight = this.showSuccess ? 70 : 52;
    const boundingWidth = this.showSuccess ? 120 : 108;

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
      .attr('height', boundingHeight)
      .attr('width', boundingWidth)
      .attr('fill', '#393f44');
    this.orgName = this.toolTipBase
      .append('text')
      .attr('fill', 'white')
      .attr('font-size', 12)
      .attr('font-weight', 800)
      .attr('x', 20)
      .attr('y', 0)
      .text('Organization');
    this.percentageTotal = this.toolTipBase
      .append('text')
      .attr('fill', 'white')
      .attr('font-size', 12)
      .attr('font-weight', 800)
      .attr('x', 20)
      .attr('y', 16)
      .text('0');
    this.percentageSuccess = null;
    if (this.showSuccess) {
      this.percentageSuccess = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('font-weight', 800)
        .attr('x', 20)
        .attr('y', 30)
        .text('');
    }
  }

  handleMouseOver = (event, d) => {
    // treat draw() as a singleton to avoid a painted window effect
    if (this.drawn !== true) {
      this.draw(d);
      this.drawn = true;
    }

    let perc;
    let percSuccess;
    let orgName;
    const x =
      event.pageX - d3.select(this.svg).node().getBoundingClientRect().x + 10;
    const y =
      event.pageY - d3.select(this.svg).node().getBoundingClientRect().y - 10;
    if (!d) {
      return;
    }

    if (d && d.data) {
      const maxLength = 16;
      perc = d.data.percent;
      percSuccess = d.data.success_rate;
      orgName = d.data.name;
      if (d.data.name.length > maxLength) {
        orgName = d.data.name.slice(0, maxLength - 3).concat('...');
      }
    }

    const toolTipWidth = this.toolTipBase.node().getBoundingClientRect().width;
    const chartWidth = d3
      .select(this.svg + '> svg')
      .node()
      .getBoundingClientRect().width;
    const overflow = 100 - (toolTipWidth / chartWidth) * 100;
    const flipped = overflow < (x / chartWidth) * 100;

    this.percentageTotal.text('' + perc + '%');
    if (percSuccess && this.percentageSuccess) {
      this.percentageSuccess.text('(' + percSuccess + '% successful)');
    }

    this.orgName.text(' ' + orgName);
    this.toolTipBase.attr('transform', 'translate(' + x + ',' + y + ')');
    if (flipped) {
      this.toolTipPoint.attr('transform', 'translate(-20, -10) rotate(45)');
      this.boundingBOx.attr('x', -125);
      this.orgName.attr('x', -112);
      this.percentageTotal.attr('x', -112);
      if (this.showSuccess) {
        this.percentageSuccess.attr('x', -112);
      }
    } else {
      this.toolTipPoint.attr('transform', 'translate(10, -10) rotate(45)');
      this.boundingBOx.attr('x', 10);
      this.orgName.attr('x', 20);
      this.percentageTotal.attr('x', 20);
      if (this.showSuccess) {
        this.percentageSuccess.attr('x', 20);
      }
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

const PieChart = ({
  data,
  id,
  colorFunc: color,
  margin,
  getWidth,
  getHeight,
}) => {
  const colors = data
    .map(({ id, name, count }) => {
      return {
        id,
        name,
        value: color(id),
        count: Math.round(count),
      };
    })
    .sort((a, b) => (a.count > b.count ? 1 : b.count > a.count ? -1 : 0));

  const [selectedIds, setSelectedIds] = useState(
    data.map(({ id }) => id).slice(0, 8)
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
    d3.selectAll('#' + id + ' > *').remove();
    const width = getWidth();
    const height = getHeight();
    const svg = d3
      .select('#' + id)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.bottom)
      .append('g');

    svg.append('g').attr('class', 'slices');
    svg.append('g').attr('class', 'labels');
    svg.append('g').attr('class', 'lines');
    const radius = Math.min(width, height) / 2;
    const filteredData = data.filter(({ id }) => selectedIds.includes(id));
    const total = getTotal(filteredData);
    filteredData.forEach(function (d) {
      d.count = +d.count;
      d.percent = +Math.round((d.count / total) * 100);
    });
    const donutTooltip = new Tooltip({
      svg: '#' + id,
    });
    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.count);
    const arc = d3
      .arc()
      .outerRadius(radius - 10) // controls top positioning of chart
      .innerRadius(0);

    svg.attr(
      'transform',
      'translate(' +
        (width + margin.left + margin.right) / 2 +
        ',' +
        (height + margin.top + margin.bottom) / 2 +
        ')'
    );

    svg
      .selectAll('path')
      .data(pie(filteredData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.id));

    svg
      .selectAll('path')
      .on('mouseover', function (d) {
        d3.select(this).style('fill', d3.rgb(color(d.data.id)).darker(1));
        donutTooltip.handleMouseOver(d);
      })
      .on('mouseout', function (d) {
        d3.select(this).style('fill', color(d.data.id));
        donutTooltip.handleMouseOut();
      })
      .on('mousemove', donutTooltip.handleMouseOver);

    svg.append('g').classed('labels', true);
    svg.append('g').classed('lines', true);
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
  }, [data, selectedIds]);

  return (
    <Wrapper>
      <div id={id} />
      {colors.length > 0 && (
        <Legend
          id={`${id}-legend`}
          data={colors}
          selected={selectedIds}
          onToggle={handleToggle}
          height="300px"
          chartName={`${id}-legend`}
        />
      )}
    </Wrapper>
  );
};

PieChart.propTypes = {
  id: PropTypes.string,
  data: PropTypes.array,
  margin: PropTypes.object,
  getHeight: PropTypes.func,
  getWidth: PropTypes.func,
  colorFunc: PropTypes.func,
};

export default initializeChart(PieChart);
