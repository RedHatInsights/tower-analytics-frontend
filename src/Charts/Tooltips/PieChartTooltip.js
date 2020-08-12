import * as d3 from 'd3';

const Tooltip = props => {
    // defer drawing until we know the data shape
    let drawn = false;
    // show the success rate or not
    let showSuccess = false;
    const { svg } = props;

    let toolTipBase = null;
    let toolTipPoint = null;
    let boundingBox = null;
    let orgName = null;
    let percentageTotal = null;
    let percentageSuccess = null;

    const draw = d => {
        // chart1 has success rate data and chart2 does not ...
        showSuccess = (d && d.data && 'success_rate' in d.data) ? true : false;
        const boundingHeight = (showSuccess) ? 70 : 52;
        const boundingWidth = (showSuccess) ? 120 : 108;

        toolTipBase = d3.select(svg + '> svg').append('g')
        .attr('id', 'svg-chart-Tooltip.base-' + svg.slice(1))
        .attr('overflow', 'visible')
        .style('opacity', 0)
        .attr('transform', 'translate(100, 100)')
        .style('pointer-events', 'none');

        toolTipPoint = toolTipBase
        .append('rect')
        .attr('transform', 'translate(10, -10) rotate(45)')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', 20)
        .attr('width', 20)
        .attr('fill', '#393f44');
        boundingBox = toolTipBase
        .append('rect')
        .attr('x', 10)
        .attr('y', -23)
        .attr('rx', 2)
        .attr('height', boundingHeight)
        .attr('width', boundingWidth)
        .attr('fill', '#393f44');
        orgName = toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('font-weight', 800)
        .attr('x', 20)
        .attr('y', 0)
        .text('Organization');
        percentageTotal = toolTipBase
        .append('text')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('font-weight', 800)
        .attr('x', 20)
        .attr('y', 16)
        .text('0');
        if (showSuccess) {
            percentageSuccess = toolTipBase
            .append('text')
            .attr('fill', 'white')
            .attr('font-size', 12)
            .attr('font-weight', 800)
            .attr('x', 20)
            .attr('y', 30)
            .text('');
        }
    };

    const handleMouseOver = d => {
        // treat draw() as a singleton to avoid a painted window effect
        if (drawn !== true) {
            draw(d);
            drawn = true;
        }

        let perc;
        let percSuccess;
        let locOrgName;
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
        }

        if (d && d.data) {
            const maxLength = 16;
            perc = d.data.percent;
            percSuccess = d.data.success_rate;
            locOrgName = d.data.name;
            if (d.data.name.length > maxLength) {
                locOrgName = d.data.name.slice(0, maxLength - 3).concat('...');
            }
        }

        const toolTipWidth = toolTipBase.node().getBoundingClientRect().width;
        const chartWidth = d3
        .select(svg + '> svg')
        .node()
        .getBoundingClientRect().width;
        const overflow = 100 - (toolTipWidth / chartWidth) * 100;
        const flipped = overflow < (x / chartWidth) * 100;

        percentageTotal.text('' + perc + '%');
        if (percSuccess && percentageSuccess) {
            percentageSuccess.text('(' + percSuccess + '% successful)');
        }

        orgName.text(' ' + locOrgName);
        toolTipBase.attr('transform', 'translate(' + x + ',' + y + ')');
        if (flipped) {
            toolTipPoint.attr('transform', 'translate(-20, -10) rotate(45)');
            boundingBox.attr('x', -125);
            orgName.attr('x', -112);
            percentageTotal.attr('x', -112);
            if (showSuccess) {
                percentageSuccess.attr('x', -112);
            }
        } else {
            toolTipPoint.attr('transform', 'translate(10, -10) rotate(45)');
            boundingBox.attr('x', 10);
            orgName.attr('x', 20);
            percentageTotal.attr('x', 20);
            if (showSuccess) {
                percentageSuccess.attr('x', 20);
            }
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

    return { handleMouseOver, handleMouseOut };
};

export default Tooltip;
