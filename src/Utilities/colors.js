import { scaleOrdinal } from 'd3';

const pfmulti = [
    '#06C',
    '#4CB140',
    '#009596',
    '#5752D1',
    '#F4C145',
    '#EC7A08',
    '#8BC1F7',
    '#23511E',
    '#A2D9D9',
    '#2A265F',
    '#F9E0A2',
    '#8F4700',
    '#002F5D'
];

/**
 * Creates a color map to names: for same data generates same colors.
 * @param  {[{ name }]} data    Array of objects with name options to map to.
 * @return {{ [name]: color }}  Object where the keys are the names an the values are the colors.
 */
export const getColorForNames = (data) => {
    const colorFnc = scaleOrdinal(pfmulti);
    const compObj = prop => (a, b) => (a[prop] > b[prop]) ? 1 : ((b[prop] > a[prop]) ? -1 : 0);

    const colors = data.sort(compObj('name')).reduce((colors, org) => {
        colors[org.name] = colorFnc(org.name);
        return colors;
    }, {});

    return colors;
};

export { pfmulti };
