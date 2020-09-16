import * as d3 from 'd3';

const formatDollars = amount => {
    return parseFloat(amount).toFixed(2).toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const Tooltip = ({ svg }) => {
    const toolTipBase = d3.select(svg + '> svg')
    .append('g')
    .attr('id', 'svg-chart-Tooltip.base-' + svg.slice(1))
    .attr('overflow', 'visible')
    .style('opacity', 0)
    .style('pointer-events', 'none')
    .attr('transform', 'translate(100, 100)');
    const boxWidth = 125;

    const toolTipPoint = toolTipBase
    .append('rect')
    .attr('transform', 'translate(10, 0) rotate(45)')
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
    .attr('height', 92)
    .attr('width', boxWidth)
    .attr('fill', '#393f44');
    const name = toolTipBase
    .append('text')
    .attr('fill', 'white')
    .attr('font-size', 12)
    .attr('x', 20)
    .attr('y', -2)
    .text('Template name');
    const savings = toolTipBase
    .append('text')
    .attr('x', 20)
    .attr('y', 52)
    .attr('font-size', 12)
    .attr('font-weight', 'bold')
    .attr('fill', 'white')
    .text('Total savings $0');
    const manualCost = toolTipBase
    .append('text')
    .attr('fill', 'white')
    .attr('font-size', 12)
    .attr('x', 20)
    .attr('y', 16)
    .text('Manual cost $0');
    const automationCost = toolTipBase
    .append('text')
    .attr('fill', 'white')
    .attr('font-size', 12)
    .attr('x', 20)
    .attr('y', 34)
    .text('Automation cost $0');

    const handleMouseOver = d => {
        let lname;
        let lsavings;
        let lmanualCost;
        let lautomationCost;
        const scrollLeftOffset = d3.select('' + svg).node().scrollLeft;
        const x =
            d3.event.pageX -
            d3
            .select(svg)
            .node()
            .getBoundingClientRect().x +
            10 + scrollLeftOffset;
        const y =
            d3.event.pageY -
            d3
            .select(svg)
            .node()
            .getBoundingClientRect().y -
            30;
        if (!d) {
            return;
        } else {
            lsavings = formatDollars(d.delta);
            lname = d.xAxis;
            lmanualCost = formatDollars(d.calculations[0].cost);
            lautomationCost = formatDollars(d.calculations[1].cost);
        }

        const toolTipWidth = toolTipBase.node().getBoundingClientRect().width;
        const chartWidth = d3
        .select(svg + '> svg')
        .node()
        .getBoundingClientRect().width;
        const overflow = 100 - (toolTipWidth / chartWidth) * 100;
        const flipped = overflow < (x / chartWidth) * 100;
        name.text('' + lname);
        savings.text('Total savings $' + lsavings);
        manualCost.text('Manual Cost $' + lmanualCost);
        automationCost.text('Automation Cost $' + lautomationCost);
        const nameWidth = name.node().getComputedTextLength();
        const savingsWidth = savings.node().getComputedTextLength();
        const manualCostWidth = manualCost.node().getComputedTextLength();
        const automationCostWidth = automationCost.node().getComputedTextLength();
        const widestTextElem = d3.max([ nameWidth, savingsWidth, automationCostWidth, manualCostWidth ]);

        const maxTextPerc = widestTextElem / boxWidth * 100;
        const threshold = 85;
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
            toolTipPoint.attr('transform', 'translate(-20, 15) rotate(45)');
            boundingBox.attr('x', -adjustedWidth - 20);
            name.attr('x', -(toolTipWidth - 7));
            savings.attr('x', -(toolTipWidth - 7));
            manualCost.attr('x', -(toolTipWidth - 7));
            automationCost.attr('x', -(toolTipWidth - 7));
        } else {
            toolTipPoint.attr('transform', 'translate(10, 15) rotate(45)');
            boundingBox.attr('x', 10);
            name.attr('x', 20);
            savings.attr('x', 20);
            manualCost.attr('x', 20);
            automationCost.attr('x', 20);
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
