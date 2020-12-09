/* eslint-disable */
import React, {useEffect, useState} from 'react';
import Proptypes from 'prop-types';
import styled from 'styled-components';

import { Chart, ChartBar, ChartAxis, ChartStack, ChartThemeColor, ChartTooltip } from '@patternfly/react-charts';
import { ChartThemeDefinition } from '@patternfly/react-charts';
import { ChartLegend } from '@patternfly/react-charts';
import { ChartGroup } from '@patternfly/react-charts';

import * as d3 from 'd3';

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

const JobExplorerHostChart = (props) => {

    const { data } = props;

    console.log('data', data);

    if (data.most_failed_tasks === null) {
        return null;
    }

    return 'Success!'
};

export default JobExplorerHostChart;