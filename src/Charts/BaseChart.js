import * as d3 from 'd3';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const initializeChart = (Chart) => {
  const BaseChart = (props) => {
    const { id, margin } = props;

    const getWidth = () => {
      let width;
      width =
        parseInt(d3.select('#' + id).style('width')) -
          margin.left -
          margin.right || 700;
      return width;
    };

    const getHeight = () => {
      let height;
      height =
        parseInt(d3.select('#' + id).style('height')) -
          margin.top -
          margin.bottom || 450;
      return height;
    };

    const navigate = useNavigate();

    return (
      <Chart
        {...props}
        getWidth={getWidth}
        getHeight={getHeight}
        navigate={navigate}
      />
    );
  };

  BaseChart.propTypes = {
    id: PropTypes.string,
    margin: PropTypes.object,
  };

  return BaseChart;
};

initializeChart.propTypes = {
  Chart: PropTypes.element,
};

export default initializeChart;
