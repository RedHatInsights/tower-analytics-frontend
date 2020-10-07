/*eslint-disable */

import React from 'react';
import { useState, useEffect } from 'react';
import { useRef } from 'react';
import useResizeObserver from 'use-resize-observer';
//import Dimensions from 'react-dimensions'

import { Chart, ChartBar, ChartAxis, ChartStack, ChartThemeColor, ChartTooltip } from '@patternfly/react-charts';

import { ChartThemeDefinition } from '@patternfly/react-charts';

import { ChartLegend } from '@patternfly/react-charts';
import { ChartGroup } from '@patternfly/react-charts';

import * as d3 from 'd3';

/*
const useResize = (myRef) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setWidth(myRef.current.offsetWidth)
      setHeight(myRef.current.offsetHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [myRef])

  return { width, height }
}
*/

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

const getWidth = (id) => {
    let width;
    console.log('select', d3.select('#' + id));
    console.log('select style', d3.select('#' + id).style);
    console.log('select style.width', d3.select('#' + id).style.width);
    //console.log('select style()', d3.select('#' + id).style());
    //console.log('select style width', d3.select('#' + id).style('width'));
    console.log('select node', d3.select('#' + id).node());
    let thisNode = d3.select('#' + id).node();
    console.log('thisNode', thisNode);


    /*
    let xWidth = null;
    let count = 0;
    while (xWidth === null) {
        console.log('count', count);
        thisNode = d3.select(thisNode.parent).node();
        //console.log(count, thisNode.style.width);
        console.log(count, thisNode);
        count = count + 1;
        if ( count > 100 ) {
            xWidth = 0; 
        }
    }
    */

    //width = parseInt(d3.select('#' + id).style('width'))
    //return width;

    return 1000;
};

const getHeight = (id) => {
    let height;
    height = parseInt(d3.select('#' + id).style('height'))
    return height;
};

const TemplateHostStatuses = (props) =>{

  const ref = useRef(null);
  //const [ xWidth, setXwidth ] = useState(1000);
  //const [ yHeight, setYheight ] = useState(90);
  const { width = 100, height } = useResizeObserver({ ref });

  const parentid = props.parentid;
  console.log('parentid', parentid);
  //const width = getWidth(parentid);
  const twidth = getWidth(parentid);
  console.log('twidth', twidth);
  //const width = 1600;

  //const width = 900;
  const divHeight = 90;
  //const height = 90;
  const hostCount = 10;
  const taskCount = 15;

  let testdata = [
    {'name': 'ok', x: '', y: 62, y0: null, label: 'Ok'},
    {'name': 'skipped', x: '', y: 15, y0: null, label: 'Skipped'},
    {'name': 'changed', x: '', y: 8, y0: null, label: 'Changed'},
    {'name': 'failed', x: '', y: 10, y0: null, label: 'Failed'},
    {'name': 'unreachable', x: '', y: 5, y0: null, label: 'Unreachable'},
  ];

  let legendData = [];
  let ytotal = 0;
  testdata.forEach((x,idx) => {
    testdata[idx]['y0'] = ytotal;
    ytotal = ytotal + x.y + .2;
    legendData.push({
        name: `${x.label} ${x.y}%` ,
        symbol: {
            fill: colorSwitcher(x)
        }
    })
  })


  /*
  useEffect(() => {
      console.log('###########################################');
      console.log('width', ref.current ? ref.current.offsetWidth : 0);
      console.log('###########################################');
      setXwidth(ref.current.offsetWidth);
      setYheight(ref.current.offsetHeight);
  }, [ref.current]);
  */

  //let theme = { ...ChartThemeColor.purple };
  //console.log('theme', theme);
  //let theme = ['blue', 'red', 'yellow', 'pink'];

  //      padding={{ top: 0, bottom: 0 }}
  //      padding={{ left: 0, right: 0 }}
  //      legendPosition="bottom"
    //
  //      width={ width }
  //      height={ height }
  //      domainPadding={{ x: [0, 0], y: [0,0] }}

  return (
    <div style={{ marginTop: '0px', marginLeft: '0px'}}>
    {/*<div style={{ height: `${height}px`, width: `${width}px`, background: 'white', border: '2px solid red' }}> */}
    <div ref={ ref } style={{ height: `${divHeight}px`, width: '100%', background: 'white', border: '2px solid red' }}>
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
          style={{ title: {fontSize: 14, fontWeight: 'normal' } }}
          padding={ 100 }
          y={ divHeight - 70 }
          x={ 10 }
          gutter={ 0 }
          data={ [] }
        />

        <ChartLegend
          title={ `Tasks ${taskCount}` }
          gutter={ 0 }
          x={ width - 200 }
          y={ divHeight - 70 }
          titleOrientation='right'
          padding={{ left: 100, right: 100}}
          data={ [] }
        />

        <ChartLegend
          title={ `Hosts ${hostCount}` }
          gutter={ 0 }
          x={ width - 120 }
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
          { testdata.map((bit,idx) => {
            bit['fill'] = colorSwitcher(bit);
            return (
              <ChartBar
                key={ idx }
                barHeight={ 0 }
                padding= {{ top: 0, bottom: 0 }}
                domainPadding={{ x: [0, 0], y: [0,0] }}
                style={{
                  data : {
                    fill: colorSwitcher(bit)
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
