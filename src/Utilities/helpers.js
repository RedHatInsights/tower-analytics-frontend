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
