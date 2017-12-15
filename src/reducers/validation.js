import {fromJS} from 'immutable';

const initialState = fromJS({
    fields: {},
    paintNotValidFields: false
});

export default function validationResult(state = initialState, action) {
    switch (action.type) {
        case 'SET_VALID_VALUE': {
            const {name, valid} = action.payload;
            return state.setIn(['fields', name], valid);
        }
        case 'SET_VALID_OBJ': {
            return state.set('fields', fromJS(action.payload));
        }
        case 'PAINT_FIELDS': {
            return state.set('paintNotValidFields', action.payload);
        }
        case 'RESET_VALIDATION': {
            return fromJS({fields: {}, paintNotValidFields: false});
        }
        default:
            return state;
    }
}