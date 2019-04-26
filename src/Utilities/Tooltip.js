/* eslint-disable */
import * as d3 from 'd3';

class Tooltip {
  constructor(opts) {
    this.svg = opts.svg;
    this.colors = opts.colors;
    this.draw();
  }

  draw() {
    Tooltip.base = d3.select(this.svg).append('g');
    Tooltip.base.attr('id', 'svg-chart-Tooltip.base');
    Tooltip.base.attr('overflow', 'visible');
    Tooltip.base.style('opacity', 0);
    Tooltip.base.style('pointer-events', 'none');
    Tooltip.base.attr('transform', 'translate(100, 100)');

    Tooltip.point = Tooltip.base
      .append('rect')
      .attr('transform', 'translate(10, -10) rotate(45)')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', 20)
      .attr('width', 20)
      .attr('fill', '#393f44');
    Tooltip.boundingBox = Tooltip.base
      .append('rect')
      .attr('x', 10)
      .attr('y', -41)
      .attr('rx', 2)
      .attr('height', 82)
      .attr('width', 135)
      .attr('fill', '#393f44');
    Tooltip.circleGreen = Tooltip.base
      .append('circle')
      .attr('cx', 26)
      .attr('cy', 0)
      .attr('r', 7)
      .attr('stroke', 'white')
      .attr('fill', this.colors(1));
    Tooltip.circleRed = Tooltip.base
      .append('circle')
      .attr('cx', 26)
      .attr('cy', 26)
      .attr('r', 7)
      .attr('stroke', 'white')
      .attr('fill', this.colors(0));
    Tooltip.successText = Tooltip.base
      .append('text')
      .attr('x', 43)
      .attr('y', 4)
      .attr('font-size', 12)
      .attr('fill', 'white')
      .text('Successful');
    Tooltip.failText = Tooltip.base
      .append('text')
      .attr('x', 43)
      .attr('y', 28)
      .attr('font-size', 12)
      .attr('fill', 'white')
      .text('Failed');
    Tooltip.icon = Tooltip.base
      .append('text')
      .attr('fill', 'white')
      .attr('stroke', 'white')
      .attr('x', 24)
      .attr('y', 30)
      .attr('font-size', 12)
      .text('!');
    Tooltip.jobs = Tooltip.base
      .append('text')
      .attr('fill', 'white')
      .attr('x', 137)
      .attr('y', -21)
      .attr('font-size', 12)
      .attr('text-anchor', 'end')
      .text('No Jobs');
    Tooltip.successful = Tooltip.base
      .append('text')
      .attr('fill', 'white')
      .attr('font-size', 12)
      .attr('x', 122)
      .attr('y', 4)
      .text('0');
    Tooltip.failed = Tooltip.base
      .append('text')
      .attr('fill', 'white')
      .attr('font-size', 12)
      .attr('x', 122)
      .attr('y', 28)
      .text('0');
    Tooltip.date = Tooltip.base
      .append('text')
      .attr('fill', 'white')
      .attr('stroke', 'white')
      .attr('x', 20)
      .attr('y', -21)
      .attr('font-size', 12)
      .text('Never');
  }

  handleMouseOver(d) {
    let success = 0;
    let fail = 0;
    let total = 0;
    const x =
      d3.event.pageX -
      d3
        .select('#d3-chart-root')
        .node()
        .getBoundingClientRect().x +
      10;
    const y =
      d3.event.pageY -
      d3
        .select('#d3-chart-root')
        .node()
        .getBoundingClientRect().y -
      10;
    const formatTooltipDate = d3.timeFormat('%m/%d');
    if (!d) {
      return;
    }

    const toolTipWidth = Tooltip.base.node().getBoundingClientRect().width;
    const chartWidth = d3
      .select('#d3-chart-root > svg')
      .node()
      .getBoundingClientRect().width;
    const overflow = 100 - (toolTipWidth / chartWidth) * 100;
    const flipped = overflow < (x / chartWidth) * 100;
    if (d) {
      success = d.RAN;
      fail = d.FAIL;
      total = d.TOTAL;
      Tooltip.date.text(formatTooltipDate(d.DATE));
    }
    if (d && d.data) {
      success = d.data.RAN;
      fail = d.data.FAIL;
      total = d.data.TOTAL;
      Tooltip.date.text(formatTooltipDate(d.data.DATE));
    }
    Tooltip.jobs.text('' + total + ' Jobs');
    Tooltip.failed.text('' + fail);
    Tooltip.successful.text('' + success);

    Tooltip.base.attr('transform', 'translate(' + x + ',' + y + ')');
    if (flipped) {
      Tooltip.point.attr('transform', 'translate(-20, -10) rotate(45)');
      Tooltip.boundingBox.attr('x', -155);
      Tooltip.circleGreen.attr('cx', -140);
      Tooltip.circleRed.attr('cx', -140);
      Tooltip.icon.attr('x', -142);
      Tooltip.successText.attr('x', -120);
      Tooltip.failText.attr('x', -120);
      Tooltip.successful.attr('x', -50);
      Tooltip.failed.attr('x', -50);
      Tooltip.date.attr('x', -145);
      Tooltip.jobs.attr('x', -35);
    } else {
      Tooltip.point.attr('transform', 'translate(10, -10) rotate(45)');
      Tooltip.boundingBox.attr('x', 10);
      Tooltip.circleGreen.attr('cx', 26);
      Tooltip.circleRed.attr('cx', 26);
      Tooltip.icon.attr('x', 24);
      Tooltip.successText.attr('x', 43);
      Tooltip.failText.attr('x', 43);
      Tooltip.successful.attr('x', 122);
      Tooltip.failed.attr('x', 122);
      Tooltip.date.attr('x', 20);
      Tooltip.jobs.attr('x', 137);
    }
    Tooltip.base.style('opacity', 1);
    Tooltip.base.interrupt();
  }

  handleMouseOut() {
    Tooltip.base
      .transition()
      .delay(15)
      .style('opacity', 0)
      .style('pointer-events', 'none');
  }
}

export default Tooltip;
