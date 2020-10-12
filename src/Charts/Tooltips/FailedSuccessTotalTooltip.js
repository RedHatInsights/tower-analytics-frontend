import * as d3 from 'd3';

const Tooltip = ({ lineNames, colors, svg }) => {
    const toolTipBase = d3.select(svg + '> svg').append('g')
    .attr('id', 'svg-chart-Tooltip.base-' + svg.slice(1))
    .attr('overflow', 'visible')
    .style('opacity', 0)
    .style('pointer-events', 'none')
    .attr('transform', 'translate(100, 100)');
    const boxWidth = 145;

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
    .attr('y', -41)
    .attr('rx', 2)
    .attr('height', 110)
    .attr('width', boxWidth)
    .attr('fill', '#393f44');
    const circleGreen = toolTipBase
    .append('circle')
    .attr('cx', 26)
    .attr('cy', 0)
    .attr('r', 8)
    .attr('stroke', 'white')
    .attr('fill', 'white');
    const circleRed = toolTipBase
    .append('circle')
    .attr('cx', 26)
    .attr('cy', 26)
    .attr('r', 8)
    .attr('stroke', 'white')
    .attr('fill', 'white');
    const successText = toolTipBase
    .append('text')
    .attr('x', 43)
    .attr('y', 4)
    .attr('font-size', 12)
    .attr('fill', 'white')
    .text('Successful');
    const failText = toolTipBase
    .append('text')
    .attr('x', 43)
    .attr('y', 28)
    .attr('font-size', 12)
    .attr('fill', 'white')
    .text('Failed');
    const successIcon = toolTipBase
    .append('text')
    .attr('class', 'fas fa-sm')
    .attr('fill', colors(lineNames[0]))
    .attr('x', 19)
    .attr('y', 5)
    .text('\uf058');
    const failIcon = toolTipBase
    .append('text')
    .attr('class', 'fas fa-sm')
    .attr('fill', colors(lineNames[1]))
    .attr('x', 19)
    .attr('y', 31)
    .text('\uf06a');
    const jobs = toolTipBase
    .append('text')
    .attr('fill', 'white')
    .attr('x', 137)
    .attr('y', -21)
    .attr('font-size', 12)
    .attr('text-anchor', 'end')
    .text('No jobs');
    const successful = toolTipBase
    .append('text')
    .attr('fill', 'white')
    .attr('font-size', 12)
    .attr('x', 122)
    .attr('y', 4)
    .text('0');
    const failed = toolTipBase
    .append('text')
    .attr('fill', 'white')
    .attr('font-size', 12)
    .attr('x', 122)
    .attr('y', 28)
    .text('0');
    const date = toolTipBase
    .append('text')
    .attr('fill', 'white')
    .attr('stroke', 'white')
    .attr('x', 20)
    .attr('y', -21)
    .attr('font-size', 12)
    .text('Never');
    const clickMore = toolTipBase
    .append('text')
    .attr('fill', 'white')
    .attr('x', 20)
    .attr('y', 55)
    .attr('font-size', 12)
    .text('Click for details');

    const handleMouseOver = d => {
        if (!d) { return; }

        let success = 0;
        let fail = 0;
        let total = 0;
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
        const formatTooltipDate = d3.timeFormat('%m/%d');

        const toolTipWidth = toolTipBase.node().getBoundingClientRect().width;
        const chartWidth = d3
        .select(svg + '> svg')
        .node()
        .getBoundingClientRect().width;
        const overflow = 100 - (toolTipWidth / chartWidth) * 100;
        const flipped = overflow < (x / chartWidth) * 100;
        if (d) {
            const temp = d.data ? d.data : d;
            success = temp[lineNames[0]] || 0;
            fail = temp[lineNames[1]] || 0;
            total = temp.yAxis || 0;
            date.text(formatTooltipDate(temp.xAxis || null));
        }

        jobs.text('' + total + ' jobs');
        const jobsWidth = jobs.node().getComputedTextLength();
        failed.text('' + fail);
        successful.text('' + success);
        const successTextWidth = successful.node().getComputedTextLength();
        const failTextWidth = failed.node().getComputedTextLength();

        const maxTextPerc = jobsWidth / boxWidth * 100;
        const threshold = 40;
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
            circleGreen.attr('cx', -adjustedWidth);
            circleRed.attr('cx', -adjustedWidth);
            failIcon.attr('x', -adjustedWidth - 7);
            successIcon.attr('x', -adjustedWidth - 7);
            successText.attr('x', -adjustedWidth + 17);
            failText.attr('x', -adjustedWidth + 17);
            successful.attr('x', -successTextWidth - 20 - 12);
            failed.attr('x', -failTextWidth - 20 - 12);
            date.attr('x', -adjustedWidth - 5);
            jobs.attr('x', -jobsWidth / 2 - 7);
            clickMore.attr('x', -adjustedWidth);
        } else {
            toolTipPoint.attr('transform', 'translate(10, 0) rotate(45)');
            boundingBox.attr('x', 10);
            circleGreen.attr('cx', 26);
            circleRed.attr('cx', 26);
            failIcon.attr('x', 19);
            successIcon.attr('x', 19);
            successText.attr('x', 43);
            failText.attr('x', 43);
            successful.attr('x', (adjustedWidth - successTextWidth));
            failed.attr('x', (adjustedWidth - failTextWidth));
            date.attr('x', 20);
            jobs.attr('x', (adjustedWidth));
            clickMore.attr('x', 20);
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
