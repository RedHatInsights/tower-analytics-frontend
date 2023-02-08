import React from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
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

  const state = {
    config: {
      modeBarButtonsToRemove: ['zoom'],
      displaylogo: false,
      responsive: true,
    },
    data: [
      {
        customdata: items, //customization: items from API
        hovertemplate: ` <br>  <b>${xLabel}</b>: %{${xLabelValue}}  <br>  <b>${yToolTipLabel}</b>: %{${yToolTipLabelValue}}  <br>  <b>${findZLabel()}</b>: %{${findZLabelValue()}}  <br> `, //customization: All labels and values defined above
        marker: {
          color: ZArray, //customization: Derived from items
          coloraxis: 'coloraxis',
        },
        name: '',
        x: orgArray, //customization: Derived from items
        y: templateCountArray, //customization: Derived from items
        type: 'bar',
      },
    ],
    layout: {
      template: {
        data: {
          bar: [
            {
              error_x: {
                color: '#2a3f5f',
              },
              error_y: {
                color: '#2a3f5f',
              },
              marker: {
                line: {
                  color: 'white',
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
          paper_bgcolor: 'white',
          plot_bgcolor: 'white',
          xaxis: {
            automargin: true,
            gridcolor: '#D2D2D2',
            linecolor: '#D2D2D2',
            title: {
              standoff: 15,
            },
            zerolinecolor: '#D2D2D2',
            zerolinewidth: 2,
          },
          yaxis: {
            automargin: true,
            gridcolor: '#D2D2D2',
            linecolor: '#D2D2D2',
            title: {
              standoff: 15,
            },
            zerolinecolor: '#D2D2D2',
            zerolinewidth: 2,
          },
        },
      },
      xaxis: {
        tickangle: -45,
        title: {
          text: `${xLabel}`, //customization: All labels defined above
          font: {
            family:
              'RedHatText, Overpass, overpass, helvetica, arial, sans-serif',
            size: 15,
            color: 'black',
          },
        },
      },
      yaxis: {
        anchor: 'x',
        domain: [0.0, 1.0],
        title: {
          text: `${yLabel}`, //customization: All labels defined above
          font: {
            family:
              'RedHatText, Overpass, overpass, helvetica, arial, sans-serif',
            size: 15,
            color: 'black',
          },
        },
        color: '#4f5255',
      },
      coloraxis: {
        colorbar: {
          title: {
            text: `${findZLabel()}`,
            font: {
              color: '#4f5255',
              family:
                'RedHatText, Overpass, overpass, helvetica, arial, sans-serif',
              size: 15,
            },
          },
          tickfont: {
            color: '#4f5255',
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
            color: '#4f5255',
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
        color: '#4f5255',
      },
      title: {
        font: {
          family:
            'RedHatText, Overpass, overpass, helvetica, arial, sans-serif',
          color: '#4f5255',
          size: 15,
        },
      },
      hoverlabel: {
        font: {
          size: 14,
          family:
            'RedHatText, Overpass, overpass, helvetica, arial, sans-serif',
        },
        bgcolor: '#151515',
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
