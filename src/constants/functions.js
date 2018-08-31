import {fromJS} from 'immutable';

export const getModelName = (id, model = fromJS([]), labelKey = 'name', valueKey = 'internalId') => {
    let str = '';
    model.forEach((item) => {
        if (item.get(valueKey) == id) str = item.get(labelKey);
    });
    return str;
};

export const getFullName = (obj) => {
    const clientType = obj.get('clientType');
    let fullName;
    if (clientType === 3) {
        const lastName = obj.getIn(['personIdentity', 'lastName']) || '';
        const firstName = lastName && obj.getIn(['personIdentity', 'firstName']) || '';
        const secondName = firstName && obj.getIn(['personIdentity', 'secondName']) || '';
        fullName = (`${lastName} ${firstName} ${secondName}`).trim();
    } else {
        fullName = obj.getIn(['legalIdentity', 'fullName'])
    }
    return fullName;
};

export const getShortName = (obj) => {
    const clientType = obj.get('clientType');
    let shortName;
    if (clientType === 3) {
        const lastName = obj.getIn(['personIdentity', 'lastName']) || '';
        let firstName = lastName && obj.getIn(['personIdentity', 'firstName']) || '';
        if (firstName) {
            firstName = firstName[0] + '.';
        }
        let secondName = firstName && obj.getIn(['personIdentity', 'secondName']) || '';
        if (secondName) {
            secondName = secondName[0] + '.';
        }
        shortName = (`${lastName} ${firstName}${secondName}`).trim();
    } else {
        shortName = obj.getIn(['legalIdentity', 'shortName']) || obj.getIn(['legalIdentity', 'fullName'])
    }
    return shortName;
};

export const sortByRef = (ref = fromJS([]), aParam, bParam, key = 'internalId') => {
    let aIndex = null;
    let bIndex = null;
    ref.forEach((item, i) => {
        if (aIndex !== null && bIndex !== null) return null;
        const internalId = item.get(key);
        if (internalId === aParam) {
            aIndex = i;
        }
        if (internalId === bParam) {
            bIndex = i;
        }
    });
    return {aIndex, bIndex};
};

export const getRolesArr = (gsz, id, ref = fromJS([])) => {
    const readonlyConnectionList = gsz.get('readonlyConnectionList');
    let arr = fromJS([]);
    readonlyConnectionList && readonlyConnectionList.filter((item) => item.get('fromClientId') === id).forEach((item) => {
        const roleId = item.get('roleId');
        if (!arr.includes(roleId)) {
            arr = arr.push(roleId);
        }
    });
    arr = arr.sort((a, b) => {
        const {aIndex, bIndex} = sortByRef(ref, a, b);
        return aIndex - bIndex;
    });
    return arr;
};

export const getValueFromAttributeList = (list, name) => {
    list = list || fromJS([]);
    let value = null;
    list.forEach((attribute) => {
        if (value !== null) return null;
        if (attribute.get('name') === name) {
            value = attribute.get('value');
        }
    });
    return value;
};

export const convertClientIdentityList = (clientIdentityList, parse) => {
    if (parse) {
        clientIdentityList = clientIdentityList.map((item) => {
            let visualProperties;
            try {
                visualProperties = fromJS(JSON.parse(item.get('visualProperties')));
            } catch (e) {
                visualProperties = item.get('visualProperties');
            }
            return item.set('visualProperties', visualProperties);
        }).sort((a, b) => getShortName(a) > getShortName(b) ? 1 : -1);
    } else {
        clientIdentityList = clientIdentityList.map((item) => {
            let visualProperties = item.get('visualProperties');
            if (typeof visualProperties !== 'string') {
                visualProperties = JSON.stringify(visualProperties);
            }
            return item.set('visualProperties', visualProperties);
        });
    }
    return clientIdentityList;
};