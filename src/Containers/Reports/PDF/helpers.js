import { global_disabled_color_300 } from '@patternfly/react-tokens';

// From utilities/helpers.js
const formatTotalTime = (elapsed) =>
  new Date(elapsed * 1000).toISOString().substr(11, 8);

// From Utilities/currencyFormatter
const currencyFormatter = (n) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(n); /* $2,500.00 */
};

const timeFields = ['elapsed'];
const costFields = [];

const isOther = (item, key) => key === 'id' && item[key] === -1;

export const getText = (item, key) => {
  if (isOther(item, key)) return '-';
  if (timeFields.includes(key)) return formatTotalTime(item[key]);
  if (costFields.includes(key)) return currencyFormatter(+item[key]);
  return `${item[key]}`;
};

export const getOthersStyle = (item, key) => {
  if (isOther(item, key)) {
    return {
      backgroundColor: global_disabled_color_300.value,
    };
  }
  return {};
};
