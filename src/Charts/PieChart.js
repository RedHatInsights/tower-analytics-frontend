import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import initializeChart from './BaseChart';
import { getTotal } from '../Utilities/helpers';
import Legend from '../Utilities/Legend';
import { pfmulti } from '../Utilities/colors';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
`;

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
        .attr('height', 70)
        .attr('width', 120)
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
        this.percentageSuccess = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('font-weight', 800)
        .attr('x', 20)
        .attr('y', 30)
        .text('0');
    }

  handleMouseOver = d => {
      let perc;
      let percSuccess;
      let orgName;
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
      this.percentageSuccess.text('(' + percSuccess + '% successful)');
      this.orgName.text(' ' + orgName);
      this.toolTipBase.attr('transform', 'translate(' + x + ',' + y + ')');
      if (flipped) {
          this.toolTipPoint.attr('transform', 'translate(-20, -10) rotate(45)');
          this.boundingBOx.attr('x', -125);
          this.orgName.attr('x', -112);
          this.percentageTotal.attr('x', -112);
          this.percentageSuccess.attr('x', -112);
      } else {
          this.toolTipPoint.attr('transform', 'translate(10, -10) rotate(45)');
          this.boundingBOx.attr('x', 10);
          this.orgName.attr('x', 20);
          this.percentageTotal.attr('x', 20);
          this.percentageSuccess.attr('x', 20);
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

export const PieChart = (props) => {
    const [ colors, setColors ] = useState([]);
    let time = null;

    const draw = () => {
        const color = d3.scaleOrdinal(pfmulti);

        d3.selectAll('#' + props.id + ' > *').remove();
        const width = props.getWidth();
        const height = props.getHeight();
        const svg = d3
        .select('#' + props.id)
        .append('svg')
        .attr('width', width + props.margin.left + props.margin.right)
        .attr('height', height + props.margin.bottom)
        .append('g');

        svg.append('g').attr('class', 'slices');
        svg.append('g').attr('class', 'labels');
        svg.append('g').attr('class', 'lines');
        const radius = Math.min(width, height) / 2;
        let { data: unfilteredData } = props;
        const data = unfilteredData.filter(datum => datum.id !== -1);
        const total = getTotal(data);
        data.forEach(function(d) {
            d.count = +d.count;
            d.percent = +Math.round((d.count / total) * 100);
        });
        const donutTooltip = new Tooltip({
            svg: '#' + props.id
        });
        const pie = d3
        .pie()
        .sort(null)
        .value(d => d.count);
        const arc = d3
        .arc()
        .outerRadius(radius - 10) // controls top positioning of chart
        .innerRadius(0);

        svg.attr(
            'transform',
            'translate(' +
        (width + props.margin.left + props.margin.right) / 2 +
        ',' +
        (height + props.margin.top + props.margin.bottom) / 2 +
        ')'
        );

        svg
        .selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i));

        svg
        .selectAll('path')
        .on('mouseover', function(d, i) {
            d3.select(this).style('fill', d3.rgb(color(i)).darker(1));
            donutTooltip.handleMouseOver();
        })
        .on('mouseout', function(d, i) {
            d3.select(this).style('fill', color(i));
            donutTooltip.handleMouseOut();
        })
        .on('mousemove', donutTooltip.handleMouseOver);

        svg.append('g').classed('labels', true);
        svg.append('g').classed('lines', true);
    };

    const init = () => {
        const { data } = props;
        const color = d3.scaleOrdinal(pfmulti);

        // create our colors array to send to the Legend component
        const calculatedColors = data.reduce((colors, org) => {
            // format complement slice as "Others"
            if (org.id === -1) {
                colors.push({
                    name: 'Others',
                    value: color(org.name),
                    count: Math.round(org.count)
                });
            } else {
                colors.push({
                    name: org.name,
                    value: color(org.name),
                    count: Math.round(org.count)
                });
            }

            return colors;
        }, []);

        setColors(calculatedColors);
        draw();
    };

    const resize = () => {
        clearTimeout(time);
        time = setTimeout(() => { draw(); }, 500);
    };

    useEffect(() => {
        init();
        // Call the resize function whenever a resize event occurs
        window.addEventListener('resize', resize);

        return () => {
            clearTimeout(time);
            window.removeEventListener('resize', resize);
        };
    }, []);

    useEffect(() => init(), [ props.data ]);

    return (
        <Wrapper>
            <div id={ props.id } />
            { colors.length > 0 && (
                <Legend
                    id="d3-grouped-bar-legend"
                    data={ colors }
                    selected={ null }
                    onToggle={ null }
                    height="300px"
                />
            ) }
        </Wrapper>
    );
};

PieChart.propTypes = {
    id: PropTypes.string,
    isAccessible: PropTypes.bool,
    data: PropTypes.array,
    margin: PropTypes.object,
    getHeight: PropTypes.func,
    getWidth: PropTypes.func,
    timeFrame: PropTypes.number
};

export default initializeChart(PieChart);
