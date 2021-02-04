/*eslint-disable */
import React from 'react';
import { useRef } from 'react';
import useResizeObserver from 'use-resize-observer';

import { Chart, ChartBar, ChartAxis, ChartStack, ChartTooltip } from '@patternfly/react-charts';
import { ChartLegend } from '@patternfly/react-charts';

const colorSwitcher = (bit) => {
    let color = 'black';
    switch(bit.name) {
        case 'ok':
            color = 'green';
            break;
        case 'skipped':
            color = 'blue';
            break
        case 'changed':
            color = 'orange';
            break;
        case 'failed':
            color = 'red';
            break;
        case 'unreachable':
            color = 'darkred';
            break;
    }
    return color;
}

const TemplateHostStatuses = (props) =>{

  const { data } = props;

  // set a ref on the containing div to track for resizes ...
  const ref = useRef(null);
  const { width = 100 } = useResizeObserver({ ref });

  // we want a static height ...
  const divHeight = 90;

  // TODO: what is the shape of the api data? ...
  const hostCount = data.host_count;
  const taskCount = data.total_count;

  const ok_pos = Math.floor((data.ok_host_count / data.host_count) * 100);
  const changed_pos = Math.floor((data.changed_host_count / data.host_count) * 100);
  const skipped_pos = Math.floor((data.skipped_host_count / data.host_count) * 100);
  const failed_pos = Math.floor((data.failed_host_count / data.host_count) * 100);
  const unreachable_pos = Math.floor((data.unreachable_host_count / data.host_count) * 100);

  let chartData = [
    {'name': 'ok', x: '', y: ok_pos, y0: null, label: 'Ok'},
    {'name': 'skipped', x: '', y: skipped_pos, y0: null, label: 'Skipped'},
    {'name': 'changed', x: '', y: changed_pos, y0: null, label: 'Changed'},
    {'name': 'failed', x: '', y: failed_pos, y0: null, label: 'Failed'},
    {'name': 'unreachable', x: '', y: unreachable_pos, y0: null, label: 'Unreachable'},
  ];

  // set the fill color and "y" axis offset for each subbar ...
  let legendData = [];
  let ytotal = 0;
  chartData.forEach((x,idx) => {
    chartData[idx]['y0'] = ytotal;
    ytotal = ytotal + x.y + .2;
    legendData.push({
        name: `${x.label} ${x.y}%`,
        symbol: {
            fill: colorSwitcher(x)
        }
    })
  })

  return (
    <div style={{ marginTop: '0px', marginLeft: '0px'}}>
    <div ref={ ref } style={{ height: `${divHeight}px`, width: '100%', background: 'white'}}>
      <Chart
        ariaDesc="job status summary"
        ariaTitle="Job Statuses"
        padding={{ left: 10, right: 10, top: 0, bottom: 0 }}
        height={ divHeight }
        width={ width }
      >

        <ChartLegend
          title='Host Status'
          titleOrientation='left'
          style={{ title: {fontSize: 14, fontWeight: 900 } }}
          padding={ 100 }
          y={ divHeight - 70 }
          x={ 10 }
          gutter={ 0 }
          data={ [] }
        />

        {/* Task Count */}
        <ChartLegend
          title='Tasks'
          gutter={ 0 }
          x={ width - 200 }
          y={ divHeight - 70 }
          titleOrientation='right'
          padding={{ left: 100, right: 100}}
          data={ [] }
        />

        <ChartLegend
          title={ `${taskCount}` }
          style={{title: {fontWeight: 900}}}
          gutter={ 0 }
          x={ width - 147 }
          y={ divHeight - 70 }
          titleOrientation='right'
          padding={{ left: 100, right: 100}}
          data={ [] }
        />
        
        {/* Host count */}
        <ChartLegend
          title='Hosts'
          gutter={ 0 }
          x={ width - 120 }
          y={ divHeight - 70 }
          titleOrientation='right'
          data={[]}
        />

        <ChartLegend
          title={ `${hostCount}` }
          style={{title: {fontWeight: 900}}}
          gutter={ 0 }
          x={ width - 75 }
          y={ divHeight - 70 }
          titleOrientation='right'
          data={[]}
        />  

        {/* status colors */}
        <ChartLegend
          gutter={ 20 }
          data={ legendData }
          titleOrientation='right'
          y={ divHeight - 40 }
          x={ width - 585 }
          style={{
            data: {
              fontSize: 35,
            }
          }}
        />

        {/* horizontal axis */}
        <ChartAxis
              label=""
              showGrid={ false }
              style={{
                axis: {stroke: "transparent"}, 
                axisLabel: {
                    padding: 0
                },
                ticks: {stroke: "transparent"},
                tickLabels: { fill: "none" }
              }}
        />

        {/* vertical axis */}
        <ChartAxis 
              label=""
              dependantAxis
              showGrid={ false } 
              style={{
                axis: {stroke: "transparent"}, 
                axisLabel: {
                    padding: 0
                },
                ticks: {stroke: "transparent"},
                tickLabels: { fill:"none" }
              }}
        />

        {/* bars */}
        <ChartStack horizontal domainPadding={{x: [0, 0], y: [0, 0]}}>
          { chartData.map((bit,idx) => {
            bit['fill'] = colorSwitcher(bit);
            return (
              <ChartBar
                key={ idx }
                barHeight={ 0 }
                padding= {{ top: 0, bottom: 0 }}
                domainPadding={{ x: [0, 0], y: [0,0] }}
                style={{
                  data : {
                    fill: colorSwitcher(bit),
                  }
                }}
                data={[ bit ]}
                labelComponent={<ChartTooltip />}
              />
            )
          })}
        </ChartStack>
      </Chart>
    </div>
    </div>
  )
}

export default TemplateHostStatuses;
