import React from 'react';

const container = document.getElementById('loader');

export const eventFieldChange = (form) => (path, value) => (dispatch) => {
    dispatch({
        type: `${form}.EVENT_FIELD_CHANGE`,
        payload: {path, value}
    })
};

export const addRow = (form) => (path, fields) => (dispatch) => {
    dispatch({
        type: `${form}.ADD_ROW`,
        payload: {path, fields}
    })
};

export const deleteRow = (form) => (path, rowIndexesArr) => (dispatch) => {
    dispatch({
        type: `${form}.DELETE_ROW`,
        payload: {path, rowIndexesArr}
    })
};