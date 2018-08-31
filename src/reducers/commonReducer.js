import {fromJS} from 'immutable';
import actionTypes from '../constants/actionTypes';


export default function commonReducer(form, state, action) {
    switch (action.type) {
        case `${form}.${actionTypes.eventFieldChange}`: {
            const {path, value} = action.payload;
            return state.setIn(path, value instanceof fromJS ? value : fromJS(value));
        }
        default:
            return state;
    }
}