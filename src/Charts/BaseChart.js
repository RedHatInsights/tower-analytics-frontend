import React from 'react';
import * as d3 from 'd3';

function initializeChart(Chart) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.resize = this.resize.bind(this);
            this.getWidth = this.getWidth.bind(this);
            this.getHeight = this.getHeight.bind(this);
        }
        // Methods
        resize(fn, time) {
            let timeout;

            return function() {
                const functionCall = () => fn.apply(this, arguments);

                clearTimeout(timeout);
                timeout = setTimeout(functionCall, time);
            };
        }

        getWidth() {
            const width =
        parseInt(d3.select('#' + this.props.id).style('width')) -
        this.props.margin.left -
        this.props.margin.right;
            return width;
        }

        getHeight() {
            const height =
        parseInt(d3.select('#' + this.props.id).style('height')) -
        this.props.margin.top -
        this.props.margin.bottom;
            return height;
        }

        render() {
            return (
                <Chart
                    { ...this.props }
                    resize={ this.resize }
                    getWidth={ this.getWidth }
                    getHeight={ this.getHeight }
                />
            );
        }
    };
}

export default initializeChart;
