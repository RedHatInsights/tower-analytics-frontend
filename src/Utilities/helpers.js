import moment from 'moment';

export function trimStr(str) {
    return str.toString().replace(/['"]+/g, '');
}

export function formatDateTime(dateTime) {
    return moment(dateTime).format('M/D/YYYY h:mma');
}

export function formatSeconds(seconds) {
    return moment().startOf('day')
    .seconds(seconds)
    .format('H:mm:ss');
}
