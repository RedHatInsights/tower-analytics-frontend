import moment from 'moment';

export function trimStr(str) {
    return str.toString().replace(/['"]+/g, '');
}

export function formatDateTime(dateTime) {
    return moment(dateTime).format('M/D/YYYY h:mma');
}

export function formatSeconds(seconds) {
    return moment.utc().startOf('day')
    .seconds(seconds)
    .format('H:mm:ss');
}

export function getTotal(data) {
    if (!data) {
        return;
    } else {
        let total = 0;
        data.forEach(datum => {
            total += parseInt(datum.count);
        });
        return total;
    }
}

export function formatPercentage(val) {
    if (!parseInt(val)) {
        return;
    }

    return `${val}%`;
}

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
    return mins * 60;
}

export function convertSecondsToHours(seconds) {
    return seconds / 3600;
}
