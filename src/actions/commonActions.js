import actionTypes from '../constants/actionTypes';

export const eventFieldChange = (form) => (path, value) => (dispatch) => {
    dispatch({
        type: `${form}.${actionTypes.eventFieldChange}`,
        payload: {path, value}
    })
};