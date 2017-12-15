import {fromJS} from 'immutable';


export default function commonReducer(form, state, action, initialState) {
    switch (action.type) {
        case `${form}.EVENT_FIELD_CHANGE`: {
            const {path, value} = action.payload;
            return state.setIn(path, value instanceof fromJS ? value : fromJS(value));
        }
        case `${form}.ADD_ROW`: {
            const {path, fields} = action.payload;
            const list = state.getIn(path);
            const newList = list.push(fromJS(fields));
            return state.setIn([...path], newList);
        }
        case `${form}.DELETE_ROW`: {
            const {path, rowIndexesArr} = action.payload;
            const list = state.getIn(path);
            const newList = list.filter((item, index) => !rowIndexesArr.get(index));
            return state.setIn([...path], newList);
        }
        case `${form}.CLEAR_FORM_DATA`: {
            return initialState;
        }
        case `${form}.GET_FORM_DATA`: {
            const {data} = action.payload;
            let newState = state;
            if (data && data.intermediateState) {
                newState = newState.set('intermediateState', fromJS(JSON.parse(data.intermediateState)));
            }
            newState = newState.merge(fromJS(action.payload));
            return newState
        }
        default: return state;
    }
}