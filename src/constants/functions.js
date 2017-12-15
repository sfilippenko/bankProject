export const itterateObj = (obj = {}, paintFieldsCallback) => {
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        if (!obj[key]) {
            paintFieldsCallback(true);
            return false;
        }
    }
    return true;
};

export const convertDate = (dateMS, showTime) => {
    if (dateMS) {
        const dateObj = new Date(Number(dateMS));
        let date = dateObj.getDate();
        if (date < 10) date = '0' + date;
        let month = dateObj.getMonth() + 1;
        if (month < 10) month = '0' + month;
        const year = dateObj.getFullYear();
        if (showTime) {
            let hours = dateObj.getHours();
            if (hours < 10) hours = '0' + hours;
            let minutes = dateObj.getMinutes();
            if (minutes < 10) minutes = '0' + minutes;
            return `${date}.${month}.${year}, ${hours}:${minutes}`;
        }
        return `${date}.${month}.${year}`;
    }
    return '';
};

export const getDateMS = (dateStr) => new Date(dateStr).valueOf();

export const countArrSum = (arr = []) => arr.reduce((prev, next, i) => (i === 1 ? prev.amount : prev) + next.amount);

export const getModelName = (id, ref, labelKey = 'name', valueKey = 'internalId') => {
    let str = '';
    ref.forEach((item) => {
        if (item.get(valueKey) === id) str = item.get(labelKey);
    });
    return str;
};