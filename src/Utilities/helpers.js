import moment from 'moment';
import {
  encodeNonDefaultQueryString,
  mergeParams,
  parseQueryString,
  removeParams,
  replaceParams,
} from './qs';

/*
 * isNumeric - return true if input is a real number
 */
export function isNumeric(val) {
  if (val === 0 || val === '0') {
    return true;
  }

  if (parseInt(val)) {
    return true;
  }

  if (parseFloat(val)) {
    return true;
  }

  return false;
}

export function trimStr(str) {
  return str.toString().replace(/['"]+/g, '');
}

export function formatDateTime(dateTime) {
  return moment(new Date(dateTime).toISOString()).format('M/D/YYYY h:mm:ssa');
}

export function formatDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

export function formatSeconds(seconds) {
  return moment().startOf('day').seconds(seconds).format('H:mm:ss');
}

export function getTotal(data) {
  if (!data) {
    return;
  } else {
    let total = 0;
    data.forEach((datum) => {
      total += parseInt(datum.count);
    });
    return total;
  }
}

export function formatPercentage(val) {
  if (isNaN(val)) {
    return;
  }

  return `${val}%`;
}

export const capitalize = (s) => {
  if (typeof s !== 'string') {
    return '';
  }

  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function calculateDelta(a, b) {
  if (!isNumeric(a) || !isNumeric(b)) {
    return 0;
  }

  // never return less than zero ...
  if (b - a < 0) {
    return 0;
  }

  return b - a;
}

export function convertMinsToMs(mins) {
  if (!parseInt(mins)) {
    return 0;
  }

  return mins * 60000;
}

export function convertMsToMins(ms) {
  if (!parseInt(ms)) {
    return 0;
  }

  return ms / 60000;
}

export function convertSecondsToMins(seconds) {
  if (!parseInt(seconds)) {
    return 0;
  }

  return seconds / 60;
}

export function convertMinsToSeconds(mins) {
  if (!parseInt(mins) || parseInt(mins) < 0) {
    return 0;
  }

  return +parseInt(mins) * 60;
}

export function convertSecondsToHours(seconds) {
  if (!parseInt(seconds)) {
    return 0;
  }

  return seconds / 3600;
}

export function convertWithCommas(arr, key) {
  const split = arr.reduce((strs, datum) => {
    strs.push(datum[key]);
    return strs;
  }, []);
  return split.join(', ');
}

export function formatJobType(type) {
  return type === 'job' ? 'Playbook run' : 'Workflow job';
}

export function formatJobStatus(status) {
  return status === 'successful' ? 'Success' : 'Failed';
}

export function formatJobDetailsURL(baseURL, jobId) {
  const subDirectory1 = 'job';
  const subDirectory2 = 'details';
  return `${baseURL}/#/${subDirectory1}/${jobId}/${subDirectory2}/`;
}

// export const handleSearch = (key, value, qsConfig, history) => {
//   let params = parseQueryString(qsConfig, history.location.search);
//   params = mergeParams(params, { [key]: value });
//   //params = replaceParams(params, { page: 1 });
//   if (value === '' || value.length === 0)
//     params = removeParams(qsConfig, params, {[key]: params[key]});
//   pushHistoryState(params, qsConfig);
// }

export const handleSearch = (key, value, qsConfig, history) => {
  let params = parseQueryString(qsConfig, history.location.search);
  params = replaceParams(params, { [key]: value });
  params = mergeParams(params, { [key]: value });
  if (value === '' || value.length === 0)
    params = removeParams(qsConfig, params, { [key]: params[key] });
  pushHistoryState(params, qsConfig, history);
};

export const pushHistoryState = (params, qsConfig, history) => {
  const { pathname } = history.location;
  const nonNamespacedParams = parseQueryString({}, history.location.search);
  const encodedParams = encodeNonDefaultQueryString(
    qsConfig,
    params,
    nonNamespacedParams
  );
  history.push(encodedParams ? `${pathname}?${encodedParams}` : pathname);
};
