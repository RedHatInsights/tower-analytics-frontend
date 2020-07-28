import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as d3 from 'd3';
import initializeChart from './BaseChart';
import { getTotal } from '../Utilities/helpers';
import Legend from '../Utilities/Legend';
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
        this.showSuccess = (d && d.data && 'success_rate' in d.data) ? true : false;
        const boundingHeight = (this.showSuccess) ? 70 : 52;
        const boundingWidth = (this.showSuccess) ? 120 : 108;

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

  handleMouseOver = d => {
      // treat draw() as a singleton to avoid a painted window effect
      if (this.drawn !== true) {
          this.draw(d);
          this.drawn = true;
      }

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

class PieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: [],
            timeout: null
        };
        this.draw = this.draw.bind(this);
        this.init = this.init.bind(this);
        this.resize = this.resize.bind(this);
    }
    // Methods
    resize() {
        const { timeout } = this.state;
        clearTimeout(timeout);
        this.setState({
            timeout: setTimeout(() => { this.init(); }, 500)
        });
    }
    sortDescending(data) {
    // descending
        data.sort((a, b) =>
            d3.descending(parseFloat(a.count), parseFloat(b.count))
        );
    }
    init() {
        const { data, colorToNames } = this.props;
        const legend = data.map(el => ({ name: el.name, value: colorToNames[el.name], count: Math.round(el.count) }));
        this.setState({ colors: legend.sort((a, b) => (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0)) });
        this.draw();
    }
    draw() {
        const { colorToNames } = this.props;
        d3.selectAll('#' + this.props.id + ' > *').remove();
        const width = this.props.getWidth();
        const height = this.props.getHeight();
        const svg = d3
        .select('#' + this.props.id)
        .append('svg')
        .attr('width', width + this.props.margin.left + this.props.margin.right)
        .attr('height', height + this.props.margin.bottom)
        .append('g');

        svg.append('g').attr('class', 'slices');
        svg.append('g').attr('class', 'labels');
        svg.append('g').attr('class', 'lines');
        const radius = Math.min(width, height) / 2;
        let { data: unfilteredData } = this.props;
        const data = unfilteredData.filter(datum => datum.id !== -1);
        const total = getTotal(data);
        data.forEach(function(d) {
            d.count = +d.count;
            d.percent = +Math.round((d.count / total) * 100);
        });
        const donutTooltip = new Tooltip({
            svg: '#' + this.props.id
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
        (width + this.props.margin.left + this.props.margin.right) / 2 +
        ',' +
        (height + this.props.margin.top + this.props.margin.bottom) / 2 +
        ')'
        );

        svg
        .selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d) => colorToNames[d.data.name]);

        svg
        .selectAll('path')
        .on('mouseover', function(d) {
            d3.select(this).style('fill', d3.rgb(colorToNames[d.data.name]).darker(1));
            donutTooltip.handleMouseOver(d);
        })
        .on('mouseout', function(d) {
            d3.select(this).style('fill', colorToNames[d.data.name]);
            donutTooltip.handleMouseOut();
        })
        .on('mousemove', donutTooltip.handleMouseOver);

        svg.append('g').classed('labels', true);
        svg.append('g').classed('lines', true);
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
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.init();
        }
    }

    render() {
        const { colors } = this.state;
        return (
            <Wrapper>
                <div id={ this.props.id } />
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
    }
}

PieChart.propTypes = {
    id: PropTypes.string,
    isAccessible: PropTypes.bool,
    data: PropTypes.array,
    margin: PropTypes.object,
    getHeight: PropTypes.func,
    getWidth: PropTypes.func,
    timeFrame: PropTypes.number,
    colorToNames: PropTypes.object
};

export default initializeChart(PieChart);
