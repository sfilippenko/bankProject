import {fromJS} from 'immutable';
import commonReducer from './commonReducer';

const initialState = fromJS({
    data: [
        {
            id: 'first',
            data: {
                inn: '1234567890',
                ogrn: '123456789012',
                fullName: 'Puzer Puzerovich my love only to you dsf sdf dfg sdfh fgh fgh sdfg sdfg sdfg sdf gsdf gsadfg dfg'
            },
            type: 1,
            position: {x: 100, y: 100},
            zIndex: 0
        }, {
            id: 'second',
            data: {
                inn: '1234567890',
                ogrn: '123456789012',
                fullName: 'Puzer Puzerovich my love only to you'
            },
            type: 1,
            position: {x: 400, y: 100},
            zIndex: 0
        }, {
            id: 'third',
            data: {
                inn: '1234567890',
                fullName: 'Это здание без ОГРН'
            },
            type: 2,
            position: {x: 100, y: 600},
            zIndex: 0
        }, {
            id: 'forth',
            data: {
                inn: '1234567890',
                ogrn: '123456789012',
                fullName: 'Puzer Puzerovich my love only to you dsf sdf dfg sdfh fgh fgh'
            },
            type: 1,
            position: {x: 300, y: 400},
            zIndex: 0
        },
    ],
    signs: [
        {value: 'Надпись1', zIndex: 0, position: {x: 140, y: 350}},
        {value: 'Не надпись', zIndex: 0, position: {x: 460, y: 300}},
    ],
    drawConnections: [
        //{from: {id: 'first', x: 100, y: 150}, to: {id: 'second', x: 700, y: 150}}
    ],
    hardConnections: [
        {from: 'first', to: 'second'},
        {from: 'first', to: 'third'},
        {from: 'second', to: 'forth'},
    ],
});

export default function drawing(state = initialState, action) {
    switch (action.type) {
        default:
            return commonReducer('drawing', state, action, initialState);
    }
}