import * as d3 from 'd3';

const Tooltip = ({ svg }) => {
    const toolTipBase = d3.select(svg + '> svg').append('g')
    .attr('id', 'svg-chart-Tooltip.base-' + svg.slice(1))
    .attr('overflow', 'visible')
    .style('opacity', 0)
    .style('pointer-events', 'none')
    .attr('transform', 'translate(100, 100)');
    const boxWidth = 125;

    const toolTipPoint = toolTipBase
    .append('rect')
    .attr('transform', 'translate(10, -10) rotate(45)')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', 20)
    .attr('width', 20)
    .attr('fill', '#393f44');
    const boundingBox = toolTipBase
    .append('rect')
    .attr('x', 10)
    .attr('y', -23)
    .attr('rx', 2)
    .attr('height', 68)
    .attr('width', boxWidth)
    .attr('fill', '#393f44');
    const date = toolTipBase
    .append('text')
    .attr('x', 20)
    .attr('y', 14)
    .attr('font-size', 12)
    .attr('fill', 'white')
    .text('Date');
    const jobs = toolTipBase
    .append('text')
    .attr('fill', 'white')
    .attr('font-size', 12)
    .attr('x', 72)
    .attr('y', 14)
    .text('0 Jobs');
    const orgName = toolTipBase
    .append('text')
    .attr('fill', 'white')
    .attr('font-weight', 800)
    .attr('x', 20)
    .attr('y', -1)
    .attr('font-size', 12)
    .text('Org');
    const clickMore = toolTipBase
    .append('text')
    .attr('fill', 'white')
    .attr('x', 20)
    .attr('y', 30)
    .attr('font-size', 12)
    .text('Click for details');

    const handleMouseOver = d => {
        let lDate;
        let lOrgName;
        let lJobs;
        const x =
          d3.event.pageX -
          d3
          .select(svg)
          .node()
          .getBoundingClientRect().x +
          10;
        const y =
          d3.event.pageY -
          d3
          .select(svg)
          .node()
          .getBoundingClientRect().y -
          10;
        if (!d) {
            return;
        } else {
            const maxLength = 16;
            lDate = d.date;
            lOrgName = d.name;
            lJobs = d.value;
            if (d.name.length > maxLength) {
                lOrgName = d.name.slice(0, maxLength).concat('...');
            }
        }

        const formatTooltipDate = d3.timeFormat('%m/%d');
        const toolTipWidth = toolTipBase.node().getBoundingClientRect().width;
        const chartWidth = d3
        .select(svg + '> svg')
        .node()
        .getBoundingClientRect().width;
        const overflow = 100 - (toolTipWidth / chartWidth) * 100;
        const flipped = overflow < (x / chartWidth) * 100;

        date.text('' + formatTooltipDate(lDate));
        orgName.text('' + lOrgName);
        jobs.text('' + lJobs + ' Jobs');
        const jobsWidth = jobs.node().getComputedTextLength();

        const maxTextPerc = jobsWidth / boxWidth * 100;
        const threshold = 45;
        const overage = maxTextPerc / threshold;
        let adjustedWidth;
        if (maxTextPerc > threshold) {
            adjustedWidth = boxWidth * overage;
        } else {
            adjustedWidth = boxWidth;
        }

        boundingBox.attr('width', adjustedWidth);
        toolTipBase.attr('transform', 'translate(' + x + ',' + y + ')');
        if (flipped) {
            toolTipPoint.attr('transform', 'translate(-20, 0) rotate(45)');
            boundingBox.attr('x', -adjustedWidth - 20);
            jobs.attr('x', -jobsWidth - 20 - 7);
            orgName.attr('x', -adjustedWidth - 7);
            clickMore.attr('x', -adjustedWidth - 7);
            date.attr('x', -adjustedWidth - 7);
        } else {
            toolTipPoint.attr('transform', 'translate(10, 0) rotate(45)');
            boundingBox.attr('x', 10);
            orgName.attr('x', 20);
            clickMore.attr('x', 20);
            jobs.attr('x', adjustedWidth / 2);
            date.attr('x', 20);
        }

        toolTipBase.style('opacity', 1);
        toolTipBase.interrupt();
    };

    const handleMouseOut = () => {
        toolTipBase
        .transition()
        .delay(15)
        .style('opacity', 0)
        .style('pointer-events', 'none');
    };

    return { handleMouseOut, handleMouseOver };
};

export default Tooltip;
