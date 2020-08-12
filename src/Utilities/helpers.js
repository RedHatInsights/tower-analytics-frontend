import moment from 'moment';

export function trimStr(str) {
    return str.toString().replace(/['"]+/g, '');
}

export function formatDateTime(dateTime) {
    return moment(new Date(dateTime).toISOString()).utc().format('M/D/YYYY h:mm:ssa');
}

export function formatDate(date) {
    return moment(date).utc().format('YYYY-MM-DD');
}

export function formatSeconds(seconds) {
    return moment.utc().startOf('day')
    .seconds(seconds)
    .format('H:mm:ss');
}

export function formatPercentage(val) {
    if (!parseFloat(val)) {
        return;
    }

    return `${val}%`;
}

export const capitalize = (s) => {
    if (typeof s !== 'string') {return '';}

    return s.charAt(0).toUpperCase() + s.slice(1);
};

export function calculateDelta(a, b) {
    if (!parseInt(b)) {
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
    return ms / 60000;
}

export function convertSecondsToMins(seconds) {
    return seconds / 60;
}

export function convertMinsToSeconds(mins) {
    if (!parseInt(mins) || parseInt(mins) < 0) {
        return 0;
    }

    return +parseInt(mins) * 60;
}

export function convertSecondsToHours(seconds) {
    return seconds / 3600;
}

export function convertWithCommas(arr, key) {
    const split = arr.reduce((strs, datum) => { strs.push(datum[key]); return strs; }, []);
    return split.join(', ');
}

export function formatJobType(type) {
    return (type === 'job' ? 'Playbook run' : 'Workflow job');
}

export function formatJobStatus(status) {
    return (status === 'successful' ? 'Success' : 'Failed');
}

export function formatJobDetailsURL(baseURL, jobId) {
    const subDirectory1 = 'job';
    const subDirectory2 = 'details';
    return `${baseURL}/#/${subDirectory1}/${jobId}/${subDirectory2}/`;
}
