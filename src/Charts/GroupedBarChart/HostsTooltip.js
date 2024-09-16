import * as d3 from 'd3';

const formatDate = (date) => {
  const pieces = date.split('-');
  return `${pieces[1]}/${pieces[2]}`;
};

export default class HostsTooltip {
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
      .attr('y', -12)
      .attr('rx', 2)
      .attr('height', 50)
      .attr('width', this.boxWidth)
      .attr('fill', '#393f44');
    this.date = this.toolTipBase
      .append('text')
      .attr('x', 20)
      .attr('y', 25)
      .attr('font-size', 12)
      .attr('fill', 'white')
      .text('Date');
    this.jobs = this.toolTipBase
      .append('text')
      .attr('fill', 'white')
      .attr('font-size', 12)
      .attr('x', 72)
      .attr('y', 25)
      .text('0 Jobs');
    this.orgName = this.toolTipBase
      .append('text')
      .attr('fill', 'white')
      .attr('font-weight', 800)
      .attr('x', 20)
      .attr('y', 10)
      .attr('font-size', 12)
      .text('Org');
  }

  handleMouseOver = (event, d) => {
    let date;
    let orgName;
    let jobs;
    const x =
      event.pageX - d3.select(this.svg).node().getBoundingClientRect().x + 10;
    const y =
      event.pageY - d3.select(this.svg).node().getBoundingClientRect().y - 10;
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
    this.jobs.text('' + jobs + ' Hosts');
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
      this.date.attr('x', -adjustedWidth - 7);
    } else {
      this.toolTipPoint.attr('transform', 'translate(10, 0) rotate(45)');
      this.boundingBox.attr('x', 10);
      this.orgName.attr('x', 20);
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
