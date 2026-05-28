import PropTypes from 'prop-types';
import React from 'react';
import Plot from 'react-plotly.js';
import {
  chartBackground,
  chartGridColor,
  chartText,
  chartTextSecondary,
  chartTooltipBg,
} from '../../Charts/Utilities/chartTheme';
import { useQueryParams } from '../../QueryParams';
import { reportDefaultParams } from '../../Utilities/constants';

const PlotlyChart = ({ data }) => {
  const items = data;
  const defaultParams = reportDefaultParams('templates_by_organization');
  const { queryParams } = useQueryParams(defaultParams);

  const xLabel = 'Organization';
  const xLabelValue = 'customdata.org_name';
  const yLabel = 'Template count';
  const yToolTipLabel = 'Template';
  const yToolTipLabelValue = 'customdata.template_name';

  function findZLabel() {
    let zLabel = '';
    switch (queryParams.adoption_rate_type) {
      case 'elapsed_of_templates_by_org':
        return (zLabel = 'Elapsed');
      case 'job_count_of_templates_by_org':
        return (zLabel = 'Job count');
      case 'task_count_of_templates_by_org':
        return (zLabel = 'Task count');
      case 'host_count_of_templates_by_org':
        return (zLabel = 'Host count');
      default:
        return zLabel;
    }
  }

  function findZLabelValue() {
    let zLabelValue = '';
    switch (queryParams.adoption_rate_type) {
      case 'elapsed_of_templates_by_org':
        return (zLabelValue = 'customdata.elapsed');
      case 'job_count_of_templates_by_org':
        return (zLabelValue = 'customdata.total_count');
      case 'task_count_of_templates_by_org':
        return (zLabelValue = 'customdata.host_task_count');
      case 'host_count_of_templates_by_org':
        return (zLabelValue = 'customdata.host_count');
      default:
        return zLabelValue;
    }
  }

  const orgArray = items.map(function (el) {
    return el.org_name;
  });
  const templateCountArray = items.map(function (el) {
    return el.template_count;
  });
  const ZArray = items.map(function (el) {
    switch (queryParams.adoption_rate_type) {
      case 'elapsed_of_templates_by_org':
        return el.elapsed;
      case 'job_count_of_templates_by_org':
        return el.total_count;
      case 'task_count_of_templates_by_org':
        return el.host_task_count;
      case 'host_count_of_templates_by_org':
        return el.host_count;
      default:
        return null;
    }
  });

  const bg = chartBackground();
  const text = chartText();
  const textSecondary = chartTextSecondary();
  const grid = chartGridColor();
  const tooltipBg = chartTooltipBg();

  const state = {
    config: {
      modeBarButtonsToRemove: ['zoom'],
      displaylogo: false,
      responsive: true,
    },
    data: [
      {
        customdata: items,
        hovertemplate: ` <br>  <b>${xLabel}</b>: %{${xLabelValue}}  <br>  <b>${yToolTipLabel}</b>: %{${yToolTipLabelValue}}  <br>  <b>${findZLabel()}</b>: %{${findZLabelValue()}}  <br> `,
        marker: {
          color: ZArray,
          coloraxis: 'coloraxis',
        },
        name: '',
        x: orgArray,
        y: templateCountArray,
        type: 'bar',
      },
    ],
    layout: {
      template: {
        data: {
          bar: [
            {
              error_x: {
                color: textSecondary,
              },
              error_y: {
                color: textSecondary,
              },
              marker: {
                line: {
                  color: bg,
                  width: 0.5,
                },
                pattern: {
                  fillmode: 'overlay',
                  size: 10,
                  solidity: 0.2,
                },
              },
              type: 'bar',
            },
          ],
        },
        layout: {
          hoverlabel: {
            align: 'left',
          },
          hovermode: 'closest',
          paper_bgcolor: bg,
          plot_bgcolor: bg,
          xaxis: {
            automargin: true,
            gridcolor: grid,
            linecolor: grid,
            title: {
              standoff: 15,
            },
            zerolinecolor: grid,
            zerolinewidth: 2,
          },
          yaxis: {
            automargin: true,
            gridcolor: grid,
            linecolor: grid,
            title: {
              standoff: 15,
            },
            zerolinecolor: grid,
            zerolinewidth: 2,
          },
        },
      },
      xaxis: {
        tickangle: -45,
        title: {
          text: `${xLabel}`,
          font: {
            family:
              'RedHatText, Overpass, overpass, helvetica, arial, sans-serif',
            size: 15,
            color: text,
          },
        },
      },
      yaxis: {
        anchor: 'x',
        domain: [0.0, 1.0],
        title: {
          text: `${yLabel}`,
          font: {
            family:
              'RedHatText, Overpass, overpass, helvetica, arial, sans-serif',
            size: 15,
            color: text,
          },
        },
        color: textSecondary,
      },
      coloraxis: {
        colorbar: {
          title: {
            text: `${findZLabel()}`,
            font: {
              color: textSecondary,
              family:
                'RedHatText, Overpass, overpass, helvetica, arial, sans-serif',
              size: 15,
            },
          },
          tickfont: {
            color: textSecondary,
            family:
              'RedHatText, Overpass, overpass, helvetica, arial, sans-serif',
            size: 15,
          },
        },
        colorscale: [
          [0.0, '#0066CC'],
          [0.2, '#004B95'],
          [0.4, '#5752D1'],
          [0.6, '#3C3D99'],
          [0.8, '#C9190B'],
          [1.0, '#A30000'],
        ],
      },
      legend: {
        title: {
          font: {
            family:
              'RedHatText, Overpass, overpass, helvetica, arial, sans-serif',
            color: textSecondary,
          },
        },
        font: {
          size: 10,
        },
      },
      margin: {
        t: 30,
      },
      font: {
        family: 'RedHatText, Overpass, overpass, helvetica, arial, sans-serif',
        size: 14,
        color: textSecondary,
      },
      title: {
        font: {
          family:
            'RedHatText, Overpass, overpass, helvetica, arial, sans-serif',
          color: textSecondary,
          size: 15,
        },
      },
      hoverlabel: {
        font: {
          size: 14,
          family:
            'RedHatText, Overpass, overpass, helvetica, arial, sans-serif',
        },
        bgcolor: tooltipBg,
      },
      style: { cursor: 'auto' },
    },
    style: { height: '500px', width: '100%' },
  };

  return <Plot {...state} />;
};

PlotlyChart.propTypes = {
  data: PropTypes.array,
};

export default PlotlyChart;
