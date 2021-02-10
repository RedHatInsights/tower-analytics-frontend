import * as d3 from 'd3';

class Tooltip {
    constructor(opts) {
        this.svg = opts.svg;
        this.colors = opts.colors;
        this.draw();
    }

    draw() {
        this.toolTipBase = d3.select(this.svg + '> svg').append('g');
        this.toolTipBase.attr('id', 'svg-chart-Tooltip.base-' + this.svg.slice(1));
        this.toolTipBase.attr('overflow', 'visible');
        this.toolTipBase.style('opacity', 0);
        this.toolTipBase.style('pointer-events', 'none');
        this.toolTipBase.attr('transform', 'translate(100, 100)');
        this.boxWidth = 145;
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
        .attr('y', -41)
        .attr('rx', 2)
        .attr('height', 110)
        .attr('width', this.boxWidth)
        .attr('fill', '#393f44');
        this.circleSuccess = this.toolTipBase
        .append('circle')
        .attr('cx', 26)
        .attr('cy', 0)
        .attr('r', 8)
        .attr('stroke', 'white')
        .attr('fill', 'white');
        this.circleFail = this.toolTipBase
        .append('circle')
        .attr('cx', 26)
        .attr('cy', 26)
        .attr('r', 8)
        .attr('stroke', 'white')
        .attr('fill', 'white');
        this.successText = this.toolTipBase
        .append('text')
        .attr('x', 43)
        .attr('y', 4)
        .attr('font-size', 12)
        .attr('fill', 'white')
        .text('Successful');
        this.failText = this.toolTipBase
        .append('text')
        .attr('x', 43)
        .attr('y', 28)
        .attr('font-size', 12)
        .attr('fill', 'white')
        .text('Failed');
        this.successIcon = this.toolTipBase
        .append('text')
        .attr('class', 'fas fa-sm')
        .attr('fill', this.colors(1))
        .attr('x', 19)
        .attr('y', 5)
        .text('\uf058');
        this.failedIcon = this.toolTipBase
        .append('text')
        .attr('class', 'fas fa-sm')
        .attr('fill', this.colors(0))
        .attr('x', 20)
        .attr('y', 31)
        .text('\uf06a');
        this.jobs = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('x', 137)
        .attr('y', -21)
        .attr('font-size', 12)
        .attr('text-anchor', 'end')
        .text('No jobs');
        this.successful = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('x', 122)
        .attr('y', 4)
        .text('0');
        this.failed = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('x', 122)
        .attr('y', 28)
        .text('0');
        this.date = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('stroke', 'white')
        .attr('x', 20)
        .attr('y', -21)
        .attr('font-size', 12)
        .text('Never');
        this.clickMore = this.toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('x', 20)
        .attr('y', 55)
        .attr('font-size', 12)
        .text('Click for details');
    }

  handleMouseOver = d => {
      let success = 0;
      let fail = 0;
      let total = 0;
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
      const formatTooltipDate = d3.timeFormat('%m/%d');
      if (!d) {
          return;
      }

      const toolTipWidth = this.toolTipBase.node().getBoundingClientRect().width;
      const chartWidth = d3
      .select(this.svg + '> svg')
      .node()
      .getBoundingClientRect().width;
      const overflow = 100 - (toolTipWidth / chartWidth) * 100;
      const flipped = overflow < (x / chartWidth) * 100;
      if (d) {
          success = d.RAN || 0;
          fail = d.FAIL || 0;
          total = d.TOTAL || 0;
          this.date.text(formatTooltipDate(d.DATE || null));
      }

      if (d && d.data) {
          success = d.data.RAN || 0;
          fail = d.data.FAIL || 0;
          total = d.data.TOTAL || 0;
          this.date.text(formatTooltipDate(d.data.DATE || null));
      }

      this.jobs.text('' + total + ' jobs');
      this.jobsWidth = this.jobs.node().getComputedTextLength();
      this.failed.text('' + fail);
      this.successful.text('' + success);
      this.successTextWidth = this.successful.node().getComputedTextLength();
      this.failTextWidth = this.failed.node().getComputedTextLength();

      const maxTextPerc = (this.jobsWidth / this.boxWidth) * 100;
      const threshold = 40;
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
          this.circleSuccess.attr('cx', -adjustedWidth);
          this.circleFail.attr('cx', -adjustedWidth);
          this.failedIcon.attr('x', -adjustedWidth - 7);
          this.successIcon.attr('x', -adjustedWidth - 7);
          this.successText.attr('x', -adjustedWidth + 17);
          this.failText.attr('x', -adjustedWidth + 17);
          this.successful.attr('x', -this.successTextWidth - 20 - 12);
          this.failed.attr('x', -this.failTextWidth - 20 - 12);
          this.date.attr('x', -adjustedWidth - 5);
          this.jobs.attr('x', -this.jobsWidth / 2 - 7);
          this.clickMore.attr('x', -adjustedWidth);
      } else {
          this.toolTipPoint.attr('transform', 'translate(10, 0) rotate(45)');
          this.boundingBox.attr('x', 10);
          this.circleSuccess.attr('cx', 26);
          this.circleFail.attr('cx', 26);
          this.failedIcon.attr('x', 19);
          this.successIcon.attr('x', 19);
          this.successText.attr('x', 43);
          this.failText.attr('x', 43);
          this.successful.attr('x', adjustedWidth - this.successTextWidth);
          this.failed.attr('x', adjustedWidth - this.failTextWidth);
          this.date.attr('x', 20);
          this.jobs.attr('x', adjustedWidth);
          this.clickMore.attr('x', 20);
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

export default Tooltip;
